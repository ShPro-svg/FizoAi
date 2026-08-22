import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { useWorkspace } from '../context/WorkspaceContext';
import { Sparkles, Info, ShieldCheck } from 'lucide-react';
import { ConfidenceBadge } from '../components/ui/ConfidenceBadge';
import { EmptyState } from '../components/ui/EmptyState';

export const InsightsPage: React.FC = () => {
  const { insights } = useWorkspace();

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Insights"
        subtitle="Strategic recommendations, working capital optimizations, and margin expansion levers."
      />

      {insights.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No insights generated yet"
          description="Upload financial data or load demo datasets to view automated analytical insights."
        />
      ) : (
        <div className="space-y-5">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Source: {insight.source}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      {new Date(insight.generatedAt).toLocaleString()}
                    </span>
                  </div>
                  {insight.confidence && <ConfidenceBadge tier={insight.confidence} />}
                </div>

                <h3 className="text-base font-bold text-[#111827] mb-2">{insight.title}</h3>
                <p className="text-xs text-[#374151] leading-relaxed mb-4 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                  {insight.narrative}
                </p>
              </div>

              {insight.limitations && (
                <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-200/60 mt-2">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-semibold text-amber-900">Analysis Scope & Limitations: </span>
                      <span className="text-amber-800">{insight.limitations}</span>
                    </div>
                  </div>
                </div>
              )}

              {insight.evidence && insight.evidence.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">Source Evidence:</span>
                  {insight.evidence.map((ev, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-[11px] font-mono text-gray-700"
                    >
                      <ShieldCheck className="w-3 h-3 text-blue-600" />
                      <span>{ev.documentName}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
