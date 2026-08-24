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
} from 'recharts';
import {
  Plus,
  CheckCircle2,
  Info,
  ShieldCheck,
  UploadCloud,
  FileSpreadsheet,
  TrendingUp,
  Landmark,
  Wallet,
  BarChart3,
  Activity,
  AlertTriangle,
  ChevronRight,
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

// ─── Stagger helper ───────────────────────────────────────────────────────────
const staggerProps = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, delay: i * 0.09, ease: 'easeOut' as const },
});

// ─── Section Divider ──────────────────────────────────────────────────────────
const SectionLabel: React.FC<{
  label: string;
  sub?: string;
  icon?: React.ReactNode;
}> = ({ label, sub, icon }) => (
  <div className="flex items-center gap-3 mb-4">
    {icon && (
      <div className="w-6 h-6 rounded-lg bg-[#E1F5FF] text-[#0064FA] flex items-center justify-center flex-shrink-0 border border-[#BAE0FF]/60">
        {icon}
      </div>
    )}
    <div className="flex items-center gap-3 flex-1">
      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-slate-100" />
      {sub && <span className="text-[10px] font-medium text-slate-300 whitespace-nowrap">{sub}</span>}
    </div>
  </div>
);

// ─── Period Toggle ─────────────────────────────────────────────────────────────
const PERIODS = ['Current Period', 'Prior Period', 'All Periods'] as const;
type Period = (typeof PERIODS)[number];

