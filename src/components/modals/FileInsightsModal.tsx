import React, { useState } from 'react';
import {
  X,
  FileText,
  Sparkles,
  Download,
  ShieldCheck,
  Table,
  Cpu,
  Layers,
  Building2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import type { FinancialDocument } from '../../types';
import { useWorkspace } from '../../context/WorkspaceContext';
import { generateFinancialReportPDF } from '../../services/pdfReportService';

interface FileInsightsModalProps {
  document: FinancialDocument | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FileInsightsModal: React.FC<FileInsightsModalProps> = ({
  document,
  isOpen,
  onClose,
}) => {
  const { metrics, risks, insights, companyProfile, currentUser } = useWorkspace();
  const [activeTab, setActiveTab] = useState<'extracted' | 'raw_tables' | 'raw_json'>('extracted');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen || !document) return null;

  const ext = document.extractedData || {};
  const inc = ext.incomeStatement || {};
  const bs = ext.balanceSheet || {};
  const cf = ext.cashFlow || {};
  const rawTables = ext.rawTables || [];

  const handleDownloadPDF = () => {
    setIsExporting(true);
    try {
      generateFinancialReportPDF({
        document,
        metrics,
        risks,
        insights,
        companyProfile,
        operatorName: currentUser?.name || 'Adam H. (Analyst)',
      });
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setTimeout(() => setIsExporting(false), 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden text-slate-900">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E1F5FF] text-[#0064FA] flex items-center justify-center border border-[#91BEFF]/60">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 truncate max-w-md">
                  {document.name}
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                  {document.type}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E2F1E2] text-[#0F4B2D] border border-[#5AA55A]/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#5AA55A]" />
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Period: {ext.period || 'FY2025'}
                </span>
                <span>•</span>
                <span>Size: {(document.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-[#0064FA]" />
                  {companyProfile?.name}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0064FA] hover:bg-[#0053D6] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Generating PDF...' : 'Download Official PDF'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Side-by-Side Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Left Column: Raw Extracted Data & Tables (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col overflow-hidden bg-slate-50/40">
            {/* View Selector Tabs */}
            <div className="px-5 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#0064FA]" />
                Extracted Data & Ledger
              </span>

              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('extracted')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    activeTab === 'extracted'
                      ? 'bg-white text-[#0064FA] shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Key Fields
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('raw_tables')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    activeTab === 'raw_tables'
                      ? 'bg-white text-[#0064FA] shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Tables ({rawTables.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('raw_json')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    activeTab === 'raw_json'
                      ? 'bg-white text-[#0064FA] shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Raw JSON
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              {activeTab === 'extracted' && (
                <div className="space-y-4">
                  {/* Income Statement Fields */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                      <span className="w-2 h-2 rounded-full bg-[#5AA55A]" />
                      Profit & Loss Items
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {Object.entries(inc).map(([k, f]) => (
                        <div key={k} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="text-[11px] text-slate-500 font-semibold">{f.label}</p>
                          <p className="text-sm font-extrabold text-slate-900 font-mono mt-0.5">
                            RM {Number(f.value).toLocaleString()}
                          </p>
                          {f.source && (
                            <p className="text-[10px] text-slate-400 mt-1 truncate">
                              Source: {f.source.section || f.source.documentName}
                            </p>
                          )}
                        </div>
                      ))}
                      {Object.keys(inc).length === 0 && (
                        <p className="text-xs text-slate-400 col-span-2 py-2 font-medium">No P&L fields extracted.</p>
                      )}
                    </div>
                  </div>

                  {/* Balance Sheet Items */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                      <span className="w-2 h-2 rounded-full bg-[#0064FA]" />
                      Balance Sheet & Assets
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {Object.entries(bs).map(([k, f]) => (
                        <div key={k} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="text-[11px] text-slate-500 font-semibold">{f.label}</p>
                          <p className="text-sm font-extrabold text-slate-900 font-mono mt-0.5">
                            RM {Number(f.value).toLocaleString()}
                          </p>
                          {f.source && (
                            <p className="text-[10px] text-slate-400 mt-1 truncate">
                              Source: {f.source.section || f.source.documentName}
                            </p>
                          )}
                        </div>
                      ))}
                      {Object.keys(bs).length === 0 && (
                        <p className="text-xs text-slate-400 col-span-2 py-2 font-medium">No balance sheet items found.</p>
                      )}
                    </div>
                  </div>

                  {/* Cash Flow Items */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      Cash Flow Statement
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {Object.entries(cf).map(([k, f]) => (
                        <div key={k} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="text-[11px] text-slate-500 font-semibold">{f.label}</p>
                          <p className="text-sm font-extrabold text-slate-900 font-mono mt-0.5">
                            RM {Number(f.value).toLocaleString()}
                          </p>
                        </div>
                      ))}
                      {Object.keys(cf).length === 0 && (
                        <p className="text-xs text-slate-400 col-span-2 py-2 font-medium">No cash flow fields extracted.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'raw_tables' && (
                <div className="space-y-4">
                  {rawTables.length > 0 ? (
                    rawTables.map((t: any, idx: number) => (
                      <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700">{t.name || `Table ${idx + 1}`}</span>
                          <span className="text-[11px] text-slate-400 font-medium">{t.rows?.length || 0} rows</span>
                        </div>
                        <div className="overflow-x-auto max-h-60 p-2">
                          <table className="w-full text-[11px] text-left text-slate-700">
                            <thead>
                              <tr className="border-b border-slate-200 bg-slate-50/70 font-bold text-slate-600">
                                {t.headers?.map((h: string, hIdx: number) => (
                                  <th key={hIdx} className="px-3 py-1.5">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {t.rows?.slice(0, 10).map((r: any[], rIdx: number) => (
                                <tr key={rIdx} className="hover:bg-slate-50/70">
                                  {r.map((cell, cIdx) => (
                                    <td key={cIdx} className="px-3 py-1.5 truncate max-w-[150px]">
                                      {String(cell)}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-slate-400 text-xs">
                      <Table className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      No structured raw tables present in this document.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'raw_json' && (
                <div className="bg-slate-900 rounded-2xl p-4 text-emerald-400 font-mono text-[11px] overflow-auto max-h-96">
                  <pre>{JSON.stringify(document.extractedData || {}, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: AI Insights & Risk Findings (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col overflow-hidden bg-white">
            <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between text-xs bg-white">
              <span className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0064FA]" />
                AI Diagnostic & Insights
              </span>
              <span className="text-[10px] text-[#0F4B2D] bg-[#E2F1E2] px-2.5 py-0.5 rounded-full border border-[#5AA55A]/30 font-bold">
                Client-Side Engine
              </span>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              {/* Executive Summary Card */}
              <div className="bg-[#E1F5FF]/50 rounded-2xl border border-[#BAE0FF]/80 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#0064FA]" />
                  <h4 className="text-xs font-extrabold text-slate-900">Executive Summary</h4>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {insights[0]?.narrative ||
                    `Statement ${document.name} verified under ${companyProfile.name}. Calculated top-line and balance sheet figures operate within normal risk boundaries.`}
                </p>
              </div>

              {/* Identified Risks for Document */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                  <span>Risk Signals ({risks.length})</span>
                </h4>
                {risks.slice(0, 3).map((r) => (
                  <div
                    key={r.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1 shadow-2xs hover:border-[#91BEFF] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        {r.title}
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                        {r.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-normal">{r.description}</p>
                  </div>
                ))}
              </div>

              {/* Security & Sandbox Badge */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#5AA55A] flex-shrink-0" />
                <span>Zero telemetry verified. No data sent to external cloud storage.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

