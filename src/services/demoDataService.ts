import type { FinancialDocument, ExtractedData } from '../types';

export interface DemoDatasetResult {
  documents: FinancialDocument[];
  invalidAlerts: {
    fileName: string;
    category: string;
    confidenceScore: number;
    warningMessage: string;
  }[];
}

/**
 * Generates an instant synthetic demo dataset with 5 verified multi-format files
 * (PDF, CSV, XLSX, JSON, Image/Scan) with logically coherent financial figures,
 * and 1 sample invalid file for AI Guardrail demonstration.
 */
export const getSyntheticDemoDataset = (): DemoDatasetResult => {
  const timestamp = new Date().toISOString();

  // 1. PDF: Audited Annual Financial Report (Full Statements)
  const auditedReportExtracted: ExtractedData = {
    period: 'FY2025',
    incomeStatement: {
      revenue: {
        label: 'Total Revenue / Gross Sales',
        value: 3450000,
        rawText: 'RM 3,450,000.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-pdf-1',
          documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
          section: 'Consolidated Statement of Profit or Loss',
          page: 2,
        },
      },
      costOfSales: {
        label: 'Cost of Goods Sold (COGS)',
        value: 1966500,
        rawText: 'RM 1,966,500.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-pdf-1',
          documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
          section: 'Cost of Sales & Food Production',
          page: 2,
        },
      },
      grossProfit: {
        label: 'Gross Profit',
        value: 1483500,
        rawText: 'RM 1,483,500.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-pdf-1',
          documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
          section: 'Gross Operating Profit',
          page: 2,
        },
      },
      operatingExpenses: {
        label: 'Operating Expenses',
        value: 983000,
        rawText: 'RM 983,000.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-pdf-1',
          documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
          section: 'Administrative & Outlet Overheads',
          page: 3,
        },
      },
      netProfit: {
        label: 'Profit After Tax (PAT)',
        value: 380000,
        rawText: 'RM 380,000.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-pdf-1',
          documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
          section: 'Net Comprehensive Income',
          page: 3,
        },
      },
    },
    balanceSheet: {
      currentAssets: {
        label: 'Total Current Assets',
        value: 1120000,
        rawText: 'RM 1,120,000.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-pdf-1',
          documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
          section: 'Statement of Financial Position',
          page: 4,
        },
      },
      cashBalance: {
        label: 'Cash & Bank Balances',
        value: 480000,
        rawText: 'RM 480,000.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-pdf-1',
          documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
          section: 'Liquid Reserves',
          page: 4,
        },
      },
      currentLiabilities: {
        label: 'Total Current Liabilities',
        value: 605000,
        rawText: 'RM 605,000.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-pdf-1',
          documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
          section: 'Current Obligations & Trade Payables',
          page: 4,
        },
      },
      totalLiabilities: {
        label: 'Total Liabilities',
        value: 940000,
        rawText: 'RM 940,000.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-pdf-1',
          documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
          section: 'Total External Borrowing & Liabilities',
          page: 4,
        },
      },
      equity: {
        label: 'Total Shareholder Equity',
        value: 1280000,
        rawText: 'RM 1,280,000.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-pdf-1',
          documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
          section: 'Share Capital & Retained Earnings',
          page: 4,
        },
      },
    },
    cashFlow: {
      operatingCashFlow: {
        label: 'Net Cash from Operating Activities',
        value: 468000,
        rawText: 'RM 468,000.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-pdf-1',
          documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
          section: 'Statement of Cash Flows',
          page: 5,
        },
      },
    },
    rawTables: [
      {
        name: 'Financial Performance Summary FY2025',
        headers: ['Metric Item', 'FY2024 (RM)', 'FY2025 (RM)', 'YoY Variance'],
        rows: [
          ['Revenue', '3,080,000', '3,450,000', '+12.0%'],
          ['Cost of Sales (COGS)', '1,810,000', '1,966,500', '+8.6%'],
          ['Gross Profit', '1,270,000', '1,483,500', '+16.8%'],
          ['Operating Expenses', '890,000', '983,000', '+10.4%'],
          ['Net Profit After Tax', '340,000', '380,000', '+11.8%'],
        ],
      },
    ],
  };

  // 2. CSV: Monthly Sales Revenue Ledger (Multi-Outlet Ledger)
  const salesLedgerExtracted: ExtractedData = {
    period: 'FY2025',
    incomeStatement: {
      revenue: {
        label: 'Consolidated Outlet Revenue',
        value: 3450000,
        rawText: 'RM 3,450,000.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-csv-2',
          documentName: 'monthly_sales_revenue_ledger_2025.csv',
          section: 'Consolidated POS Sales Summary',
          row: 14,
        },
      },
      costOfSales: {
        label: 'Raw Ingredients & Food Supplies',
        value: 1966500,
        rawText: 'RM 1,966,500.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-csv-2',
          documentName: 'monthly_sales_revenue_ledger_2025.csv',
          section: 'Direct Food Supply Purchases',
          row: 28,
        },
      },
    },
    rawTables: [
      {
        name: 'Outlet Revenue Breakdown FY2025',
        headers: ['Outlet Location', 'Q1-Q2 (RM)', 'Q3-Q4 (RM)', 'Total Revenue (RM)'],
        rows: [
          ['Branch 1 - Bangsar Utama', '480,000', '560,000', '1,040,000'],
          ['Branch 2 - KLCC Pavilion', '540,000', '630,000', '1,170,000'],
          ['Branch 3 - Penang Gurney', '360,000', '410,000', '770,000'],
          ['Branch 4 - Johor Bahru Midvalley', '220,000', '250,000', '470,000'],
        ],
      },
    ],
  };

  // 3. EXCEL (XLSX): Working Capital & Balance Sheet Model
  const balanceSheetModelExtracted: ExtractedData = {
    period: 'FY2025',
    balanceSheet: {
      currentAssets: {
        label: 'Current Assets (Cash + AR + Inventory)',
        value: 1120000,
        rawText: 'RM 1,120,000.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-xlsx-3',
          documentName: 'financial_model_balance_sheet_2025.xlsx',
          section: 'Working Capital Model',
          row: 18,
        },
      },
      currentLiabilities: {
        label: 'Current Liabilities (Trade AP + Short Debt)',
        value: 605000,
        rawText: 'RM 605,000.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-xlsx-3',
          documentName: 'financial_model_balance_sheet_2025.xlsx',
          section: 'Short-term Obligations',
          row: 34,
        },
      },
      totalLiabilities: {
        label: 'Total Corporate Borrowing & Liabilities',
        value: 940000,
        rawText: 'RM 940,000.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-xlsx-3',
          documentName: 'financial_model_balance_sheet_2025.xlsx',
          section: 'Debt Capital Schedule',
          row: 46,
        },
      },
      equity: {
        label: 'Total Shareholder Equity & Reserves',
        value: 1280000,
        rawText: 'RM 1,280,000.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-xlsx-3',
          documentName: 'financial_model_balance_sheet_2025.xlsx',
          section: 'Shareholders Equity Schedule',
          row: 52,
        },
      },
    },
    rawTables: [
      {
        name: 'Liquidity & Working Capital Ratios',
        headers: ['Financial Indicator', 'Actual FY2025', 'Target Benchmark', 'Assessment'],
        rows: [
          ['Current Ratio', '1.85x', '1.50x - 2.50x', 'Optimal Buffer'],
          ['Debt to Equity', '0.73x', '< 1.00x', 'Conservative Leverage'],
          ['Quick Cash Ratio', '0.79x', '> 0.50x', 'Strong Cash Position'],
        ],
      },
    ],
  };

  // 4. JSON: Cryptographic Audit Trail & Governance Log
  const auditJsonExtracted: ExtractedData = {
    period: 'FY2025',
    metadata: {
      complianceStandard: 'MFRS / IFRS & ISO-27001',
      cryptographicHash: '0x9a8f7b3c2e1d0048fa56bb89cc31ee14',
      zeroTelemetryVerified: true,
      governanceRating: 'Grade AAA - Compliant',
      totalTransactionsAudited: 48920,
    },
    incomeStatement: {
      operatingExpenses: {
        label: 'Statutory Compliance & Audit Fees',
        value: 48000,
        rawText: 'RM 48,000.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-json-4',
          documentName: 'audit_trail_system_metadata.json',
          section: 'Statutory Filing Records',
        },
      },
    },
  };

  // 5. IMAGE (JPG): CapEx Kitchen Machinery Tax Invoice Scan
  const invoiceImageExtracted: ExtractedData = {
    period: 'FY2025',
    incomeStatement: {
      operatingExpenses: {
        label: 'Commercial Kitchen Automation CapEx',
        value: 125000,
        rawText: 'RM 125,000.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-img-5',
          documentName: 'official_tax_invoice_machinery.jpg',
          section: 'LHDN Verified e-Invoice #INV-2025-9982',
        },
      },
    },
    balanceSheet: {
      nonCurrentAssets: {
        label: 'Property, Plant & Equipment Addition',
        value: 125000,
        rawText: 'RM 125,000.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-img-5',
          documentName: 'official_tax_invoice_machinery.jpg',
          section: 'Fixed Asset Schedule',
        },
      },
    },
  };

  const documents: FinancialDocument[] = [
    {
      id: 'doc-demo-pdf-1',
      workspaceId: 'ws-active',
      name: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
      type: 'pdf',
      status: 'analyzed',
      uploadedAt: timestamp,
      fileSize: 1024 * 1024 * 2.4,
      extractedData: auditedReportExtracted,
    },
    {
      id: 'doc-demo-csv-2',
      workspaceId: 'ws-active',
      name: 'monthly_sales_revenue_ledger_2025.csv',
      type: 'csv',
      status: 'analyzed',
      uploadedAt: timestamp,
      fileSize: 1024 * 580,
      extractedData: salesLedgerExtracted,
    },
    {
      id: 'doc-demo-xlsx-3',
      workspaceId: 'ws-active',
      name: 'financial_model_balance_sheet_2025.xlsx',
      type: 'xlsx',
      status: 'analyzed',
      uploadedAt: timestamp,
      fileSize: 1024 * 1024 * 1.2,
      extractedData: balanceSheetModelExtracted,
    },
    {
      id: 'doc-demo-json-4',
      workspaceId: 'ws-active',
      name: 'audit_trail_system_metadata.json',
      type: 'json',
      status: 'analyzed',
      uploadedAt: timestamp,
      fileSize: 1024 * 320,
      extractedData: auditJsonExtracted,
    },
    {
      id: 'doc-demo-img-5',
      workspaceId: 'ws-active',
      name: 'official_tax_invoice_machinery.jpg',
      type: 'image',
      status: 'analyzed',
      uploadedAt: timestamp,
      fileSize: 1024 * 890,
      extractedData: invoiceImageExtracted,
    },
  ];

  // Sample rejected file to demonstrate AI Guardrail screening
  const invalidAlerts = [
    {
      fileName: 'sample_cat_photo.png',
      category: 'invalid_non_financial',
      confidenceScore: 99,
      warningMessage:
        'The file "sample_cat_photo.png" was filtered by AI Guardrail because it is an informal picture and contains no financial tables or corporate accounting statements.',
    },
  ];

  return {
    documents,
    invalidAlerts,
  };
};
