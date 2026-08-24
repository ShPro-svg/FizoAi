import type {
  FinancialDocument,
  FinancialMetric,
  RiskSignal,
  AIInsight,
  HealthScore,
  AuditEvent,
} from '../types';

export const DEMO_COMPANY = {
  name: 'Warisan Delights Sdn Bhd',
  registrationNo: '201801023456 (1284482-W)',
  industry: 'Food & Beverage / Restaurant Chain',
  currency: 'MYR',
  currencySymbol: 'RM',
};

export const getDemoDocuments = (): FinancialDocument[] => [
  {
    id: 'doc-demo-pdf-1',
    workspaceId: 'ws-warisan-delights',
    name: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
    type: 'pdf',
    status: 'analyzed',
    uploadedAt: '2025-01-14T08:30:00Z',
    fileSize: 2450000,
    extractedData: {
      period: 'FY2025',
      incomeStatement: {
        revenue: {
          label: 'Total Revenue / Gross Sales',
          value: 3450000,
          rawText: 'RM 3,450,000.00',
          source: {
            documentId: 'doc-demo-pdf-1',
            documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
            page: 2,
            section: 'Revenue',
          },
          confidence: 'verified',
        },
        costOfSales: {
          label: 'Cost of Goods Sold (COGS)',
          value: 1966500,
          rawText: 'RM 1,966,500.00',
          source: {
            documentId: 'doc-demo-pdf-1',
            documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
            page: 2,
            section: 'Cost of Sales',
          },
          confidence: 'verified',
        },
        operatingExpenses: {
          label: 'Operating Expenses',
          value: 983000,
          rawText: 'RM 983,000.00',
          source: {
            documentId: 'doc-demo-pdf-1',
            documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
            page: 3,
            section: 'Operating Expenses',
          },
          confidence: 'verified',
        },
        netProfit: {
          label: 'Net Profit After Tax',
          value: 380000,
          rawText: 'RM 380,000.00',
          source: {
            documentId: 'doc-demo-pdf-1',
            documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
            page: 3,
            section: 'Net Profit',
          },
          confidence: 'verified',
        },
      },
      balanceSheet: {
        currentAssets: {
          label: 'Total Current Assets',
          value: 1120000,
          rawText: 'RM 1,120,000.00',
          source: {
            documentId: 'doc-demo-pdf-1',
            documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
            page: 4,
            section: 'Current Assets',
          },
          confidence: 'verified',
        },
        currentLiabilities: {
          label: 'Total Current Liabilities',
          value: 605000,
          rawText: 'RM 605,000.00',
          source: {
            documentId: 'doc-demo-pdf-1',
            documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
            page: 4,
            section: 'Current Liabilities',
          },
          confidence: 'verified',
        },
        totalLiabilities: {
          label: 'Total Liabilities',
          value: 940000,
          rawText: 'RM 940,000.00',
          source: {
            documentId: 'doc-demo-pdf-1',
            documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
            page: 4,
            section: 'Total Liabilities',
          },
          confidence: 'verified',
        },
        equity: {
          label: 'Total Shareholder Equity',
          value: 1280000,
          rawText: 'RM 1,280,000.00',
          source: {
            documentId: 'doc-demo-pdf-1',
            documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
            page: 4,
            section: 'Equity',
          },
          confidence: 'verified',
        },
      },
    },
  },
  {
    id: 'doc-demo-csv-2',
    workspaceId: 'ws-warisan-delights',
    name: 'monthly_sales_revenue_ledger_2025.csv',
    type: 'csv',
    status: 'analyzed',
    uploadedAt: '2025-01-14T08:32:00Z',
    fileSize: 580000,
    extractedData: {
      period: 'FY2025',
      incomeStatement: {
        revenue: {
          label: 'Consolidated Outlet Revenue',
          value: 3450000,
          rawText: 'RM 3,450,000.00',
          source: {
            documentId: 'doc-demo-csv-2',
            documentName: 'monthly_sales_revenue_ledger_2025.csv',
            row: 14,
          },
          confidence: 'verified',
        },
      },
    },
  },
  {
    id: 'doc-demo-xlsx-3',
    workspaceId: 'ws-warisan-delights',
    name: 'financial_model_balance_sheet_2025.xlsx',
    type: 'xlsx',
    status: 'analyzed',
    uploadedAt: '2025-01-14T08:35:00Z',
    fileSize: 1200000,
    extractedData: {
      period: 'FY2025',
      balanceSheet: {
        currentAssets: {
          label: 'Current Assets',
          value: 1120000,
          rawText: 'RM 1,120,000.00',
          source: {
            documentId: 'doc-demo-xlsx-3',
            documentName: 'financial_model_balance_sheet_2025.xlsx',
            row: 18,
          },
          confidence: 'verified',
        },
        currentLiabilities: {
          label: 'Current Liabilities',
          value: 605000,
          rawText: 'RM 605,000.00',
          source: {
            documentId: 'doc-demo-xlsx-3',
            documentName: 'financial_model_balance_sheet_2025.xlsx',
            row: 34,
          },
          confidence: 'verified',
        },
      },
    },
  },
  {
    id: 'doc-demo-json-4',
    workspaceId: 'ws-warisan-delights',
    name: 'audit_trail_system_metadata.json',
    type: 'json',
    status: 'analyzed',
    uploadedAt: '2025-01-14T08:36:00Z',
    fileSize: 320000,
    extractedData: {
      period: 'FY2025',
      metadata: {
        governance: 'Grade AAA - Compliant',
        cryptographicProof: '0x9a8f7b3c2e1d0048fa56bb89cc31ee14',
      },
    },
  },
  {
    id: 'doc-demo-img-5',
    workspaceId: 'ws-warisan-delights',
    name: 'official_tax_invoice_machinery.jpg',
    type: 'image',
    status: 'analyzed',
    uploadedAt: '2025-01-14T08:38:00Z',
    fileSize: 890000,
    extractedData: {
      period: 'FY2025',
      incomeStatement: {
        operatingExpenses: {
          label: 'Kitchen Automation Machinery',
          value: 125000,
          rawText: 'RM 125,000.00',
          source: {
            documentId: 'doc-demo-img-5',
            documentName: 'official_tax_invoice_machinery.jpg',
            section: 'Invoice Header',
          },
          confidence: 'verified',
        },
      },
    },
  },
];

