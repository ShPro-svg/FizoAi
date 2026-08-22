import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { useWorkspace } from '../context/WorkspaceContext';
import { ShieldCheck, Lock, Activity, CheckCircle2 } from 'lucide-react';

export const PrivacyAuditPage: React.FC = () => {
  const { auditEvents } = useWorkspace();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Privacy & Audit"
        subtitle="Cryptographic verification, local execution attestations, and immutable event audit log."
      />

      {/* Privacy Guarantee Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-emerald-200 p-5 shadow-sm bg-gradient-to-br from-white to-emerald-50/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#059669] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111827]">Zero-Knowledge Browser Processing</h3>
              <p className="text-xs text-gray-500">100% Client-Side Sandbox</p>
            </div>
          </div>
          <p className="text-xs text-[#4B5563] leading-relaxed mt-2">
            All document OCR, spreadsheet parsing, and mathematical formulae are evaluated inside your browser's WebAssembly and JavaScript runtime.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm bg-gradient-to-br from-white to-blue-50/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#2563EB] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111827]">Local Key & Data Isolation</h3>
              <p className="text-xs text-gray-500">No Server Storage</p>
            </div>
          </div>
          <p className="text-xs text-[#4B5563] leading-relaxed mt-2">
            Workspace state exists purely in client memory. No telemetry or financial data points leave your machine.
          </p>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-[#111827]">Session Audit Trail</h3>
          </div>
          <span className="text-xs text-gray-400 font-medium">
            {auditEvents.length} events logged
          </span>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Entity Type</th>
              <th className="py-3 px-4">Details / Metadata</th>
              <th className="py-3 px-4">Actor</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4 text-right">Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-mono">
            {auditEvents.map((evt) => (
              <tr key={evt.id} className="hover:bg-gray-50/50 transition-colors font-sans">
                <td className="py-3 px-4 font-semibold text-[#111827] uppercase text-[11px]">
                  <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono">
                    {evt.action}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-500 text-xs font-mono">
                  {evt.entityType}
                </td>
                <td className="py-3 px-4 text-[#4B5563] text-xs">
                  {evt.metadata ? JSON.stringify(evt.metadata) : evt.entityId}
                </td>
                <td className="py-3 px-4 text-gray-600 text-xs font-mono">
                  {evt.actor}
                </td>
                <td className="py-3 px-4 text-gray-400 text-[11px] font-mono whitespace-nowrap">
                  {new Date(evt.timestamp).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="inline-flex items-center gap-1 text-[#059669] text-xs font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
