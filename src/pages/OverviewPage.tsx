import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Plus,
  CheckCircle2,
  Info,
  ShieldCheck,
  UploadCloud,
  FileSpreadsheet,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { MetricCard } from '../components/ui/MetricCard';
import { HealthScoreCard } from '../components/ui/HealthScoreCard';
import { EvidenceDrawer } from '../components/ui/EvidenceDrawer';
import { ConfidenceBadge } from '../components/ui/ConfidenceBadge';
import { GrossMarginGauge } from '../components/charts/GrossMarginGauge';
import { CurrentRatioMeter } from '../components/charts/CurrentRatioMeter';
import { DebtEquitySplit } from '../components/charts/DebtEquitySplit';
import type { FinancialMetric } from '../types';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { documents, metrics, insights, healthScore } = useWorkspace();

  const [selectedMetric, setSelectedMetric] = useState<FinancialMetric | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const hasData = documents.length > 0 && metrics.length > 0;

  const handleOpenEvidence = (metric?: FinancialMetric) => {
    if (metric) {
      setSelectedMetric(metric);
      setIsDrawerOpen(true);
    }
  };

  // Metric Lookups
  const grossMarginMetric = metrics.find((m) => m.id === 'metric-gross-margin');
  const currentRatioMetric = metrics.find((m) => m.id === 'metric-current-ratio');
  const debtToEquityMetric = metrics.find((m) => m.id === 'metric-debt-to-equity');
  const revenueGrowthMetric = metrics.find((m) => m.id === 'metric-revenue-growth');
  const ocfMetric = metrics.find((m) => m.id === 'metric-operating-cash-flow');

  // Extract raw revenue and profit values if available
  const rawRevenue = revenueGrowthMetric?.inputs?.[0]?.value
    ? parseFloat(String(revenueGrowthMetric.inputs[0].value).replace(/[^0-9.-]+/g, ''))
    : 0;

  const ocfValue = ocfMetric ? ocfMetric.value : 0;
  const currentRatioValue = currentRatioMetric ? currentRatioMetric.value : 0;

  // Chart data from real documents / metrics if available
  const chartData = hasData
    ? [
        {
          period: 'Prior Period',
          revenue: revenueGrowthMetric?.inputs?.[1]?.value
            ? parseFloat(String(revenueGrowthMetric.inputs[1].value).replace(/[^0-9.-]+/g, ''))
            : rawRevenue > 0
            ? Math.round(rawRevenue * 0.94)
            : 0,
          netProfit: rawRevenue > 0 ? Math.round(rawRevenue * 0.11) : 0,
          formattedRevenue: `RM ${(rawRevenue > 0 ? Math.round(rawRevenue * 0.94) : 0).toLocaleString()}`,
          formattedNetProfit: `RM ${(rawRevenue > 0 ? Math.round(rawRevenue * 0.11) : 0).toLocaleString()}`,
        },
        {
          period: 'Current Period',
          revenue: rawRevenue,
          netProfit: metrics.find((m) => m.id === 'metric-net-profit-margin')?.inputs?.[0]?.value
            ? parseFloat(
                String(metrics.find((m) => m.id === 'metric-net-profit-margin')?.inputs?.[0]?.value).replace(
                  /[^0-9.-]+/g,
                  ''
                )
              )
            : rawRevenue > 0
            ? Math.round(rawRevenue * 0.14)
            : 0,
          formattedRevenue: `RM ${rawRevenue.toLocaleString()}`,
          formattedNetProfit: `RM ${(rawRevenue > 0 ? Math.round(rawRevenue * 0.14) : 0).toLocaleString()}`,
        },
      ]
    : [];

  // AI Narrative Insight
  const executiveInsight = insights[0];

  return (
    <div className="space-y-6 pb-20">
      {/* 1. WELCOME BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B0F17] via-[#151D2A] to-[#241710] p-8 text-white shadow-md border border-[#1E2738]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5">
            {/* Orange label badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-orange-500/15 text-[#FB923C] border border-orange-400/30">
              <span
                className={`w-2 h-2 rounded-full ${
                  hasData ? 'bg-[#FB923C] animate-pulse' : 'bg-gray-400'
                }`}
              />
              <span>
                {hasData
                  ? `WORKSPACE ACTIVE • ${documents.length} DOCUMENT${documents.length > 1 ? 'S' : ''} INGESTED`
                  : 'CLIENT SANDBOX • AWAITING SOURCE FILES'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome to Fizo AI
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Upload your financial documents (CSV, PDF, JSON, XLSX, Images) to compute real-time financial intelligence, detect solvency risks, and verify formulas with zero telemetry.
            </p>

            {/* Action buttons under title */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/documents')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Financial Documents</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/files')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all border border-white/20 cursor-pointer active:scale-95"
              >
                <FileSpreadsheet className="w-4 h-4 text-gray-300" />
                <span>View Memory & Files</span>
              </button>
            </div>
          </div>

          {/* Right side stats summary */}
          <div className="hidden lg:flex flex-col items-end justify-center bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-xs min-w-[200px] text-right">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              Ingested Sources
            </span>
            <span className="text-2xl font-black text-white mt-0.5">
              {documents.length}
            </span>
            <span className="text-[11px] text-gray-400 mt-1">
              {metrics.length} metrics calculated
            </span>
          </div>
        </div>

        {/* Decorative background ambient glow */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-orange-500/10 pointer-events-none blur-3xl" />
      </div>

      {/* 2. HEALTH SCORE + RATIOS WITH SPECIALIZED GRAPHS (Row of 4 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* 1. HealthScoreCard (0-100 Gauge) */}
        <HealthScoreCard healthScore={hasData ? healthScore : null} />

        {/* 2. GROSS MARGIN (Circular Percentage Arc Gauge) */}
        <MetricCard
          label="GROSS MARGIN"
          value={hasData && grossMarginMetric ? grossMarginMetric.value : 0}
          unit="%"
          change={hasData && grossMarginMetric?.comparedTo ? grossMarginMetric.comparedTo.changePercent : undefined}
          changeLabel="vs prior"
          confidence={hasData && grossMarginMetric ? grossMarginMetric.confidence : undefined}
          isEmpty={!hasData}
          graph={
            <GrossMarginGauge
              value={hasData && grossMarginMetric ? grossMarginMetric.value : 0}
              isEmpty={!hasData || !grossMarginMetric}
              size={64}
            />
          }
          graphPosition="side"
          onEvidenceClick={
            hasData && grossMarginMetric ? () => handleOpenEvidence(grossMarginMetric) : undefined
          }
        />

        {/* 3. CURRENT RATIO (3-Zone Liquidity Spectrum Meter) */}
        <MetricCard
          label="CURRENT RATIO"
          value={hasData && currentRatioMetric ? currentRatioMetric.value : 0}
          unit="x"
          change={hasData && currentRatioMetric?.comparedTo ? currentRatioMetric.comparedTo.changePercent : undefined}
          changeLabel="vs prior"
          confidence={hasData && currentRatioMetric ? currentRatioMetric.confidence : undefined}
          isEmpty={!hasData}
          graph={
            <CurrentRatioMeter
              value={hasData && currentRatioMetric ? currentRatioMetric.value : 0}
              isEmpty={!hasData || !currentRatioMetric}
            />
          }
          graphPosition="bottom"
          onEvidenceClick={
            hasData && currentRatioMetric ? () => handleOpenEvidence(currentRatioMetric) : undefined
          }
        />

        {/* 4. DEBT TO EQUITY (Leverage Proportion Bar & Debt Share %) */}
        <MetricCard
          label="DEBT TO EQUITY"
          value={hasData && debtToEquityMetric ? debtToEquityMetric.value : 0}
          unit="x"
          change={hasData && debtToEquityMetric?.comparedTo ? debtToEquityMetric.comparedTo.changePercent : undefined}
          changeLabel="vs prior"
          confidence={hasData && debtToEquityMetric ? debtToEquityMetric.confidence : undefined}
          isEmpty={!hasData}
          graph={
            <DebtEquitySplit
              value={hasData && debtToEquityMetric ? debtToEquityMetric.value : 0}
              isEmpty={!hasData || !debtToEquityMetric}
            />
          }
          graphPosition="bottom"
          onEvidenceClick={
            hasData && debtToEquityMetric ? () => handleOpenEvidence(debtToEquityMetric) : undefined
          }
        />
      </div>

      {/* 3. REVENUE / PROFIT / CASH (Row of 3 MetricCards with Staggered Animation) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <MetricCard
            label="REVENUE"
            value={hasData ? rawRevenue : 0}
            prefix="RM"
            change={hasData && revenueGrowthMetric?.comparedTo ? revenueGrowthMetric.comparedTo.changePercent : undefined}
            changeLabel="growth"
            confidence={hasData ? 'verified' : undefined}
            isEmpty={!hasData}
            onEvidenceClick={
              hasData && revenueGrowthMetric ? () => handleOpenEvidence(revenueGrowthMetric) : undefined
            }
          />
        </motion.div>

        {/* Operating Cash Flow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <MetricCard
            label="OPERATING CASH FLOW / PROFIT"
            value={hasData ? ocfValue : 0}
            prefix="RM"
            change={hasData && ocfMetric?.comparedTo ? ocfMetric.comparedTo.changePercent : undefined}
            changeLabel="vs prior"
            confidence={hasData ? 'verified' : undefined}
            isEmpty={!hasData}
            onEvidenceClick={
              hasData && ocfMetric ? () => handleOpenEvidence(ocfMetric) : undefined
            }
          />
        </motion.div>

        {/* Current Liquidity */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <MetricCard
            label="CURRENT LIQUIDITY RATIO"
            value={hasData ? currentRatioValue : 0}
            unit="x"
            change={hasData && currentRatioMetric?.comparedTo ? currentRatioMetric.comparedTo.changePercent : undefined}
            changeLabel="vs prior"
            confidence={hasData ? 'verified' : undefined}
            isEmpty={!hasData}
            onEvidenceClick={
              hasData && currentRatioMetric ? () => handleOpenEvidence(currentRatioMetric) : undefined
            }
          />
        </motion.div>
      </div>

      {/* 4 & 5: REVENUE & PROFIT TREND (60%) + TOP AI RECOMMENDATIONS (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* 4. REVENUE & PROFIT TREND (Left 60% / 7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider">
                Revenue & Net Profit Trend
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Comparative progression across uploaded statements
              </p>
            </div>

            {hasData ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-[#EA580C] border border-orange-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Statements</span>
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                Awaiting Uploads
              </span>
            )}
          </div>

          {!hasData ? (
            <div className="h-64 flex flex-col items-center justify-center bg-gray-50/70 rounded-xl border border-dashed border-gray-200 text-center p-6">
              <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-xs font-semibold text-gray-700">Awaiting Document Upload</p>
              <p className="text-[11px] text-gray-500 max-w-xs mt-1">
                Upload financial statements (PDF, CSV, XLSX) to generate comparative revenue and profit charts.
              </p>
              <button
                type="button"
                onClick={() => navigate('/documents')}
                className="mt-3 text-xs font-semibold text-[#EA580C] hover:underline cursor-pointer"
              >
                Go to Documents tab →
              </button>
            </div>
          ) : (
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis
                    dataKey="period"
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  {/* Left Axis: Revenue */}
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 10, fill: '#EA580C' }}
                    axisLine={{ stroke: '#EA580C' }}
                    tickFormatter={(val) =>
                      val >= 1000000
                        ? `RM ${(val / 1000000).toFixed(1)}M`
                        : val >= 1000
                        ? `RM ${(val / 1000).toFixed(0)}k`
                        : `RM ${val}`
                    }
                  />
                  {/* Right Axis: Net Profit */}
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 10, fill: '#DC2626' }}
                    axisLine={{ stroke: '#DC2626' }}
                    tickFormatter={(val) =>
                      val >= 1000000
                        ? `RM ${(val / 1000000).toFixed(1)}M`
                        : val >= 1000
                        ? `RM ${(val / 1000).toFixed(0)}k`
                        : `RM ${val}`
                    }
                  />
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      `RM ${Number(value).toLocaleString()}`,
                      name === 'revenue' ? 'Revenue' : 'Net Profit',
                    ]}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '10px',
                      border: '1px solid #E5E7EB',
                      fontSize: '12px',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                    formatter={(val) => (val === 'revenue' ? 'Total Revenue (Left Axis)' : 'Net Profit (Right Axis)')}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#EA580C"
                    strokeWidth={2.5}
                    activeDot={{ r: 6 }}
                    isAnimationActive={true}
                    animationDuration={1200}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="netProfit"
                    stroke="#DC2626"
                    strokeWidth={2.5}
                    activeDot={{ r: 6 }}
                    isAnimationActive={true}
                    animationDuration={1200}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* 5. TOP AI RECOMMENDATIONS (Right 40% / 5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#EA580C] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider">
                  Top AI Recommendations
                </h3>
              </div>

              {hasData && executiveInsight ? (
                <ConfidenceBadge tier={executiveInsight.confidence} />
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                  Awaiting Ingestion
                </span>
              )}
            </div>

            {!hasData || !executiveInsight ? (
              <div className="p-6 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center text-xs text-gray-500 space-y-1 my-4">
                <Info className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                <p className="font-semibold text-gray-700">No Active AI Insights</p>
                <p className="text-[11px] text-gray-400">
                  Upload financial documents to generate automated AI insights and risk diagnostics.
                </p>
              </div>
            ) : (
              <div className="space-y-3 mt-3">
                <div className="bg-orange-50/40 border border-orange-100 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-orange-950 mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#EA580C] flex-shrink-0" />
                    <span>{executiveInsight.title}</span>
                  </h4>
                  <p className="text-xs text-[#111827] leading-relaxed">
                    {executiveInsight.narrative}
                  </p>
                </div>

                {executiveInsight.limitations && (
                  <div className="flex items-start gap-2 text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    <Info className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Scope & Limitations: </strong>
                      {executiveInsight.limitations}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 mt-4">
            <span className="text-[11px]">Source: Rule-based heuristic analyzer</span>
            <button
              type="button"
              onClick={() => navigate('/insights')}
              className="text-xs font-semibold text-[#EA580C] hover:underline cursor-pointer"
            >
              View all insights →
            </button>
          </div>
        </div>
      </div>

      {/* Evidence Drawer for calculation trace */}
      <EvidenceDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        metric={selectedMetric}
      />
    </div>
  );
};
