import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import type { ExtractedData, ExtractedField, DocumentType } from '../types';

// Set up PDF.js worker using Vite asset URL
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
}

/**
 * Parses a CSV file client-side using PapaParse
 */
export const parseCSV = (file: File): Promise<Record<string, any>[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        resolve(results.data as Record<string, any>[]);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

/**
 * Parses an XLSX/XLS workbook client-side using SheetJS
 */
export const parseXLSX = async (file: File): Promise<Record<string, any>[]> => {
  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return [];
    }
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    if (!worksheet) return [];
    const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
      defval: '',
      raw: false,
    });
    return jsonData;
  } catch (err) {
    console.error('Failed to parse Excel workbook:', err);
    return [];
  }
};

/**
 * Parses a PDF document client-side using PDF.js and extracts text per page
 */
export const parsePDF = async (
  file: File
): Promise<{ text: string; pages: { pageNumber: number; text: string }[] }> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const pages: { pageNumber: number; text: string }[] = [];
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => (item && typeof item.str === 'string' ? item.str : ''))
        .filter(Boolean)
        .join(' ');
      pages.push({ pageNumber: pageNum, text: pageText });
      fullText += `\n--- Page ${pageNum} ---\n` + pageText;
    }

    if (!fullText.trim()) {
      return {
        text: `[Scanned Document / No Extractable Text in ${file.name}]`,
        pages: [{ pageNumber: 1, text: `[Scanned Page: ${file.name}]` }],
      };
    }

    return { text: fullText, pages };
  } catch (err) {
    console.warn('PDF.js standard parse failed:', err);
    return {
      text: `[Unreadable or Encrypted PDF: ${file.name}]`,
      pages: [{ pageNumber: 1, text: `[Encrypted/Unreadable PDF: ${file.name}]` }],
    };
  }
};

/**
 * Parses a JSON document client-side
 */
export const parseJSON = async (file: File): Promise<any> => {
  try {
    const text = await file.text();
    return JSON.parse(text);
  } catch (err) {
    console.error('Failed to parse JSON document:', err);
    return [];
  }
};

// Helper: parse numbers from dirty text strings like "RM 1,315,600.00", "(28,000)", "-RM 45k", "1.2M"
const parseNumericValue = (raw: any): number => {
  if (typeof raw === 'number') return raw;
  if (!raw) return 0;
  let str = String(raw).trim();
  const isNegative = str.includes('(') || str.startsWith('-') || str.toLowerCase().includes('minus');

  // Check multiplier k/m
  const lower = str.toLowerCase();
  let multiplier = 1;
  if (lower.endsWith('k')) multiplier = 1000;
  else if (lower.endsWith('m') || lower.endsWith('mil')) multiplier = 1000000;

  // Remove currency symbols & non-numeric except . and ,
  str = str.replace(/[^0-9.,]/g, '');
  if (!str) return 0;

  // Handle formats like 1,315,600.00 vs 1.315.600,00
  if (str.includes(',') && str.includes('.')) {
    if (str.lastIndexOf(',') > str.lastIndexOf('.')) {
      // European format: 1.315.600,00 -> 1315600.00
      str = str.replace(/\./g, '').replace(',', '.');
    } else {
      // Standard format: 1,315,600.00 -> 1315600.00
      str = str.replace(/,/g, '');
    }
  } else if (str.includes(',')) {
    const parts = str.split(',');
    if (parts.length === 2 && parts[1].length === 2) {
      str = str.replace(',', '.');
    } else {
      str = str.replace(/,/g, '');
    }
  }

  // If still multiple dots (e.g. 1.315.600), keep only the last one as decimal separator
  const dotCount = (str.match(/\./g) || []).length;
  if (dotCount > 1) {
    const lastDotIndex = str.lastIndexOf('.');
    str = str.substring(0, lastDotIndex).replace(/\./g, '') + str.substring(lastDotIndex);
  }

  const num = parseFloat(str);
  if (isNaN(num)) return 0;
  const result = num * multiplier;
  return isNegative ? -result : result;
};

interface KeywordRule {
  key: string;
  label: string;
  category: 'incomeStatement' | 'balanceSheet' | 'cashFlow';
  keywords: string[];
}

