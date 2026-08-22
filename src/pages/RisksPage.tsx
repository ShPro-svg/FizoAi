import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { useWorkspace } from '../context/WorkspaceContext';
import { AlertTriangle } from 'lucide-react';
import { ConfidenceBadge } from '../components/ui/ConfidenceBadge';
import { EmptyState } from '../components/ui/EmptyState';

export const RisksPage: React.FC = () => {
  const { risks } = useWorkspace();

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-[#DC2626] border-red-300 font-bold';
      case 'high':
        return 'bg-red-50 text-[#DC2626] border-red-200';
      case 'medium':
        return 'bg-amber-50 text-[#D97706] border-amber-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Risks & Anomalies"
        subtitle="Automated discrepancy detection across ledgers, bank transactions, and statutory reports."
      />

      {risks.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No risks or anomalies detected"
          description="Your current workspace records match cleanly across all corroborating statements."
        />
      ) : (
        <div className="space-y-4">
          {risks.map((risk) => (
            <div
              key={risk.id}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs uppercase border ${getSeverityBadge(
                      risk.severity
                    )}`}
                  >
                    {risk.severity} severity
                  </span>
                  <h3 className="text-sm font-bold text-[#111827]">{risk.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                    {risk.deviation}
                  </span>
                  <ConfidenceBadge tier="verified" />
                </div>
              </div>

              <p className="text-xs text-[#4B5563] leading-relaxed mt-2">{risk.description}</p>

              <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-500 bg-gray-50/50 p-2.5 rounded-lg">
                <div>
                  <span className="font-semibold text-gray-700 block">Rule:</span>
                  <span className="text-gray-600">{risk.rule}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 block">Current Value:</span>
                  <span className="text-red-600 font-medium">{risk.currentValue}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 block">Prior / Threshold:</span>
                  <span className="text-gray-600">{risk.comparedValue} (Threshold: {risk.threshold})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