export const getDemoMetrics = (): FinancialMetric[] => [
  {
    id: 'metric-gross-margin',
    name: 'Gross Margin',
    value: 43.0,
    unit: '%',
    formula: '(Revenue - COGS) / Revenue x 100',
    inputs: [
      {
        label: 'Revenue (FY2025)',
        value: 'RM 3,450,000',
        source: {
          documentId: 'doc-demo-pdf-1',
          documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
          page: 2,
          section: 'Revenue',
        },
      },
      {
        label: 'Cost of Goods Sold (COGS)',
        value: 'RM 1,966,500',
        source: {
          documentId: 'doc-demo-pdf-1',
          documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
          page: 2,
          section: 'Cost of Sales',
        },
      },
    ],
    comparedTo: {
      value: 41.2,
      period: 'FY2024',
      changePercent: 4.4,
    },
    confidence: 'verified',
    calculatedAt: '2025-01-14T09:00:00Z',
  },
  {
    id: 'metric-net-profit-margin',
    name: 'Net Profit Margin',
    value: 11.0,
    unit: '%',
    formula: 'Net Profit / Revenue x 100',
    inputs: [
      {
        label: 'Net Profit (FY2025)',
        value: 'RM 380,000',
        source: {
          documentId: 'doc-demo-pdf-1',
          documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
          page: 3,
          section: 'Net Profit',
        },
      },
      {
        label: 'Revenue (FY2025)',
        value: 'RM 3,450,000',
        source: {
          documentId: 'doc-demo-pdf-1',
          documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
          page: 2,
          section: 'Revenue',
        },
      },
    ],
    comparedTo: {
      value: 11.0,
      period: 'FY2024',
      changePercent: 0.0,
    },
    confidence: 'verified',
    calculatedAt: '2025-01-14T09:00:00Z',
  },
  {
    id: 'metric-current-ratio',
    name: 'Current Ratio',
    value: 1.85,
    unit: 'x',
    formula: 'Current Assets / Current Liabilities',
    inputs: [
      {
        label: 'Current Assets (FY2025)',
        value: 'RM 1,120,000',
        source: {
          documentId: 'doc-demo-pdf-1',
          documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
          page: 4,
          section: 'Current Assets',
        },
      },
      {
        label: 'Current Liabilities (FY2025)',
        value: 'RM 605,000',
        source: {
          documentId: 'doc-demo-pdf-1',
          documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
          page: 4,
          section: 'Current Liabilities',
        },
      },
    ],
    comparedTo: {
      value: 1.66,
      period: 'FY2024',
      changePercent: 11.4,
    },
    confidence: 'verified',
    calculatedAt: '2025-01-14T09:00:00Z',
  },
  {
    id: 'metric-debt-to-equity',
    name: 'Debt to Equity',
    value: 0.73,
    unit: 'x',
    formula: 'Total Liabilities / Equity',
    inputs: [
      {
        label: 'Total Liabilities (FY2025)',
        value: 'RM 940,000',
        source: {
          documentId: 'doc-demo-pdf-1',
          documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
          page: 4,
          section: 'Total Liabilities',
        },
      },
      {
        label: 'Shareholder Equity (FY2025)',
        value: 'RM 1,280,000',
        source: {
          documentId: 'doc-demo-pdf-1',
          documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
          page: 4,
          section: 'Equity',
        },
      },
    ],
    comparedTo: {
      value: 0.80,
      period: 'FY2024',
      changePercent: -8.8,
    },
    confidence: 'verified',
    calculatedAt: '2025-01-14T09:00:00Z',
  },
  {
    id: 'metric-revenue-growth',
    name: 'Revenue Growth',
    value: 12.0,
    unit: '%',
    formula: '(Current - Prior) / Prior x 100',
    inputs: [
      {
        label: 'FY2025 Revenue',
        value: 'RM 3,450,000',
        source: {
          documentId: 'doc-demo-pdf-1',
          documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
          page: 2,
          section: 'Revenue',
        },
      },
      {
        label: 'FY2024 Revenue',
        value: 'RM 3,080,000',
        source: {
          documentId: 'doc-demo-pdf-1',
          documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
          page: 2,
          section: 'Comparative Revenue',
        },
      },
    ],
    comparedTo: {
      value: 0,
      period: 'FY2024',
      changePercent: 12.0,
    },
    confidence: 'verified',
    calculatedAt: '2025-01-14T09:00:00Z',
  },
  {
    id: 'metric-operating-cash-flow',
    name: 'Operating Cash Flow',
    value: 468000,
    unit: 'RM',
    formula: 'Cash Receipts from Customers - Cash Paid to Suppliers & Operations',
    inputs: [
      {
        label: 'Cash Receipts from Operations',
        value: 'RM 3,420,000',
        source: {
          documentId: 'doc-demo-pdf-1',
          documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
          page: 5,
          section: 'Cash Flow',
        },
      },
      {
        label: 'Operating Disbursements',
        value: 'RM 2,952,000',
        source: {
          documentId: 'doc-demo-pdf-1',
          documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
          page: 5,
          section: 'Cash Flow',
        },
      },
    ],
    comparedTo: {
      value: 406000,
      period: 'FY2024',
      changePercent: 15.3,
    },
    confidence: 'verified',
    calculatedAt: '2025-01-14T09:00:00Z',
  },
];

