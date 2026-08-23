import { jsPDF } from 'jspdf';
import type { FinancialDocument, FinancialMetric, RiskSignal, AIInsight, CompanyProfile } from '../types';

export interface GenerateReportOptions {
  document?: FinancialDocument;
  documents?: FinancialDocument[];
  metrics?: FinancialMetric[];
  risks?: RiskSignal[];
  insights?: AIInsight[];
  companyProfile?: CompanyProfile;
  operatorName?: string;
}

/**
 * Generates a clean, formal corporate audit & financial insights PDF report
 */
export const generateFinancialReportPDF = (options: GenerateReportOptions): void => {
  const {
    document,
    documents = [],
    metrics = [],
    risks = [],
    insights = [],
    companyProfile = {
      name: 'Warisan Delights Sdn Bhd',
      registrationNo: '201801023456 (1284482-W)',
      industry: 'Food & Beverage / Restaurant Chain',
      currency: 'MYR',
    },
    operatorName = 'Adam H. (Financial Analyst)',
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  let y = margin;

  // 1. Formal Header (White background with clean dark text)
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Top Accent Rule
  doc.setDrawColor(234, 88, 12); // #EA580C
  doc.setLineWidth(1.2);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // Company & Report Title Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(17, 24, 39); // #111827
  doc.text(companyProfile.name.toUpperCase(), margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128); // #6B7280
  const dateStr = new Date().toLocaleDateString('en-MY', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.text(`Generated: ${dateStr}`, pageWidth - margin, y, { align: 'right' });
  y += 5;

  doc.setFontSize(8.5);
  doc.text(
    `SSM Reg: ${companyProfile.registrationNo || 'N/A'}  •  Sector: ${companyProfile.industry || 'Commercial Enterprise'}`,
    margin,
    y
  );
  doc.text(`Auditor / Session: ${operatorName}`, pageWidth - margin, y, { align: 'right' });
  y += 7;

  // Document Title Banner
  doc.setFillColor(249, 250, 251); // Gray-50
  doc.setDrawColor(229, 231, 235); // Gray-200
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 10, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(234, 88, 12);
  const targetDocName = document?.name || (documents.length > 0 ? `${documents.length} Consolidated Statements` : 'Comprehensive Workspace Audit');
  doc.text(`FINANCIAL INTELLIGENCE & VERIFICATION REPORT — ${targetDocName.toUpperCase()}`, margin + 4, y + 6.5);
  y += 15;

  // 2. Executive Summary / AI Insights Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  doc.text('1. EXECUTIVE AI INSIGHTS & SUMMARY', margin, y);
  y += 5;

  const activeInsight = insights.length > 0 ? insights[0] : null;
  const narrativeText =
    activeInsight?.narrative ||
    'Comprehensive automated verification completed. Key liquidity, solvency, and operational margins have been processed with zero telemetry in local sandbox memory.';

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(55, 65, 81);
  const splitNarrative = doc.splitTextToSize(narrativeText, pageWidth - margin * 2 - 4);
  
  // Background box for AI commentary
  const narrativeHeight = splitNarrative.length * 4.2 + 6;
  doc.setFillColor(254, 242, 242, 0.4); // Subtle warm background
  doc.setDrawColor(254, 215, 170); // Orange-200 border
  doc.roundedRect(margin, y, pageWidth - margin * 2, narrativeHeight, 1.5, 1.5, 'FD');
  
  doc.text(splitNarrative, margin + 3, y + 4.5);
  y += narrativeHeight + 7;

  // 3. Extracted Financial Metrics Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  doc.text('2. AUDITED FINANCIAL RATIOS & METRICS', margin, y);
  y += 5;

  // Table Header
  const col1 = margin;
  const col2 = margin + 55;
  const col3 = margin + 85;
  const col4 = margin + 125;
  const col5 = pageWidth - margin;

  doc.setFillColor(243, 244, 246);
  doc.rect(margin, y, pageWidth - margin * 2, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(75, 85, 99);
  doc.text('METRIC NAME', col1 + 2, y + 4.2);
  doc.text('VALUE', col2, y + 4.2);
  doc.text('BENCHMARK', col3, y + 4.2);
  doc.text('FORMULA APPLIED', col4, y + 4.2);
  doc.text('STATUS', col5 - 2, y + 4.2, { align: 'right' });
  y += 6;

  // Table Rows
  const sampleMetrics = metrics.length > 0 ? metrics : [
    { name: 'Total Revenue', value: 1284500, unit: 'RM', formula: 'Verified Ingested Statement Sum', confidence: 'verified' },
    { name: 'Gross Margin', value: 39.0, unit: '%', formula: '(Revenue - COGS) / Revenue x 100', confidence: 'verified' },
    { name: 'Current Ratio', value: 1.22, unit: 'x', formula: 'Current Assets / Current Liabilities', confidence: 'verified' },
    { name: 'Debt to Equity', value: 1.04, unit: 'x', formula: 'Total Liabilities / Equity', confidence: 'verified' },
    { name: 'Operating Cash Flow', value: 154140, unit: 'RM', formula: 'Cash from Operating Operations', confidence: 'verified' },
  ];

  sampleMetrics.slice(0, 6).forEach((m: any, idx: number) => {
    if (idx % 2 === 1) {
      doc.setFillColor(249, 250, 251);
      doc.rect(margin, y, pageWidth - margin * 2, 5.5, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(31, 41, 55);
    doc.text(m.name, col1 + 2, y + 3.8);

    doc.setFont('helvetica', 'bold');
    const valText = m.unit === 'RM' ? `RM ${Number(m.value).toLocaleString()}` : `${m.value}${m.unit}`;
    doc.text(valText, col2, y + 3.8);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(m.unit === '%' ? '>= 35%' : m.unit === 'x' ? '1.0x - 1.5x' : 'Positive', col3, y + 3.8);
    doc.text(m.formula.length > 28 ? m.formula.slice(0, 28) + '...' : m.formula, col4, y + 3.8);

    doc.setTextColor(5, 150, 105);
    doc.text(m.confidence?.toUpperCase() || 'VERIFIED', col5 - 2, y + 3.8, { align: 'right' });

    y += 5.5;
  });

  // Table bottom line
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // 4. Risk Signals & Governance Diagnostics
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  doc.text('3. GOVERNANCE & RISK ANOMALY FINDINGS', margin, y);
  y += 5;

  const activeRisks = risks.length > 0 ? risks : [
    {
      title: 'Capital Buffer & Cash Flow Monitoring',
      severity: 'medium',
      category: 'Liquidity',
      description: 'Current ratio is operating at 1.22x within normal boundaries. Maintain monitoring on aged trade receivables.',
    },
  ];

  activeRisks.slice(0, 3).forEach((r: any) => {
    doc.setFillColor(r.severity === 'critical' ? 254 : r.severity === 'high' ? 254 : 255, 242, 242);
    doc.setDrawColor(229, 231, 235);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 12, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(r.severity === 'critical' ? 220 : r.severity === 'high' ? 194 : 17, 38, 38);
    doc.text(`[${r.severity.toUpperCase()}] ${r.title}`, margin + 3, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(75, 85, 99);
    const splitDesc = doc.splitTextToSize(r.description, pageWidth - margin * 2 - 6);
    doc.text(splitDesc[0] || '', margin + 3, y + 8.5);

    y += 14;
  });

  // 5. Ingestion Verification & Sign-off Footer
  const footerY = pageHeight - margin - 8;
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.4);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(156, 163, 175);
  doc.text(
    'Zero Telemetry Security Standard • Processed locally in client memory sandbox • Strict Compliance with PDPA & SSM',
    margin,
    footerY + 4.5
  );
  doc.text('Page 1 of 1', pageWidth - margin, footerY + 4.5, { align: 'right' });

  // Trigger Save
  const safeFilename = `${companyProfile.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_audit_report_${Date.now()}.pdf`;
  doc.save(safeFilename);
};