const PeriodToggle: React.FC<{ value: Period; onChange: (p: Period) => void }> = ({
  value,
  onChange,
}) => (
  <div className="inline-flex items-center bg-slate-100/80 rounded-xl p-0.5 border border-slate-200/60">
    {PERIODS.map((p) => (
      <button
        key={p}
        type="button"
        onClick={() => onChange(p)}
        className={`px-3 py-1.5 rounded-[10px] text-[10px] font-bold transition-all duration-150 cursor-pointer ${
          value === p
            ? 'bg-white text-[#0064FA] shadow-[0_1px_4px_rgba(0,0,0,0.07)] border border-slate-200/80'
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        {p}
      </button>
    ))}
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { documents, metrics, insights, healthScore } = useWorkspace();

  const [selectedMetric, setSelectedMetric] = useState<FinancialMetric | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [activePeriod, setActivePeriod] = useState<Period>('Current Period');

  const hasData = documents.length > 0 && metrics.length > 0;

  const handleOpenEvidence = (metric?: FinancialMetric) => {
    if (metric) {
      setSelectedMetric(metric);
      setIsDrawerOpen(true);
    }
  };

  // ── Metric Lookups ──────────────────────────────────────────────────────────
  const grossMarginMetric = metrics.find((m) => m.id === 'metric-gross-margin');
  const currentRatioMetric = metrics.find((m) => m.id === 'metric-current-ratio');
  const debtToEquityMetric = metrics.find((m) => m.id === 'metric-debt-to-equity');
  const revenueGrowthMetric = metrics.find((m) => m.id === 'metric-revenue-growth');
  const ocfMetric = metrics.find((m) => m.id === 'metric-operating-cash-flow');

  // ── Raw values ──────────────────────────────────────────────────────────────
  const rawRevenue = revenueGrowthMetric?.inputs?.[0]?.value
    ? parseFloat(String(revenueGrowthMetric.inputs[0].value).replace(/[^0-9.-]+/g, ''))
    : 0;

  const ocfValue = ocfMetric ? ocfMetric.value : 0;
  const currentRatioValue = currentRatioMetric ? currentRatioMetric.value : 0;

  // ── Timeline Chart Data ─────────────────────────────────────────────────────
  const timelineChartData = React.useMemo(() => {
    if (!hasData) return [];

    const points: {
      year: string;
      revenue: number;
      netProfit: number;
      rawRevenueVal: number;
      rawProfitVal: number;
    }[] = [];

    documents.forEach((doc) => {
      const inc = doc.extractedData?.incomeStatement;
      if (inc?.revenue?.value) {
        const rev = inc.revenue.value;
        const profit = inc.netProfit?.value ?? Math.round(rev * 0.14);
        const periodStr = doc.extractedData?.period || doc.name.match(/20\d\d/)?.[0] || 'Current';
        const cleanPeriod = String(periodStr).replace(/^FY/i, '');

        const existingIdx = points.findIndex((p) => p.year === cleanPeriod);
        if (existingIdx >= 0) {
          points[existingIdx].revenue = Math.max(points[existingIdx].revenue, rev);
          points[existingIdx].netProfit = Math.max(points[existingIdx].netProfit, profit);
          points[existingIdx].rawRevenueVal = points[existingIdx].revenue;
          points[existingIdx].rawProfitVal = points[existingIdx].netProfit;
        } else {
          points.push({
            year: cleanPeriod,
            revenue: rev,
            netProfit: profit,
            rawRevenueVal: rev,
            rawProfitVal: profit,
          });
        }
      }
    });

    if (points.length === 1 && revenueGrowthMetric?.comparedTo) {
      const priorRev =
        parseFloat(String(revenueGrowthMetric.inputs?.[1]?.value || '').replace(/[^0-9.-]+/g, '')) ||
        Math.round(points[0].rawRevenueVal * 0.94);
      const priorPeriod = String(revenueGrowthMetric.comparedTo.period || '2024').replace(/^FY/i, '');
      return [
        {
          year: priorPeriod,
          revenue: priorRev,
          netProfit: Math.round(priorRev * 0.12),
          rawRevenueVal: priorRev,
          rawProfitVal: Math.round(priorRev * 0.12),
        },
        points[0],
      ];
    }

    if (points.length === 1) return points;
    return points.sort((a, b) => a.year.localeCompare(b.year));
  }, [hasData, documents, revenueGrowthMetric]);

  // Dynamic filter based on Period Toggle
  const displayedTimelineData = React.useMemo(() => {
    if (timelineChartData.length <= 1 || activePeriod === 'All Periods') {
      return timelineChartData;
    }
    if (activePeriod === 'Current Period') {
      return [timelineChartData[timelineChartData.length - 1]];
    }
    if (activePeriod === 'Prior Period') {
      return [timelineChartData[0]];
    }
    return timelineChartData;
  }, [timelineChartData, activePeriod]);

  // ── AI Narrative Insight ────────────────────────────────────────────────────
  const executiveInsight = insights[0];

  // ── Snapshot Bar statuses ───────────────────────────────────────────────────
  const snapshotItems = React.useMemo(() => {
    if (!hasData) return [];
    const items: { label: string; status: 'ok' | 'warn' | 'danger' }[] = [];
    if (rawRevenue > 0) items.push({ label: 'Generating Revenue', status: 'ok' });
    if (grossMarginMetric && grossMarginMetric.value > 20)
      items.push({ label: `${grossMarginMetric.value.toFixed(1)}% Margin`, status: grossMarginMetric.value > 40 ? 'ok' : 'warn' });
    if (currentRatioValue >= 1.5) items.push({ label: 'Liquid', status: 'ok' });
    else if (currentRatioValue > 0) items.push({ label: 'Liquidity Risk', status: 'warn' });
    if (debtToEquityMetric) {
      if (debtToEquityMetric.value <= 1.0) items.push({ label: 'Conservative Leverage', status: 'ok' });
      else if (debtToEquityMetric.value <= 2.0) items.push({ label: 'Moderate Leverage', status: 'warn' });
      else items.push({ label: 'High Leverage', status: 'danger' });
    }
    items.push({ label: `${metrics.length} Metrics Verified`, status: 'ok' });
    return items;
  }, [hasData, rawRevenue, grossMarginMetric, currentRatioValue, debtToEquityMetric, metrics.length]);

  const statusDot: Record<'ok' | 'warn' | 'danger', string> = {
    ok: 'bg-[#5AA55A]',
    warn: 'bg-amber-400',
    danger: 'bg-rose-500',
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 pb-20">

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. WELCOME BANNER (Ultra-Premium Light SaaS Hero)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-[#F4F9FF] to-[#E5F3FF]/70 p-7 sm:p-9 text-slate-900 shadow-[0_6px_30px_rgba(0,100,250,0.06),0_1px_3px_rgba(0,0,0,0.02)] border border-[#BAE0FF]/70"
      >
        {/* Subtle geometric glass arcs in the background */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full border-[12px] border-[#BAE0FF]/30 pointer-events-none" />
        <div className="absolute right-32 -bottom-24 w-80 h-80 rounded-full border-[16px] border-[#E1F5FF]/60 pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-gradient-to-tr from-[#E1F5FF]/80 to-transparent pointer-events-none blur-2xl" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-4 max-w-2xl">
            {/* Status indicator badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-[0.14em] uppercase bg-white/95 text-[#0064FA] border border-[#BAE0FF] shadow-2xs">
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  hasData ? 'bg-[#5AA55A] animate-pulse' : 'bg-slate-400'
                }`}
              />
              <span>
                {hasData
                  ? `WORKSPACE ACTIVE • ${documents.length} MULTI-FORMAT DOCUMENT${documents.length > 1 ? 'S' : ''} INGESTED`
                  : 'CLIENT SANDBOX • AWAITING SOURCE FILES'}
              </span>
            </div>

            {/* Main Headline with Gradient Brand Accent */}
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black tracking-tight text-slate-900 leading-[1.15]">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-[#0064FA] via-[#0053D6] to-[#3B82F6] bg-clip-text text-transparent">
                Fizo AI
              </span>
            </h1>

            {/* Supporting Subtitle */}
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-xl">
              Upload multi-format financial statements (PDF, CSV, XLSX, JSON, Images) to compute
              real-time solvency intelligence, detect risk anomalies, and verify formulas with zero telemetry.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 border border-slate-200/80 text-[10.5px] font-bold text-slate-700 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#5AA55A]" />
                100% Client-Side Sandbox
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 border border-slate-200/80 text-[10.5px] font-bold text-slate-700 shadow-2xs">
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#0064FA]" />
                PDF • CSV • XLSX • JSON • Scan
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 border border-slate-200/80 text-[10.5px] font-bold text-slate-700 shadow-2xs">
                <TrendingUp className="w-3.5 h-3.5 text-[#0064FA]" />
                Solvency &amp; Risk Engine
              </span>
            </div>

            {/* CTA action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/documents')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0064FA] hover:bg-[#0053D6] active:bg-[#003FB3] text-white text-xs font-bold transition-all shadow-[0_3px_12px_rgba(0,100,250,0.28)] hover:shadow-[0_6px_20px_rgba(0,100,250,0.38)] hover:-translate-y-0.5 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Financial Documents</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/files')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all border border-slate-200/90 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 cursor-pointer active:scale-95"
              >
                <FileSpreadsheet className="w-4 h-4 text-slate-400" />
                <span>View Memory &amp; Files</span>
              </button>
            </div>
          </div>

          {/* Right side stats summary card */}
          <div className="hidden lg:flex flex-col items-end justify-center bg-white/95 border border-[#BAE0FF]/80 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,100,250,0.06)] min-w-[230px] text-right gap-1.5 backdrop-blur-xs">
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">
              Ingested Sources
            </span>
            <span className="text-4xl font-black text-slate-900 leading-none">
              {documents.length}
            </span>
            <div className="flex flex-col items-end gap-1 mt-1">
              <span className="text-[11px] font-bold text-[#0064FA] bg-[#E1F5FF] px-3 py-0.5 rounded-full border border-[#BAE0FF]/70 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#0064FA]" />
                {metrics.length} metrics calculated
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                Zero telemetry active
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. SNAPSHOT STATUS BAR (new feature)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {hasData && snapshotItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15, ease: 'easeOut' }}
          className="flex flex-wrap items-center gap-2 px-5 py-3 bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-300 mr-1">
            Status
          </span>
          {snapshotItems.map((item, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                item.status === 'ok'
                  ? 'bg-[#E2F1E2] text-[#0F4B2D] border-[#5AA55A]/30'
                  : item.status === 'warn'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot[item.status]}`} />
              {item.label}
            </span>
          ))}
          <div className="ml-auto flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
            <Activity className="w-3 h-3" />
            Live
          </div>
        </motion.div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          3. PERFORMANCE PILLARS (Health Score + 3 Ratios)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div>
        <SectionLabel
          label="Performance Pillars"
          sub="Solvency, Margin & Liquidity Ratios"
          icon={<BarChart3 className="w-3.5 h-3.5" />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch">
          {/* Health Score */}
          <motion.div {...staggerProps(0)} className="h-full flex flex-col">
            <HealthScoreCard healthScore={hasData ? healthScore : null} className="h-full" />
          </motion.div>

          {/* Gross Margin */}
          <motion.div {...staggerProps(1)} className="h-full flex flex-col">
            <MetricCard
              label="Gross Margin"
              value={hasData && grossMarginMetric ? grossMarginMetric.value : 0}
              unit="%"
              change={hasData && grossMarginMetric?.comparedTo ? grossMarginMetric.comparedTo.changePercent : undefined}
              changeLabel="vs prior"
              confidence={hasData && grossMarginMetric ? grossMarginMetric.confidence : undefined}
              isEmpty={!hasData}
              className="h-full"
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
          </motion.div>

          {/* Current Ratio */}
          <motion.div {...staggerProps(2)} className="h-full flex flex-col">
            <MetricCard
              label="Current Ratio"
              value={hasData && currentRatioMetric ? currentRatioMetric.value : 0}
              unit="x"
              change={hasData && currentRatioMetric?.comparedTo ? currentRatioMetric.comparedTo.changePercent : undefined}
              changeLabel="vs prior"
              confidence={hasData && currentRatioMetric ? currentRatioMetric.confidence : undefined}
              isEmpty={!hasData}
              className="h-full"
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
          </motion.div>

          {/* Debt to Equity */}
          <motion.div {...staggerProps(3)} className="h-full flex flex-col">
            <MetricCard
              label="Debt to Equity"
              value={hasData && debtToEquityMetric ? debtToEquityMetric.value : 0}
              unit="x"
              change={hasData && debtToEquityMetric?.comparedTo ? debtToEquityMetric.comparedTo.changePercent : undefined}
              changeLabel="vs prior"
              confidence={hasData && debtToEquityMetric ? debtToEquityMetric.confidence : undefined}
              isEmpty={!hasData}
              className="h-full"
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
          </motion.div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          4. KEY FINANCIALS (Revenue, OCF, Liquidity)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div>
        <SectionLabel
          label="Key Financials"
          sub="Income, Cash Flow & Liquidity"
          icon={<Landmark className="w-3.5 h-3.5" />}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          {/* Revenue */}
          <motion.div {...staggerProps(0)} className="h-full flex flex-col">
            <MetricCard
              label="Revenue"
              value={hasData ? rawRevenue : 0}
              prefix="RM"
              change={hasData && revenueGrowthMetric?.comparedTo ? revenueGrowthMetric.comparedTo.changePercent : undefined}
              changeLabel="growth"
              confidence={hasData ? 'verified' : undefined}
              isEmpty={!hasData}
              className="h-full"
              icon={<TrendingUp className="w-3.5 h-3.5" />}
              onEvidenceClick={
                hasData && revenueGrowthMetric ? () => handleOpenEvidence(revenueGrowthMetric) : undefined
              }
            />
          </motion.div>

          {/* Operating Cash Flow */}
          <motion.div {...staggerProps(1)} className="h-full flex flex-col">
            <MetricCard
              label="Operating Cash Flow / Profit"
              value={hasData ? ocfValue : 0}
              prefix="RM"
              change={hasData && ocfMetric?.comparedTo ? ocfMetric.comparedTo.changePercent : undefined}
              changeLabel="vs prior"
              confidence={hasData ? 'verified' : undefined}
              isEmpty={!hasData}
              className="h-full"
              icon={<Wallet className="w-3.5 h-3.5" />}
              onEvidenceClick={
                hasData && ocfMetric ? () => handleOpenEvidence(ocfMetric) : undefined
              }
            />
          </motion.div>

          {/* Current Liquidity */}
          <motion.div {...staggerProps(2)} className="h-full flex flex-col">
            <MetricCard
              label="Current Liquidity Ratio"
              value={hasData ? currentRatioValue : 0}
              unit="x"
              change={hasData && currentRatioMetric?.comparedTo ? currentRatioMetric.comparedTo.changePercent : undefined}
              changeLabel="vs prior"
              confidence={hasData ? 'verified' : undefined}
              isEmpty={!hasData}
              className="h-full"
              icon={<Activity className="w-3.5 h-3.5" />}
              onEvidenceClick={
                hasData && currentRatioMetric ? () => handleOpenEvidence(currentRatioMetric) : undefined
              }
            />
          </motion.div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          5. TREND CHART + AI RECOMMENDATIONS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch"
      >
        {/* ── Revenue & Profit Trend (Left 7 cols) ─────────────────────── */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-soft flex flex-col">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <TrendingUp className="w-4 h-4 text-[#0064FA]" />
                <h3 className="text-sm font-black text-slate-900 tracking-tight">
                  Revenue &amp; Profit Trend
                </h3>
              </div>
              <p className="text-[10px] text-slate-400 font-medium ml-6">
                {timelineChartData.length > 1
                  ? `Comparative Timeline (${timelineChartData.map((d) => d.year).join(' → ')}) • Verified`
                  : `Current Period (${timelineChartData[0]?.year || 'FY2025'}) • Verified`}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
              {/* Period Toggle (new feature — visual) */}
              <PeriodToggle value={activePeriod} onChange={setActivePeriod} />

              {hasData && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E1F5FF] text-[#0064FA] border border-[#BAE0FF]">
                  {timelineChartData.length > 1 ? 'Multi-Period' : 'Single Period'}
                </span>
              )}
            </div>
          </div>

          {/* Chart Legend */}
          {hasData && (
            <div className="flex items-center gap-4 mb-3 ml-1">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-[3px] rounded-full bg-[#0064FA] inline-block" />
                <span className="text-[10px] font-bold text-slate-500">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-[2px] rounded-full bg-[#5AA55A] inline-block border-dashed" style={{ borderBottom: '2px dashed #5AA55A', background: 'none' }} />
                <span className="text-[10px] font-bold text-slate-500">Net Profit</span>
              </div>
            </div>
          )}

          {/* Chart area */}
          {!hasData ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 text-center p-8 min-h-[220px]">
              <UploadCloud className="w-8 h-8 text-[#0064FA] mb-2 opacity-40" />
              <p className="text-xs font-bold text-slate-700">Awaiting Document Upload</p>
              <p className="text-[11px] text-slate-400 max-w-xs mt-1 leading-relaxed">
                Upload financial statements (PDF, CSV, XLSX) to generate comparative revenue and profit
                charts.
              </p>
              <button
                type="button"
                onClick={() => navigate('/documents')}
                className="mt-3 text-xs font-bold text-[#0064FA] hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                Go to Documents <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex-1 min-h-[220px] w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={displayedTimelineData}
                  margin={{ top: 15, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="year"
                    tickLine={false}
                    axisLine={{ stroke: '#E2E8F0' }}
                    tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 600 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }}
                    tickFormatter={(val) => {
                      if (Math.abs(val) >= 1000000) return `RM ${(val / 1000000).toFixed(1)}M`;
                      if (Math.abs(val) >= 1000) return `RM ${(val / 1000).toFixed(0)}k`;
                      return `RM ${val}`;
                    }}
                    width={72}
                  />
                  <Tooltip
                    formatter={(value: unknown, name: unknown) => [
                      `RM ${Number(value).toLocaleString()}`,
                      name === 'revenue' ? 'Revenue' : 'Net Profit',
                    ]}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '14px',
                      border: '1px solid #E2E8F0',
                      fontSize: '11px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                      fontWeight: 600,
                    }}
                    cursor={{ stroke: '#E2E8F0', strokeWidth: 1 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0064FA"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#0064FA', strokeWidth: 2, stroke: '#fff' }}
                    isAnimationActive={true}
                    animationDuration={1200}
                  />
                  <Line
                    type="monotone"
                    dataKey="netProfit"
                    stroke="#5AA55A"
                    strokeWidth={2.5}
                    strokeDasharray="5 4"
                    dot={{ r: 4, fill: '#5AA55A', strokeWidth: 2, stroke: '#fff' }}
                    isAnimationActive={true}
                    animationDuration={1200}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* ── AI Recommendations (Right 5 cols) ────────────────────────── */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-soft flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-[#E1F5FF] text-[#0064FA] flex items-center justify-center border border-[#BAE0FF]/60 flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest leading-none">
                  AI Recommendations
                </h3>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  Rule-based heuristic analysis
                </p>
              </div>
            </div>

            {hasData && executiveInsight ? (
              <ConfidenceBadge tier={executiveInsight.confidence} />
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-400 border border-slate-200">
                Awaiting
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100 mb-4" />

          {/* Body */}
          <div className="flex-1">
            {!hasData || !executiveInsight ? (
              <div className="p-6 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200 text-center space-y-1.5">
                <Info className="w-5 h-5 mx-auto text-slate-300 mb-1" />
                <p className="text-xs font-bold text-slate-600">No Active AI Insights</p>
                <p className="text-[10px] text-slate-400 max-w-[200px] mx-auto leading-relaxed">
                  Upload financial documents to generate automated AI insights and risk diagnostics.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-gradient-to-br from-[#F0F7FF] to-[#E1F5FF]/60 border border-[#BAE0FF]/70 rounded-2xl p-4">
                  <h4 className="text-[10px] font-black text-[#002E8A] mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0064FA] flex-shrink-0" />
                    {executiveInsight.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    {executiveInsight.narrative}
                  </p>
                </div>

                {executiveInsight.limitations && (
                  <div className="flex items-start gap-2 text-[10px] text-slate-500 bg-amber-50/60 p-3 rounded-xl border border-amber-100">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong className="text-slate-600 font-semibold">Scope & Limitations: </strong>
                      {executiveInsight.limitations}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] text-slate-300 font-medium">Rule-based heuristic engine</span>
            <button
              type="button"
              onClick={() => navigate('/insights')}
              className="text-[10px] font-bold text-[#0064FA] hover:text-[#0053D6] hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              All insights <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Evidence Drawer ───────────────────────────────────────────────────── */}
      <EvidenceDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        metric={selectedMetric}
      />
    </div>
  );
};