export const getDemoRisks = (): RiskSignal[] => [
  {
    id: 'risk-supplier-concentration',
    title: 'Food Supply Cost Variance & Concentration',
    description: 'Raw food ingredient costs increased by 8.6% YoY, driven by single-supplier reliance on premium poultry and seafood distribution.',
    severity: 'medium',
    status: 'open',
    category: 'Supply Chain & Cost',
    rule: 'Flag when ingredient cost variance > 7%',
    threshold: '> 7.0%',
    currentValue: '+8.6%',
    comparedValue: '+4.2%',
    deviation: '+4.4% variance',
    evidence: [
      {
        documentId: 'doc-demo-csv-2',
        documentName: 'monthly_sales_revenue_ledger_2025.csv',
        row: 28,
        section: 'Food Supplies Purchases',
      },
    ],
    detectedAt: '2025-01-14T09:05:00Z',
  },
  {
    id: 'risk-working-capital-buffer',
    title: 'Short-term Working Capital Buffer Optimal',
    description: 'Current Ratio stands at 1.85x with RM 480k in liquid bank reserves, maintaining safe operational coverage.',
    severity: 'low',
    status: 'reviewed',
    category: 'Liquidity & Solvency',
    rule: 'Flag when <1.2',
    threshold: '< 1.20',
    currentValue: '1.85x',
    comparedValue: '1.66x',
    deviation: '+11.4% improvement',
    evidence: [
      {
        documentId: 'doc-demo-xlsx-3',
        documentName: 'financial_model_balance_sheet_2025.xlsx',
        row: 18,
        section: 'Working Capital Model',
      },
    ],
    detectedAt: '2025-01-14T09:05:00Z',
  },
];

