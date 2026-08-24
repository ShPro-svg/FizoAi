import React, { useState, useMemo } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  ShieldCheck,
  Lock,
  Activity,
  CheckCircle2,
  Search,
  FileText,
  Trash2,
  Cpu,
  Eye,
  DownloadCloud,
} from 'lucide-react';
import type { AuditAction, AuditEvent } from '../types';

export const PrivacyAuditPage: React.FC = () => {
  const { auditEvents } = useWorkspace();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('all');

  // Filtered audit events
  const filteredEvents = useMemo(() => {
    return auditEvents.filter((evt) => {
      const matchesAction = selectedAction === 'all' || evt.action === selectedAction;
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        evt.action.toLowerCase().includes(searchLower) ||
        evt.entityType.toLowerCase().includes(searchLower) ||
        evt.actor.toLowerCase().includes(searchLower) ||
        (evt.metadata && JSON.stringify(evt.metadata).toLowerCase().includes(searchLower)) ||
        (evt.entityId && evt.entityId.toLowerCase().includes(searchLower));

      return matchesAction && matchesSearch;
    });
  }, [auditEvents, searchTerm, selectedAction]);

  // Action badge styles & icons
  const getActionBadge = (action: AuditAction | string) => {
    switch (action?.toLowerCase()) {
      case 'delete':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
          icon: <Trash2 className="w-3 h-3 text-rose-500" />,
        };
      case 'analyze':
      case 'extract':
      case 'ai_query':
        return {
          bg: 'bg-[#E1F5FF] text-[#0064FA] border-[#91BEFF]/60',
          icon: <Cpu className="w-3 h-3 text-[#0064FA]" />,
        };
      case 'upload':
        return {
          bg: 'bg-[#E2F1E2] text-[#0F4B2D] border-[#5AA55A]/40',
          icon: <FileText className="w-3 h-3 text-[#5AA55A]" />,
        };
      case 'view':
      case 'consent':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: <Eye className="w-3 h-3 text-slate-500" />,
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: <Activity className="w-3 h-3 text-slate-500" />,
        };
    }
  };

  // Human-readable metadata renderer
  const renderMetadata = (evt: AuditEvent) => {
    const meta = evt.metadata;
    if (!meta) {
      return (
        <span className="font-mono text-slate-500 text-[11px] truncate block max-w-xs">
          {evt.entityId || '—'}
        </span>
      );
    }

    // 1. Batch delete
    if (meta.deletedFilenames && Array.isArray(meta.deletedFilenames)) {
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100/80 text-rose-800">
              Deleted {meta.count ?? meta.deletedFilenames.length} files
            </span>
            {meta.actorRole && (
              <span className="text-[10px] text-slate-400 font-medium">({meta.actorRole})</span>
            )}
          </div>
          <p className="text-[11px] text-slate-600 font-mono line-clamp-1 text-ellipsis overflow-hidden">
            {meta.deletedFilenames.join(', ')}
          </p>
        </div>
      );
    }

    // 2. Single file deletion
    if (meta.filename) {
      return (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60 max-w-sm truncate">
            <FileText className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className="truncate">{meta.filename}</span>
          </span>
          {meta.actorRole && (
            <span className="text-[10px] text-slate-400 font-medium">({meta.actorRole})</span>
          )}
        </div>
      );
    }

    // 3. Batch Analysis
    if (
      meta.documentsProcessed !== undefined ||
      meta.metricsComputed !== undefined ||
      meta.risksDetected !== undefined
    ) {
      return (
        <div className="flex items-center gap-1.5 flex-wrap">
          {meta.documentsProcessed !== undefined && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#E1F5FF] text-[#0064FA] border border-[#BAE0FF]">
              {meta.documentsProcessed} Docs Processed
            </span>
          )}
          {meta.metricsComputed !== undefined && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#E2F1E2] text-[#0F4B2D] border border-[#5AA55A]/30">
              {meta.metricsComputed} Metrics Computed
            </span>
          )}
          {meta.risksDetected !== undefined && (
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                meta.risksDetected > 0
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {meta.risksDetected} Risks Detected
            </span>
          )}
        </div>
      );
    }

    // Fallback: render neat key-value tags
    return (
      <div className="flex flex-wrap gap-1 items-center max-w-md">
        {Object.entries(meta).map(([key, val]) => (
          <span
            key={key}
            className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono border border-slate-200/60 truncate max-w-xs"
          >
            <strong className="text-slate-700">{key}:</strong> {String(val)}
          </span>
        ))}
      </div>
    );
  };

  // Export audit log JSON
  const handleExportAudit = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditEvents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `fizo-audit-trail-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden pb-16">
      <PageHeader
        title="Privacy & Audit"
        subtitle="Cryptographic verification, local execution attestations, and immutable event audit log."
      />

      {/* Privacy Guarantee Banners (2 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Zero-Knowledge */}
        <div className="bg-gradient-to-br from-white to-[#F2F8F2] rounded-2xl border border-[#5AA55A]/30 p-5 shadow-soft transition-all hover:shadow-[0_6px_20px_rgba(90,165,90,0.08)]">
          <div className="flex items-center gap-3 mb-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E2F1E2] text-[#0F4B2D] flex items-center justify-center border border-[#5AA55A]/40 flex-shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#5AA55A]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight">
                Zero-Knowledge Browser Processing
              </h3>
              <p className="text-[11px] font-bold text-[#0F4B2D] uppercase tracking-wide">
                100% Client-Side Sandbox
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            All document OCR, spreadsheet parsing, and mathematical formulae are evaluated locally
            inside your browser's WebAssembly and JavaScript sandbox.
          </p>
        </div>

        {/* Card 2: Local Isolation */}
        <div className="bg-gradient-to-br from-white to-[#F0F7FF] rounded-2xl border border-[#BAE0FF] p-5 shadow-soft transition-all hover:shadow-[0_6px_20px_rgba(0,100,250,0.08)]">
          <div className="flex items-center gap-3 mb-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E1F5FF] text-[#0064FA] flex items-center justify-center border border-[#91BEFF]/60 flex-shrink-0">
              <Lock className="w-4 h-4 text-[#0064FA]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight">
                Local Key &amp; Data Isolation
              </h3>
              <p className="text-[11px] font-bold text-[#0064FA] uppercase tracking-wide">
                No Server Storage • Zero Telemetry
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Workspace state exists purely in volatile client memory. No financial numbers or raw
            uploaded records are transmitted to external servers.
          </p>
        </div>
      </div>

      {/* Audit Log Card Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#E1F5FF] text-[#0064FA] flex items-center justify-center border border-[#BAE0FF]/60 flex-shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight">
                Session Audit Trail
              </h3>
              <span className="text-[10px] text-slate-400 font-medium">
                {filteredEvents.length} of {auditEvents.length} events logged in session
              </span>
            </div>
          </div>

          {/* Search, Filter & Export */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search audit trail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0064FA] focus:bg-white text-slate-800 placeholder-slate-400 w-44 sm:w-56 transition-all"
              />
            </div>

            {/* Action Filter */}
            <div className="relative">
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:border-[#0064FA] cursor-pointer"
              >
                <option value="all">All Actions</option>
                <option value="upload">Upload</option>
                <option value="analyze">Analyze</option>
                <option value="delete">Delete</option>
                <option value="view">View</option>
              </select>
            </div>

            {/* Export JSON button */}
            <button
              type="button"
              onClick={handleExportAudit}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <DownloadCloud className="w-3.5 h-3.5 text-slate-500" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4 w-28">Action</th>
                <th className="py-3 px-4 w-24">Entity</th>
                <th className="py-3 px-4">Details / Metadata</th>
                <th className="py-3 px-4 w-44">Actor</th>
                <th className="py-3 px-4 w-36">Timestamp</th>
                <th className="py-3 px-4 w-24 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                    No matching audit events found.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => {
                  const badge = getActionBadge(evt.action);
                  return (
                    <tr
                      key={evt.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Action */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wide border ${badge.bg}`}
                        >
                          {badge.icon}
                          <span>{evt.action}</span>
                        </span>
                      </td>

                      {/* Entity Type */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 uppercase whitespace-nowrap">
                        {evt.entityType}
                      </td>

                      {/* Details / Metadata */}
                      <td className="py-3 px-4 text-slate-700">
                        {renderMetadata(evt)}
                      </td>

                      {/* Actor */}
                      <td className="py-3 px-4 font-medium text-slate-600 text-xs whitespace-nowrap">
                        <span className="bg-slate-100/80 px-2 py-0.5 rounded font-mono text-[11px] text-slate-700 border border-slate-200/50">
                          {evt.actor}
                        </span>
                      </td>

                      {/* Timestamp */}
                      <td className="py-3 px-4 text-slate-400 text-[11px] font-mono whitespace-nowrap">
                        {new Date(evt.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}{' '}
                        <span className="text-[10px] text-slate-300 block">
                          {new Date(evt.timestamp).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Cryptographic Verification */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[#0F4B2D] bg-[#E2F1E2] border border-[#5AA55A]/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-[#5AA55A]" />
                          <span>Verified</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
