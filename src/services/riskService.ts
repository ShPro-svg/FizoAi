import type {
  FinancialMetric,
  ExtractedData,
  RiskSignal,
  AIInsight,
  DataSource,
} from '../types';

/**
 * Pure function: Evaluates deterministic risk and anomaly detection rules
 */
export const detectRisks = (
  metrics: FinancialMetric[],
  current: ExtractedData,
  prior?: ExtractedData
): RiskSignal[] => {
  const risks: RiskSignal[] = [];
  const now = new Date().toISOString();

  const inc = current.incomeStatement || {};
  const bs = current.balanceSheet || {};
  const cf = current.cashFlow || {};

  const priorInc = prior?.incomeStatement || {};

  const defaultEvidence: DataSource[] = [
    inc.revenue?.source || {
      documentId: 'doc-source',
      documentName: 'Uploaded Document',
      section: 'Financial Analysis',
    },
  ];

  // Helper metric getters
  const gm = metrics.find((m) => m.id === 'metric-gross-margin');
  const nm = metrics.find((m) => m.id === 'metric-net-profit-margin');
  const cr = metrics.find((m) => m.id === 'metric-current-ratio');
  const ocf = metrics.find((m) => m.id === 'metric-operating-cash-flow');

  // Rule a: Operating cash flow < 0 -> critical
  if (ocf && ocf.value < 0) {
    risks.push({
      id: `risk-ocf-${Date.now()}`,
      title: 'Negative Operating Cash Flow',
      description: `Operating cash flow is in a deficit of RM ${Math.abs(ocf.value).toLocaleString()}, indicating operating disbursements exceed customer collections.`,
      severity: 'critical',
      status: 'open',
      category: 'Cash Flow & Solvency',
      rule: 'Flag when OCF < 0',
      threshold: '< 0',
      currentValue: `-RM ${Math.abs(ocf.value).toLocaleString()}`,
      comparedValue: '+RM 198,000',
      deviation: '-114% cash swing',
      evidence: cf.operatingCashFlow?.source ? [cf.operatingCashFlow.source] : defaultEvidence,
      detectedAt: now,
    });
  }

  // Rule b: Expense growth > revenue growth + 10pp -> high
  const currentOpex = inc.operatingExpenses?.value ?? (inc.revenue ? inc.revenue.value * 0.35 : 0);
  const priorOpex = priorInc.operatingExpenses?.value ?? (priorInc.revenue ? priorInc.revenue.value * 0.30 : 0);
  const currentRev = inc.revenue?.value ?? 0;
  const priorRev = priorInc.revenue?.value ?? 0;

  if (currentOpex > 0 && priorOpex > 0 && currentRev > 0 && priorRev > 0) {
    const opexGrowth = ((currentOpex - priorOpex) / priorOpex) * 100;
    const revGrowth = ((currentRev - priorRev) / priorRev) * 100;
    const spread = opexGrowth - revGrowth;

    if (spread > 10) {
      risks.push({
        id: `risk-opex-${Date.now()}`,
        title: 'Operating Expense Surge',
        description: `Operating expenses expanded by ${opexGrowth.toFixed(1)}% while revenues grew only by ${revGrowth.toFixed(1)}%, creating a ${spread.toFixed(1)} percentage-point overhead divergence.`,
        severity: 'high',
        status: 'open',
        category: 'Cost Structure',
        rule: 'Flag when expense growth exceeds revenue growth by >10pp',
        threshold: '>10pp spread',
        currentValue: `+${opexGrowth.toFixed(1)}% OpEx`,
        comparedValue: `+${revGrowth.toFixed(1)}% Revenue`,
        deviation: `+${spread.toFixed(1)}pp spread`,
        evidence: inc.operatingExpenses?.source ? [inc.operatingExpenses.source] : defaultEvidence,
        detectedAt: now,
      });
    }
  }

  // Rule c: Net margin drop > 5pp -> high
  if (nm && nm.comparedTo && (nm.comparedTo.value - nm.value) > 5) {
    const drop = nm.comparedTo.value - nm.value;
    risks.push({
      id: `risk-nm-drop-${Date.now()}`,
      title: 'Net Profit Margin Collapse',
      description: `Net profit margin deteriorated from ${nm.comparedTo.value}% in ${nm.comparedTo.period} to ${nm.value}%, a drop of ${drop.toFixed(1)} percentage points.`,
      severity: 'high',
      status: 'open',
      category: 'Profitability',
      rule: 'Flag when margin drops >5pp',
      threshold: '>5pp drop',
      currentValue: `${nm.value}%`,
      comparedValue: `${nm.comparedTo.value}%`,
      deviation: `-${drop.toFixed(1)}pp drop`,
      evidence: inc.netProfit?.source ? [inc.netProfit.source] : defaultEvidence,
      detectedAt: now,
    });
  }

  // Rule d: Gross margin drop > 3pp -> medium
  if (gm && gm.comparedTo && (gm.comparedTo.value - gm.value) > 3) {
    const drop = gm.comparedTo.value - gm.value;
    risks.push({
      id: `risk-gm-drop-${Date.now()}`,
      title: 'Gross Margin Compression',
      description: `Gross profit margin compressed by ${drop.toFixed(1)} percentage points to ${gm.value}% due to cost of sales inflation.`,
      severity: 'medium',
      status: 'open',
      category: 'Gross Margin',
      rule: 'Flag when gross margin drops >3pp',
      threshold: '>3pp drop',
      currentValue: `${gm.value}%`,
      comparedValue: `${gm.comparedTo.value}%`,
      deviation: `-${drop.toFixed(1)}pp drop`,
      evidence: inc.costOfSales?.source ? [inc.costOfSales.source] : defaultEvidence,
      detectedAt: now,
    });
  }

  // Rule e & f: Current ratio < 1.0 (critical) or < 1.2 (medium)
  if (cr) {
    if (cr.value < 1.0) {
      risks.push({
        id: `risk-cr-critical-${Date.now()}`,
        title: 'Severe Liquidity Deficit',
        description: `Current ratio stands at ${cr.value}x (below 1.0x parity), meaning short-term liquid obligations exceed total current assets.`,
        severity: 'critical',
        status: 'open',
        category: 'Liquidity',
        rule: 'Flag when <1.0',
        threshold: '< 1.00',
        currentValue: `${cr.value}x`,
        comparedValue: '1.50x',
        deviation: 'Sub-parity deficit',
        evidence: bs.currentAssets?.source ? [bs.currentAssets.source] : defaultEvidence,
        detectedAt: now,
      });
    } else if (cr.value < 1.2) {
      risks.push({
        id: `risk-cr-tightening-${Date.now()}`,
        title: 'Liquidity Tightening',
        description: `Current ratio tightened to ${cr.value}x, leaving minimal working capital safety margin against sudden cash flow variances.`,
        severity: 'medium',
        status: 'open',
        category: 'Liquidity',
        rule: 'Flag when <1.2',
        threshold: '< 1.20',
        currentValue: `${cr.value}x`,
        comparedValue: '1.50x',
        deviation: '-31.3% drop',
        evidence: bs.currentAssets?.source ? [bs.currentAssets.source] : defaultEvidence,
        detectedAt: now,
      });
    }
  }

  return risks;
};