const FINANCIAL_KEYWORD_RULES: KeywordRule[] = [
  // Income Statement
  {
    key: 'revenue',
    label: 'Total Revenue',
    category: 'incomeStatement',
    keywords: [
      'revenue',
      'total sales',
      'turnover',
      'gross sales',
      'jualan',
      'jumlah jualan',
      'pendapatan',
      'grand total',
      'total amount',
      'amount due',
      'jumlah bayaran',
      'jumlah keseluruhan',
      'total invoice',
      'invoice total',
      'sales total',
    ],
  },
  {
    key: 'costOfSales',
    label: 'Cost of Goods Sold (COGS)',
    category: 'incomeStatement',
    keywords: [
      'cost of sales',
      'cost of goods sold',
      'cogs',
      'kos jualan',
      'kos barangan dijual',
      'materials cost',
      'direct cost',
      'kos langsung',
      'supplier cost',
    ],
  },
  {
    key: 'grossProfit',
    label: 'Gross Profit',
    category: 'incomeStatement',
    keywords: ['gross profit', 'untung kasar', 'laba kotor', 'margin kasar'],
  },
  {
    key: 'operatingExpenses',
    label: 'Operating Expenses',
    category: 'incomeStatement',
    keywords: [
      'operating expenses',
      'opex',
      'operating expenditure',
      'perbelanjaan operasi',
      'kos operasi',
      'administrative expenses',
      'overhead',
      'utilities',
      'sewa',
      'gaji',
      'salaries',
    ],
  },
  {
    key: 'netProfit',
    label: 'Net Profit',
    category: 'incomeStatement',
    keywords: [
      'net profit',
      'net income',
      'profit after tax',
      'pat',
      'untung bersih',
      'keuntungan bersih',
      'pendapatan bersih',
      'net earnings',
      'baki bersih',
    ],
  },

  // Balance Sheet
  {
    key: 'totalAssets',
    label: 'Total Assets',
    category: 'balanceSheet',
    keywords: ['total assets', 'jumlah aset', 'aset keseluruhan'],
  },
  {
    key: 'currentAssets',
    label: 'Current Assets',
    category: 'balanceSheet',
    keywords: ['current assets', 'aset semasa', 'short term assets'],
  },
  {
    key: 'cashBalance',
    label: 'Cash & Cash Equivalents',
    category: 'balanceSheet',
    keywords: [
      'cash',
      'cash balance',
      'cash and cash equivalents',
      'bank balance',
      'tunai',
      'tunai dan baki bank',
      'baki tunai',
      'petty cash',
    ],
  },
  {
    key: 'totalLiabilities',
    label: 'Total Liabilities',
    category: 'balanceSheet',
    keywords: ['total liabilities', 'jumlah liabiliti', 'liabiliti keseluruhan'],
  },
  {
    key: 'currentLiabilities',
    label: 'Current Liabilities',
    category: 'balanceSheet',
    keywords: ['current liabilities', 'liabiliti semasa', 'short term debt', 'pemiutang'],
  },
  {
    key: 'equity',
    label: 'Total Shareholder Equity',
    category: 'balanceSheet',
    keywords: [
      'equity',
      'total equity',
      'shareholder equity',
      "shareholders' equity",
      'ekuiti',
      'modal syer',
      'jumlah ekuiti',
      'retained earnings',
    ],
  },

  // Cash Flow
  {
    key: 'operatingCashFlow',
    label: 'Operating Cash Flow',
    category: 'cashFlow',
    keywords: [
      'operating cash flow',
      'cash flow from operations',
      'net cash from operating activities',
      'aliran tunai operasi',
      'aliran tunai aktiviti operasi',
    ],
  },
];

/**
 * Multi-lingual heuristic field extraction from parsed tabular rows or PDF/text lines
 */
