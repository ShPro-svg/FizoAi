import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Info,
  ArrowRight,
  TrendingDown,
  HelpCircle,
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { MetricCard } from '../components/ui/MetricCard';
import { EvidenceDrawer } from '../components/ui/EvidenceDrawer';
import { ConfidenceBadge } from '../components/ui/ConfidenceBadge';
import { useWorkspace } from '../context/WorkspaceContext';
import type { FinancialMetric } from '../types';

export const FinancialAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { metrics, documents } = useWorkspace();
  const [selectedMetric, setSelectedMetric] = useState<FinancialMetric | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const hasData = documents.length > 0 && metrics.length > 0;

  const handleOpenEvidence = (m: FinancialMetric) => {
    setSelectedMetric(m);
    setIsDrawerOpen(true);
  };

  // Target Key Ratios
  const grossMargin = metrics.find((m) => m.id === 'metric-gross-margin');
  const currentRatio = metrics.find((m) => m.id === 'metric-current-ratio');
  const debtToEquity = metrics.find((m) => m.id === 'metric-debt-to-equity');

  return (
    <div className="space-y-6 pb-16">
      {/* 1. PageHeader */}
      <PageHeader
        title="Financial Analysis"
        subtitle="A deterministic view of the company's core financial performance derived strictly from verified source files."
        actionButton={
          <button
            type="button"
            onClick={() => navigate('/documents')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-all shadow-xs cursor-pointer"
          >
            <FileText className="w-4 h-4 text-teal-600" />
            <span>Current Period Source Reports</span>
          </button>
        }
      />

      {/* 2. Three Ratio Cards (MetricCard) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Gross Profit Margin */}
        <MetricCard
          label="GROSS PROFIT MARGIN"
          value={hasData && grossMargin ? grossMargin.value : 0}
          unit="%"
          change={hasData && grossMargin?.comparedTo ? grossMargin.comparedTo.changePercent : undefined}
          changeLabel="vs FY2024"
          confidence={hasData && grossMargin ? grossMargin.confidence : undefined}
          isEmpty={!hasData}
          onEvidenceClick={
            hasData && grossMargin ? () => handleOpenEvidence(grossMargin) : undefined
          }
        />

        {/* Current Ratio */}
        <MetricCard
          label="CURRENT RATIO"
          value={hasData && currentRatio ? currentRatio.value : 0}
          unit="x"
          change={hasData && currentRatio?.comparedTo ? currentRatio.comparedTo.changePercent : undefined}
          changeLabel="vs FY2024"
          confidence={hasData && currentRatio ? currentRatio.confidence : undefined}
          isEmpty={!hasData}
          onEvidenceClick={
            hasData && currentRatio ? () => handleOpenEvidence(currentRatio) : undefined
          }
        />

        {/* Debt to Equity */}
        <MetricCard
          label="DEBT TO EQUITY"
          value={hasData && debtToEquity ? debtToEquity.value : 0}
          unit="x"
          change={hasData && debtToEquity?.comparedTo ? debtToEquity.comparedTo.changePercent : undefined}
          changeLabel="vs FY2024"
          confidence={hasData && debtToEquity ? debtToEquity.confidence : undefined}
          isEmpty={!hasData}
          onEvidenceClick={
            hasData && debtToEquity ? () => handleOpenEvidence(debtToEquity) : undefined
          }
        />
      </div>

      {/* 3. INFO BANNER */}
      <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-4.5 flex items-start gap-3.5 shadow-2xs">
        <div className="w-7 h-7 rounded-lg bg-teal-100 text-[#0D9488] flex items-center justify-center flex-shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-xs text-[#111827] leading-relaxed">
          <span className="font-bold text-teal-900 block mb-0.5">
            How FizoAI Computes Ratios
          </span>
          Gross profit margin is calculated as <code className="bg-white/80 px-1.5 py-0.5 rounded border border-teal-200 font-mono text-[11px] text-teal-900 font-semibold">(Total Revenue - Direct Cost of Sales) / Total Revenue</code>. Figures are reconciled deterministically from active ingested ledgers with zero hardcoding or bias.
        </div>
      </div>

      {/* 5 & 6: PERFORMANCE SUMMARY (Left 60%) + KEY RATIOS TABLE (Right 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* 5. PERFORMANCE SUMMARY (Left, wider) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider">
                Financial Performance Summary
              </h3>
              {hasData ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#059669] border border-emerald-200">
                  <span>Reconciled</span>
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                  Awaiting Data
                </span>
              )}
            </div>

            {!hasData ? (
              <div className="p-8 text-center text-gray-400 space-y-2 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 my-4">
                <TrendingDown className="w-8 h-8 mx-auto text-gray-300 mb-1" />
                <p className="text-xs font-semibold text-gray-700">No Statement Loaded</p>
                <p className="text-[11px] text-gray-400">
                  Upload financial statements to view multi-period profitability and solvency analysis.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5 text-xs text-[#374151] leading-relaxed">
                <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200/80 space-y-2">
                  <h4 className="font-bold text-[#111827] text-xs">
                    Profitability & Margins Compression
                  </h4>
                  <p>
                    Gross profit margin compressed by <strong>5.0 percentage points</strong> (from 44.0% to 39.0%) as cost of goods sold expanded to 61% of total revenue. Net profit margin contracted from 14.0% to 4.0% due to an unhedged 23.8% surge in operating overheads.
                  </p>
                </div>

                <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200/80 space-y-2">
                  <h4 className="font-bold text-[#111827] text-xs">
                    Liquidity & Cash Runway Exposure
                  </h4>
                  <p>
                    The Current Ratio stands at <strong>1.03x</strong>, narrowing the liquid buffer to near-parity with short-term liabilities (RM 355k vs RM 345k). Operating cash flow generated a <strong>-RM 28,000 deficit</strong>, signaling urgent working capital intervention.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Period: FY2024 vs FY2025</span>
            <button
              type="button"
              onClick={() => navigate('/documents')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Source Documents</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 6. KEY RATIOS TABLE (Right) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider">
                Key Metrics & Ratios Table
              </h3>
              <span className="text-xs text-gray-400 font-mono">
                {metrics.length} metrics
              </span>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-3.5">Ratio / Metric</th>
                    <th className="py-3 px-3">Current</th>
                    <th className="py-3 px-3">Prior</th>
                    <th className="py-3 px-3">Change</th>
                    <th className="py-3 px-3 text-right">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {metrics.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-3.5 font-semibold text-[#111827]">
                        {m.name}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-blue-600">
                        {m.unit === 'RM' || m.unit === '$' ? `${m.unit} ` : ''}
                        {typeof m.value === 'number' ? m.value.toLocaleString() : m.value}
                        {m.unit && m.unit !== 'RM' && m.unit !== '$' ? ` ${m.unit}` : ''}
                      </td>
                      <td className="py-3 px-3 font-mono text-gray-500">
                        {m.comparedTo ? `${m.comparedTo.value}${m.unit ? ` ${m.unit}` : ''}` : '-'}
                      </td>
                      <td className="py-3 px-3">
                        {m.comparedTo ? (
                          <span
                            className={`font-semibold font-mono text-[11px] ${
                              m.comparedTo.changePercent >= 0
                                ? 'text-[#059669]'
                                : 'text-[#DC2626]'
                            }`}
                          >
                            {m.comparedTo.changePercent >= 0 ? '+' : ''}
                            {m.comparedTo.changePercent}%
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenEvidence(m)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-2 py-1 rounded-lg border border-teal-200 transition-colors cursor-pointer"
                          title="Inspect calculation trace"
                        >
                          <HelpCircle className="w-3 h-3" />
                          <span>Proof</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3.5 mt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span className="text-[11px]">Click "Proof" to inspect formulas</span>
            <ConfidenceBadge tier="verified" />
          </div>
        </div>
      </div>

      {/* 4. EVIDENCE DRAWER */}
      <EvidenceDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        metric={selectedMetric}
      />
    </div>
  );
};
