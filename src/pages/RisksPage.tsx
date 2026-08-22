import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  FileText,
  Lock,
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { useWorkspace } from '../context/WorkspaceContext';
import type { RiskSeverity } from '../types';

export const RisksPage: React.FC = () => {
  const { risks } = useWorkspace();
  const [expandedRiskId, setExpandedRiskId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedRiskId((prev) => (prev === id ? null : id));
  };

  // Severity Counts
  const criticalCount = risks.filter((r) => r.severity === 'critical').length;
  const highCount = risks.filter((r) => r.severity === 'high').length;
  const mediumCount = risks.filter((r) => r.severity === 'medium').length;
  const lowCount = risks.filter((r) => r.severity === 'low').length;

  const totalHighCritical = criticalCount + highCount;

  // Donut PieChart Data
  const donutData = [
    { name: 'Critical / High', value: totalHighCritical, color: '#DC2626' },
    { name: 'Medium', value: mediumCount, color: '#D97706' },
    { name: 'Low', value: Math.max(lowCount, risks.length === 0 ? 1 : 0), color: '#059669' },
  ].filter((d) => d.value > 0);

  const getSeverityDot = (severity: RiskSeverity) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'bg-[#DC2626] ring-4 ring-red-100 animate-pulse';
      case 'medium':
        return 'bg-[#D97706] ring-4 ring-amber-100';
      case 'low':
        return 'bg-[#059669] ring-4 ring-emerald-100';
      default:
        return 'bg-gray-400';
    }
  };

  const getSeverityBadge = (severity: RiskSeverity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-[#DC2626] border-red-300 font-bold';
      case 'high':
        return 'bg-red-50 text-[#DC2626] border-red-200 font-semibold';
      case 'medium':
        return 'bg-amber-50 text-[#D97706] border-amber-200 font-medium';
      case 'low':
        return 'bg-emerald-50 text-[#059669] border-emerald-200 font-medium';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. PageHeader */}
      <PageHeader
        title="Risks & Anomaly Intelligence"
        subtitle="Algorithmic detection of financial variances, customer concentrations, and price spikes with mathematical proof."
        actionButton={
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              risks.length > 0
                ? 'bg-red-50 text-[#DC2626] border-red-200'
                : 'bg-emerald-50 text-[#059669] border-emerald-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                risks.length > 0 ? 'bg-[#DC2626]' : 'bg-[#059669]'
              }`}
            />
            <span>{risks.length > 0 ? `${risks.length} active risks` : '0 active risks'}</span>
          </div>
        }
      />

      {/* 2 & 3: DETECTED FINDINGS (60%) + RISK OUTLOOK (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 2. DETECTED FINDINGS (Left 60% / 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-50 text-[#DC2626] flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider">
                Detected Findings & Root Cause Analysis
              </h3>
            </div>
            <span className="text-xs text-gray-400 font-mono">
              {risks.length} anomalies flagged
            </span>
          </div>

          {risks.length === 0 ? (
            <EmptyState
              icon={ShieldCheck}
              title="No Risks or Anomalies Detected"
              description="Your financial statements match cleanly across all mathematical reconciliations with zero flagged discrepancies."
            />
          ) : (
            <div className="space-y-3.5">
              {risks.map((risk) => {
                const isExpanded = expandedRiskId === risk.id;

                return (
                  <div
                    key={risk.id}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 transition-all hover:shadow-md"
                  >
                    {/* Header Row: Severity Dot, Title, Badges */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span
                          className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${getSeverityDot(
                            risk.severity
                          )}`}
                        />
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] uppercase border ${getSeverityBadge(
                                risk.severity
                              )}`}
                            >
                              {risk.severity}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200/80">
                              {risk.category}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-[#059669] border border-emerald-200/60">
                              {risk.status}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-[#111827]">
                            {risk.title}
                          </h4>
                          <p className="text-xs text-[#4B5563] mt-1 leading-relaxed">
                            {risk.description}
                          </p>
                        </div>
                      </div>

                      {/* Expand Button */}
                      <button
                        type="button"
                        onClick={() => toggleExpand(risk.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#EA580C] hover:text-[#C2410C] bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-lg border border-orange-200 transition-colors flex-shrink-0 cursor-pointer"
                      >
                        <span>{isExpanded ? 'Hide' : 'View Evidence'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Expandable Root Cause Evidence Section */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-gray-100 text-xs space-y-3 overflow-hidden"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50/80 p-3.5 rounded-xl border border-gray-200">
                            <div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                                TRIGGER RULE
                              </span>
                              <span className="font-mono text-xs font-semibold text-[#111827]">
                                {risk.rule}
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                                THRESHOLD SPECIFICATION
                              </span>
                              <span className="font-mono text-xs text-red-600 font-semibold">
                                {risk.threshold}
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                                CURRENT VALUE
                              </span>
                              <span className="font-mono text-xs font-bold text-red-700">
                                {risk.currentValue}
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                                COMPARED BENCHMARK
                              </span>
                              <span className="font-mono text-xs text-gray-700 font-medium">
                                {risk.comparedValue} ({risk.deviation})
                              </span>
                            </div>
                          </div>

                          {/* Source Documents & Row Citations */}
                          {risk.evidence && risk.evidence.length > 0 && (
                            <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                              <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block mb-1.5">
                                SOURCE CITATIONS & GROUNDING
                              </span>
                              <div className="space-y-1">
                                {risk.evidence.map((ev, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2 font-mono text-[11px] text-blue-800"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                                    <span className="font-semibold">{ev.documentName}</span>
                                    {ev.page && <span>• Page {ev.page}</span>}
                                    {ev.row && <span>• Row {ev.row}</span>}
                                    {ev.section && <span>({ev.section})</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 3 & 4: RISK OUTLOOK + PDPA VERIFICATION (Right 40% / 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* 3. RISK OUTLOOK (Donut PieChart) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider">
                Risk Outlook & Distribution
              </h3>
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                {totalHighCritical} High/Critical
              </span>
            </div>

            {/* Recharts PieChart Donut */}
            <div className="relative h-60 w-full flex items-center justify-center my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    formatter={(val, name) => [`${val} findings`, name]}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      fontSize: '12px',
                    }}
                  />
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    isAnimationActive={true}
                    animationDuration={1200}
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-3xl font-bold text-[#DC2626]">
                  {totalHighCritical}
                </span>
                <span className="text-[10px] font-bold tracking-wider text-red-700 uppercase">
                  HIGH / CRITICAL
                </span>
              </div>
            </div>

            {/* Legend Breakdown */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 text-center text-xs">
              <div className="bg-red-50/70 p-2 rounded-xl border border-red-100">
                <span className="text-[11px] font-medium text-red-700 block">Critical/High</span>
                <span className="text-base font-bold text-red-800">{totalHighCritical}</span>
              </div>
              <div className="bg-amber-50/70 p-2 rounded-xl border border-amber-100">
                <span className="text-[11px] font-medium text-amber-700 block">Medium</span>
                <span className="text-base font-bold text-amber-800">{mediumCount}</span>
              </div>
              <div className="bg-emerald-50/70 p-2 rounded-xl border border-emerald-100">
                <span className="text-[11px] font-medium text-emerald-700 block">Low</span>
                <span className="text-base font-bold text-emerald-800">{lowCount}</span>
              </div>
            </div>
          </div>

          {/* 4. PDPA & VERIFICATION SUMMARY CARD */}
          <div className="bg-gradient-to-br from-emerald-50/50 to-teal-50/40 rounded-2xl border border-emerald-200/80 p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#059669] flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                  Zero Hallucination Proof
                </h4>
                <span className="text-[10px] text-emerald-800 font-mono">
                  Deterministic Audit Guarantee
                </span>
              </div>
            </div>

            <p className="text-xs text-[#374151] leading-relaxed">
              All flagged items are computed deterministically from verified document records with zero hallucinated anomalies.
            </p>

            <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-emerald-800 font-medium">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% In-Memory Sandbox</span>
              </span>
              <span className="text-emerald-700 font-semibold">PDPA Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
