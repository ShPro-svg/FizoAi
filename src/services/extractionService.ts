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
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
    defval: '',
    raw: false,
  });
  return jsonData;
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
        .map((item: any) => item.str)
        .join(' ');
      pages.push({ pageNumber: pageNum, text: pageText });
      fullText += `\n--- Page ${pageNum} ---\n` + pageText;
    }

    return { text: fullText, pages };
  } catch (err) {
    console.warn('PDF.js standard parse failed, falling back to text extractor:', err);
    const text = await file.text();
    return { text, pages: [{ pageNumber: 1, text }] };
  }
};

/**
 * Parses a JSON document client-side
 */
export const parseJSON = async (file: File): Promise<any> => {
  const text = await file.text();
  return JSON.parse(text);
};

// Helper: parse numbers from dirty text strings like "RM 1,315,600.00", "(28,000)", "-RM 45k"
const parseNumericValue = (raw: any): number => {
  if (typeof raw === 'number') return raw;
  if (!raw) return 0;
  let str = String(raw).trim();
  const isNegative = str.includes('(') || str.startsWith('-') || str.includes('minus');
  str = str.replace(/[^0-9.]/g, '');
  const num = parseFloat(str);
  if (isNaN(num)) return 0;
  return isNegative ? -num : num;
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
      const rowValues = Object.values(row);
      const rowString = Object.entries(row)
        .map(([k, v]) => `${k}: ${v}`)
        .join(' ')
        .toLowerCase();

      FINANCIAL_KEYWORD_RULES.forEach((rule) => {
        const hasMatch = rule.keywords.some((kw) => rowString.includes(kw.toLowerCase()));
        if (hasMatch) {
          // Find the numeric value in the row
          let foundValue: number | null = null;
          let rawText = '';

          for (const val of rowValues) {
            const num = parseNumericValue(val);
            if (num !== 0 && !isNaN(num)) {
              foundValue = num;
              rawText = String(val);
              break;
            }
          }

          if (foundValue !== null) {
            const field: ExtractedField = {
              label: rule.label,
              value: foundValue,
              rawText: rawText || `RM ${foundValue.toLocaleString()}`,
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
          const moneyRegex = /(?:RM|MYR|\$)?\s*-?\(?\d{1,3}(?:,\d{3})*(?:\.\d{2})?\)?/gi;
          const matches = line.match(moneyRegex);

          if (matches && matches.length > 0) {
            const lastMatch = matches[matches.length - 1];
            const num = parseNumericValue(lastMatch);

            if (num !== 0) {
              const field: ExtractedField = {
                label: rule.label,
                value: num,
                rawText: lastMatch.trim(),
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
