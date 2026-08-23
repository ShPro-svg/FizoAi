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
 * Generates an instant synthetic demo dataset with verified financial figures
 * and 1 purposefully invalid document to demonstrate AI Guardrail screening.
 */
export const getSyntheticDemoDataset = (): DemoDatasetResult => {
  const timestamp = new Date().toISOString();

  // 1. Valid Corporate Financial Documents
  const q2ReportExtracted: ExtractedData = {
    period: 'FY2026',
    incomeStatement: {
      revenue: {
        label: 'Total Revenue / Gross Sales',
        value: 1284500,
        rawText: 'RM 1,284,500.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-1',
          documentName: 'quarterly_financial_report_Q2_2026.pdf',
          section: 'Consolidated Statement of Profit or Loss',
          page: 2,
        },
      },
      costOfSales: {
        label: 'Cost of Goods Sold (COGS)',
        value: 783545,
        rawText: 'RM 783,545.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-1',
          documentName: 'quarterly_financial_report_Q2_2026.pdf',
          section: 'Direct Production & Material Costs',
          page: 2,
        },
      },
      grossProfit: {
        label: 'Gross Profit',
        value: 500955,
        rawText: 'RM 500,955.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-1',
          documentName: 'quarterly_financial_report_Q2_2026.pdf',
          section: 'Gross Operational Yield',
          page: 2,
        },
      },
      netProfit: {
        label: 'Profit After Tax (PAT)',
        value: 179830,
        rawText: 'RM 179,830.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-1',
          documentName: 'quarterly_financial_report_Q2_2026.pdf',
          section: 'Net Comprehensive Income',
          page: 3,
        },
      },
    },
    balanceSheet: {
      currentAssets: {
        label: 'Current Assets',
        value: 488110,
        rawText: 'RM 488,110.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-1',
          documentName: 'quarterly_financial_report_Q2_2026.pdf',
          section: 'Statement of Financial Position',
          page: 4,
        },
      },
      currentLiabilities: {
        label: 'Current Liabilities',
        value: 400090,
        rawText: 'RM 400,090.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-1',
          documentName: 'quarterly_financial_report_Q2_2026.pdf',
          section: 'Current Obligations & Payables',
          page: 4,
        },
      },
      totalLiabilities: {
        label: 'Total Liabilities',
        value: 532120,
        rawText: 'RM 532,120.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-1',
          documentName: 'quarterly_financial_report_Q2_2026.pdf',
          section: 'Total External Borrowing & Liabilities',
          page: 4,
        },
      },
      equity: {
        label: 'Total Shareholder Equity',
        value: 511640,
        rawText: 'RM 511,640.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-1',
          documentName: 'quarterly_financial_report_Q2_2026.pdf',
          section: 'Share Capital & Reserves',
          page: 4,
        },
      },
    },
    cashFlow: {
      operatingCashFlow: {
        label: 'Net Cash from Operating Activities',
        value: 154140,
        rawText: 'RM 154,140.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-1',
          documentName: 'quarterly_financial_report_Q2_2026.pdf',
          section: 'Statement of Cash Flows',
          page: 5,
        },
      },
    },
    rawTables: [
      {
        name: 'Quarterly Summary FY2026',
        headers: ['Line Item', 'Q1 2026 (RM)', 'Q2 2026 (RM)', 'Variance (%)'],
        rows: [
          ['Revenue', '610,000', '674,500', '+10.5%'],
          ['Cost of Sales', '372,100', '411,445', '+10.5%'],
          ['Gross Profit', '237,900', '263,055', '+10.5%'],
          ['Operating Expenses', '142,000', '151,200', '+6.4%'],
          ['Net Profit', '82,400', '97,430', '+18.2%'],
        ],
      },
    ],
  };

  const payrollExtracted: ExtractedData = {
    period: 'FY2026',
    incomeStatement: {
      operatingExpenses: {
        label: 'Salaries & Staff Costs',
        value: 96830,
        rawText: 'RM 96,830.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-2',
          documentName: 'payroll_register_july2026.csv',
          section: 'Monthly Payroll Ledger',
          row: 14,
        },
      },
    },
    rawTables: [
      {
        name: 'Payroll Summary July 2026',
        headers: ['Department', 'Headcount', 'Gross Pay (RM)', 'EPF/SOCSO (RM)'],
        rows: [
          ['Executive & Ops', '6', '38,500', '5,775'],
          ['Kitchen & Service', '18', '45,700', '6,855'],
          ['Logistics', '4', '12,630', '1,894'],
        ],
      },
    ],
  };

  const bankStatementExtracted: ExtractedData = {
    period: 'FY2026',
    balanceSheet: {
      cashBalance: {
        label: 'Cash & Cash Equivalents',
        value: 312450,
        rawText: 'RM 312,450.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-3',
          documentName: 'bank_statement_july2026.pdf',
          section: 'Closing Book Balance',
          page: 1,
        },
      },
    },
    cashFlow: {
      operatingCashFlow: {
        label: 'Operating Cash Inflow',
        value: 154140,
        rawText: 'RM 154,140.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-3',
          documentName: 'bank_statement_july2026.pdf',
          section: 'Direct Inflow Settlement',
          page: 2,
        },
      },
    },
  };

  const marketingBudgetExtracted: ExtractedData = {
    period: 'FY2026',
    incomeStatement: {
      operatingExpenses: {
        label: 'Marketing & Digital Acquisition',
        value: 65000,
        rawText: 'RM 65,000.00',
        confidence: 'verified',
        source: {
          documentId: 'doc-demo-4',
          documentName: 'marketing_budget_H1_2026.xlsx',
          section: 'Brand Campaign Sheet',
          row: 8,
        },
      },
    },
  };

  const documents: FinancialDocument[] = [
    {
      id: 'doc-demo-1',
      workspaceId: 'ws-active',
      name: 'quarterly_financial_report_Q2_2026.pdf',
      type: 'pdf',
      status: 'analyzed',
      uploadedAt: timestamp,
      fileSize: 1024 * 1024 * 1.8,
      extractedData: q2ReportExtracted,
    },
    {
      id: 'doc-demo-2',
      workspaceId: 'ws-active',
      name: 'payroll_register_july2026.csv',
      type: 'csv',
      status: 'analyzed',
      uploadedAt: timestamp,
      fileSize: 1024 * 420,
      extractedData: payrollExtracted,
    },
    {
      id: 'doc-demo-3',
      workspaceId: 'ws-active',
      name: 'bank_statement_july2026.pdf',
      type: 'pdf',
      status: 'analyzed',
      uploadedAt: timestamp,
      fileSize: 1024 * 1024 * 2.1,
      extractedData: bankStatementExtracted,
    },
    {
      id: 'doc-demo-4',
      workspaceId: 'ws-active',
      name: 'marketing_budget_H1_2026.xlsx',
      type: 'xlsx',
      status: 'analyzed',
      uploadedAt: timestamp,
      fileSize: 1024 * 780,
      extractedData: marketingBudgetExtracted,
    },
  ];

  // 2. Sample Purposefully Rejected File for AI Guardrail error demonstration
  const invalidAlerts = [
    {
      fileName: 'sample_cat_photo.png',
      category: 'invalid_non_financial',
      confidenceScore: 99,
      warningMessage:
        'The file "sample_cat_photo.png" was rejected by AI Guardrail because it is a personal image and contains no official financial or corporate accounting data.',
    },
  ];

  return {
    documents,
    invalidAlerts,
  };
};