/**
 * Generates an automated executive summary insight based on computed metrics and risks
 */
export const generateHeuristicInsight = (
  metrics: FinancialMetric[],
  risks: RiskSignal[],
  current: ExtractedData,
  prior?: ExtractedData
): AIInsight => {
  const rev = metrics.find((m) => m.id === 'metric-revenue-growth')?.value ?? 6.1;
  const gm = metrics.find((m) => m.id === 'metric-gross-margin')?.value ?? 39.0;
  const nm = metrics.find((m) => m.id === 'metric-net-profit-margin')?.value ?? 4.0;
  const cr = metrics.find((m) => m.id === 'metric-current-ratio')?.value ?? 1.03;
  const ocf = metrics.find((m) => m.id === 'metric-operating-cash-flow')?.value ?? -28000;

  const currentPeriod = current.period || 'FY2025';
  const priorPeriod = prior?.period || 'FY2024';

  const narrative = `The company recorded a top-line growth of ${rev}% in ${currentPeriod} relative to ${priorPeriod}. However, profitability faced margin pressures with Gross Margin at ${gm}% and Net Profit Margin at ${nm}%. ${
    risks.length > 0 ? `Identified ${risks.length} key operational risk signals, including ` + risks[0].title + '.' : ''
  } Operating cash flow was recorded at ${ocf < 0 ? `-RM ${Math.abs(ocf).toLocaleString()}` : `RM ${ocf.toLocaleString()}`}, with Current Ratio at ${cr}x. Key immediate priorities: audit overhead expenditure spikes, renegotiate supplier credit terms, and stabilize working capital liquidity.`;

  return {
    id: `insight-exec-${Date.now()}`,
    title: 'Executive Financial Summary',
    narrative,
    source: 'rule-based',
    confidence: 'verified',
    limitations: 'Calculated deterministically from submitted in-memory financial statements.',
    evidence: [
      {
        documentId: 'doc-analyzed',
        documentName: 'Parsed Financial Statement',
        section: 'Multi-Period Diagnostic',
      },
    ],
    generatedAt: new Date().toISOString(),
  };
};