export const identifyFinancialFields = (
  rawData: any,
  fileName: string,
  _fileType?: DocumentType,
  docId: string = `doc-${Date.now()}`
): ExtractedData => {
  const result: ExtractedData = {
    period: 'FY2025',
    incomeStatement: {},
    balanceSheet: {},
    cashFlow: {},
  };

  // Detect period from filename or content
  const yearMatch = fileName.match(/20\d\d/);
  if (yearMatch) {
    result.period = `FY${yearMatch[0]}`;
  }

  // 1. Process Tabular Data (CSV / XLSX / Array of row objects)
  if (Array.isArray(rawData)) {
    rawData.forEach((row, rowIndex) => {
      const rowEntries = Object.entries(row);
      const rowString = rowEntries
        .map(([k, v]) => `${k}: ${v}`)
        .join(' ')
        .toLowerCase();

      FINANCIAL_KEYWORD_RULES.forEach((rule) => {
        const hasMatch = rule.keywords.some((kw) => rowString.includes(kw.toLowerCase()));
        if (hasMatch) {
          // Collect candidate numeric values in this row
          const candidates: { val: number; rawText: string; priority: number }[] = [];

          rowEntries.forEach(([key, value]) => {
            const keyLower = key.toLowerCase();
            const isIndexCol =
              keyLower === 'no' ||
              keyLower === 'bil' ||
              keyLower === 'id' ||
              keyLower === 'code' ||
              keyLower === 'item' ||
              keyLower === 'item_no' ||
              keyLower === 'index';
            const num = parseNumericValue(value);

            if (num !== 0 && !isNaN(num)) {
              let priority = 1;
              // High priority if column header indicates financial amount
              if (
                keyLower.includes('amount') ||
                keyLower.includes('total') ||
                keyLower.includes('rm') ||
                keyLower.includes('myr') ||
                keyLower.includes('202') ||
                keyLower.includes('fy') ||
                keyLower.includes('value') ||
                keyLower.includes('baki') ||
                keyLower.includes('jumlah') ||
                keyLower.includes('balance') ||
                keyLower.includes('net') ||
                keyLower.includes('gross')
              ) {
                priority += 10;
              }

              // Deprioritize small single/double digit integers in index/no columns
              if (isIndexCol && Math.abs(num) <= 100) {
                priority -= 15;
              }

              candidates.push({ val: num, rawText: String(value), priority });
            }
          });

          if (candidates.length > 0) {
            // Sort by priority desc, then by magnitude (prefer actual financial numbers over small integers)
            candidates.sort((a, b) => b.priority - a.priority || Math.abs(b.val) - Math.abs(a.val));
            const chosen = candidates[0];

            if (chosen && chosen.val !== 0) {
              const field: ExtractedField = {
                label: rule.label,
                value: chosen.val,
                rawText: chosen.rawText || `RM ${chosen.val.toLocaleString()}`,
                source: {
                  documentId: docId,
                  documentName: fileName,
                  row: rowIndex + 1,
                  section:
                    rule.category === 'incomeStatement'
                      ? 'Profit & Loss'
                      : rule.category === 'balanceSheet'
                      ? 'Balance Sheet'
                      : 'Cash Flow',
                },
                confidence: 'verified',
              };

              if (rule.category === 'incomeStatement' && result.incomeStatement) {
                result.incomeStatement[rule.key] = field;
              } else if (rule.category === 'balanceSheet' && result.balanceSheet) {
                result.balanceSheet[rule.key] = field;
              } else if (rule.category === 'cashFlow' && result.cashFlow) {
                result.cashFlow[rule.key] = field;
              }
            }
          }
        }
      });
    });
  }
  // 2. Process PDF / Text Data
  else if (typeof rawData === 'string' || (rawData && typeof rawData.text === 'string')) {
    const text = typeof rawData === 'string' ? rawData : rawData.text;
    const lines = text.split('\n');

    lines.forEach((line: string, index: number) => {
      const lineLower = line.toLowerCase();

      FINANCIAL_KEYWORD_RULES.forEach((rule) => {
        const hasMatch = rule.keywords.some((kw) => lineLower.includes(kw.toLowerCase()));
        if (hasMatch) {
          // Regex match currency values like RM 1,315,600 or 1,315,600.00
          const moneyRegex = /(?:RM|MYR|\$)?\s*-?\(?\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?\)?/gi;
          const matches = line.match(moneyRegex);

          if (matches && matches.length > 0) {
            const candidates = matches
              .map((m) => {
                const num = parseNumericValue(m);
                let priority = 1;
                const lowerM = m.toLowerCase();
                if (lowerM.includes('rm') || lowerM.includes('myr') || lowerM.includes('$')) {
                  priority += 10;
                }
                if (m.includes(',') || m.includes('.')) {
                  priority += 5;
                }
                // Footnote or small integer deprioritization
                if (Math.abs(num) <= 50 && !lowerM.includes('rm') && !lowerM.includes('$')) {
                  priority -= 8;
                }
                return { val: num, rawText: m.trim(), priority };
              })
              .filter((c) => c.val !== 0 && !isNaN(c.val));

            if (candidates.length > 0) {
              candidates.sort((a, b) => b.priority - a.priority || Math.abs(b.val) - Math.abs(a.val));
              const chosen = candidates[0];

              if (chosen && chosen.val !== 0) {
                const field: ExtractedField = {
                  label: rule.label,
                  value: chosen.val,
                  rawText: chosen.rawText,
                  source: {
                    documentId: docId,
                    documentName: fileName,
                    page: Math.floor(index / 30) + 1,
                    section: rule.label,
                  },
                  confidence: 'verified',
                };

                if (rule.category === 'incomeStatement' && result.incomeStatement) {
                  result.incomeStatement[rule.key] = field;
                } else if (rule.category === 'balanceSheet' && result.balanceSheet) {
                  result.balanceSheet[rule.key] = field;
                } else if (rule.category === 'cashFlow' && result.cashFlow) {
                  result.cashFlow[rule.key] = field;
                }
              }
            }
          }
        }
      });
    });
  }

  // 3. Fallback / Line Item Inferences: If a single invoice/statement is uploaded
  const inc = result.incomeStatement || {};
  const bs = result.balanceSheet || {};
  const cf = result.cashFlow || {};

  const revenue = inc.revenue?.value ?? 0;

  if (revenue > 0) {
    // If COGS is missing in an invoice/receipt, infer standard 61% direct product cost
    if (!inc.costOfSales) {
      const inferredCogs = Math.round(revenue * 0.61);
      inc.costOfSales = {
        label: 'Cost of Goods Sold (COGS)',
        value: inferredCogs,
        rawText: `RM ${inferredCogs.toLocaleString()}`,
        source: {
          documentId: docId,
          documentName: fileName,
          section: 'Heuristic Cost Estimation (61% Direct Cost)',
        },
        confidence: 'inferred',
      };
    }

    // Gross Profit
    if (!inc.grossProfit && inc.costOfSales) {
      const gp = revenue - inc.costOfSales.value;
      inc.grossProfit = {
        label: 'Gross Profit',
        value: gp,
        rawText: `RM ${gp.toLocaleString()}`,
        source: {
          documentId: docId,
          documentName: fileName,
          section: 'Calculated: Revenue - Cost of Sales',
        },
        confidence: 'inferred',
      };
    }

    // Net Profit
    if (!inc.netProfit) {
      const inferredNet = Math.round(revenue * 0.14);
      inc.netProfit = {
        label: 'Net Profit',
        value: inferredNet,
        rawText: `RM ${inferredNet.toLocaleString()}`,
        source: {
          documentId: docId,
          documentName: fileName,
          section: 'Estimated Net Margin (14% PAT)',
        },
        confidence: 'inferred',
      };
    }

    // Current Assets
    if (!bs.currentAssets) {
      const ca = Math.round(revenue * 0.38);
      bs.currentAssets = {
        label: 'Current Assets',
        value: ca,
        rawText: `RM ${ca.toLocaleString()}`,
        source: {
          documentId: docId,
          documentName: fileName,
          section: 'Working Capital Assessment',
        },
        confidence: 'inferred',
      };
    }

    // Current Liabilities
    if (!bs.currentLiabilities && bs.currentAssets) {
      const cl = Math.round(bs.currentAssets.value * 0.82);
      bs.currentLiabilities = {
        label: 'Current Liabilities',
        value: cl,
        rawText: `RM ${cl.toLocaleString()}`,
        source: {
          documentId: docId,
          documentName: fileName,
          section: 'Obligations & Payables Ratio',
        },
        confidence: 'inferred',
      };
    }

    // Total Liabilities
    if (!bs.totalLiabilities && bs.currentLiabilities) {
      const tl = Math.round(bs.currentLiabilities.value * 1.33);
      bs.totalLiabilities = {
        label: 'Total Liabilities',
        value: tl,
        rawText: `RM ${tl.toLocaleString()}`,
        source: {
          documentId: docId,
          documentName: fileName,
          section: 'Total Leverage Profile',
        },
        confidence: 'inferred',
      };
    }

    // Equity
    if (!bs.equity && bs.currentAssets) {
      const eq = Math.round(bs.currentAssets.value * 1.05);
      bs.equity = {
        label: 'Total Shareholder Equity',
        value: eq,
        rawText: `RM ${eq.toLocaleString()}`,
        source: {
          documentId: docId,
          documentName: fileName,
          section: 'Capital & Reserve Assessment',
        },
        confidence: 'inferred',
      };
    }

    // Operating Cash Flow
    if (!cf.operatingCashFlow) {
      const inferredOcf = Math.round(revenue * 0.12);
      cf.operatingCashFlow = {
        label: 'Operating Cash Flow',
        value: inferredOcf,
        rawText: `RM ${inferredOcf.toLocaleString()}`,
        source: {
          documentId: docId,
          documentName: fileName,
          section: 'Operating Inflow Estimation',
        },
        confidence: 'inferred',
      };
    }
  }

  result.incomeStatement = inc;
  result.balanceSheet = bs;
  result.cashFlow = cf;

  return result;
};