export const getDemoInsights = (): AIInsight[] => [
  {
    id: 'insight-executive-summary',
    title: 'Executive Financial Growth & Solvency Overview',
    source: 'rule-based',
    narrative:
      'Warisan Delights demonstrated robust performance in FY2025, generating RM 3.45M revenue (+12.0% YoY growth) across its 4 regional outlets. Gross margin expanded to 43.0% with strong operating cash flow of RM 468,000 (+15.3% vs FY2024). The company maintains conservative leverage with a Debt-to-Equity ratio of 0.73x and a healthy Current Ratio of 1.85x. Key growth recommendation: proceed with the kitchen automation CapEx initiative to optimize staff productivity while maintaining the current working capital cushion.',
    confidence: 'verified',
    limitations:
      'Audited against FY2024 and FY2025 statements. External inflation and seasonal Q4 festivities accounted for.',
    evidence: [
      {
        documentId: 'doc-demo-pdf-1',
        documentName: 'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
        page: 2,
        section: 'Consolidated Statement of Profit or Loss',
      },
      {
        documentId: 'doc-demo-xlsx-3',
        documentName: 'financial_model_balance_sheet_2025.xlsx',
        row: 18,
        section: 'Working Capital Model',
      },
    ],
    generatedAt: '2025-01-14T09:10:00Z',
  },
];

export const getDemoHealthScore = (): HealthScore => ({
  score: 86,
  components: {
    profitability: 23,
    liquidity: 22,
    efficiency: 21,
    riskLevel: 20,
  },
  formula: 'Weighted composite: Profitability (25) + Liquidity (25) + Efficiency (25) + Risk Profile (25)',
  calculatedAt: '2025-01-14T09:10:00Z',
  sourceDocuments: [
    'Warisan_Delights_Audited_Annual_Report_FY2025.pdf',
    'monthly_sales_revenue_ledger_2025.csv',
    'financial_model_balance_sheet_2025.xlsx',
    'audit_trail_system_metadata.json',
    'official_tax_invoice_machinery.jpg',
  ],
});

export const getDemoAuditTrail = (): AuditEvent[] => [
  {
    id: 'audit-evt-001',
    workspaceId: 'ws-warisan-delights',
    action: 'upload',
    entityType: 'document',
    entityId: 'doc-pnl-fy2024',
    actor: 'Adam H.',
    metadata: { filename: 'Warisan_Delights_PnL_FY2024.pdf', sizeBytes: 1450000 },
    timestamp: '2025-01-14T08:30:00Z',
  },
  {
    id: 'audit-evt-002',
    workspaceId: 'ws-warisan-delights',
    action: 'consent',
    entityType: 'workspace',
    entityId: 'ws-warisan-delights',
    actor: 'Adam H.',
    metadata: { policy: 'Zero-knowledge browser parsing consent' },
    timestamp: '2025-01-14T08:31:00Z',
  },
  {
    id: 'audit-evt-003',
    workspaceId: 'ws-warisan-delights',
    action: 'extract',
    entityType: 'document',
    entityId: 'doc-pnl-fy2025',
    actor: 'Browser WebAssembly Engine',
    metadata: { extractedFields: 14, confidence: 'verified' },
    timestamp: '2025-01-14T08:35:00Z',
  },
  {
    id: 'audit-evt-004',
    workspaceId: 'ws-warisan-delights',
    action: 'analyze',
    entityType: 'metrics',
    entityId: 'engine-run-001',
    actor: 'Calculation Engine',
    metadata: { metricsComputed: 6, anomaliesDetected: 5 },
    timestamp: '2025-01-14T09:00:00Z',
  },
  {
    id: 'audit-evt-005',
    workspaceId: 'ws-warisan-delights',
    action: 'ai_query',
    entityType: 'insight',
    entityId: 'insight-executive-summary',
    actor: 'Rule-Based Analyzer',
    metadata: { ruleId: 'rule-exec-summary-fnb-v1' },
    timestamp: '2025-01-14T09:10:00Z',
  },
];
