import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderOpen,
  HardDrive,
  Database,
  Lock,
  FileText,
  FileSpreadsheet,
  FileCode,
  Image as ImageIcon,
  Table,
  Code2,
  ListTree,
  Search,
  Download,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Layers,
  Eye,
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { useWorkspace } from '../context/WorkspaceContext';
import { generateFinancialReportPDF } from '../services/pdfReportService';
import { FileInsightsModal } from '../components/modals/FileInsightsModal';
import type { FinancialDocument, DocumentType } from '../types';

export const FilesPage: React.FC = () => {
  const navigate = useNavigate();
  const { documents, metrics, risks, insights, companyProfile, currentUser } = useWorkspace();

  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'tables' | 'fields' | 'json'>('tables');
  const [searchTerm, setSearchTerm] = useState('');
  const [docSearch, setDocSearch] = useState('');
  const [copiedJson, setCopiedJson] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isInsightsModalOpen, setIsInsightsModalOpen] = useState(false);

  // Active Document
  const activeDoc: FinancialDocument | undefined =
    documents.find((d) => d.id === selectedDocId) || documents[0];

  const totalSizeMB = (
    documents.reduce((acc, d) => acc + (d.fileSize || 0), 0) /
    (1024 * 1024)
  ).toFixed(2);

  const getFileIcon = (type: DocumentType) => {
    if (type === 'pdf') return <FileText className="w-5 h-5 text-red-500" />;
    if (type === 'xlsx') return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
    if (type === 'csv') return <FileSpreadsheet className="w-5 h-5 text-blue-500" />;
    if (type === 'json') return <FileCode className="w-5 h-5 text-purple-500" />;
    return <ImageIcon className="w-5 h-5 text-amber-500" />;
  };

  const handleCopyJson = () => {
    if (!activeDoc) return;
    navigator.clipboard.writeText(
      JSON.stringify(activeDoc.extractedData || {}, null, 2)
    );
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleExportJson = () => {
    if (!activeDoc) return;
    const blob = new Blob(
      [JSON.stringify(activeDoc.extractedData || {}, null, 2)],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeDoc.name.replace(/\.[^/.]+$/, '')}_raw_data.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    if (!activeDoc) return;
    setIsExportingPDF(true);
    try {
      generateFinancialReportPDF({
        document: activeDoc,
        metrics,
        risks,
        insights,
        companyProfile,
        operatorName: currentUser?.name || 'Adam H. (Analyst)',
      });
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setTimeout(() => setIsExportingPDF(false), 800);
    }
  };

  // Extract all tabular data from active document
  const rawTables = activeDoc?.extractedData?.rawTables || [];

  // Flattened extracted fields for tabular viewing
  const fieldRows = useMemo(() => {
    if (!activeDoc?.extractedData) return [];
    const rows: { section: string; field: string; value: string | number; confidence: string }[] = [];

    const appendSection = (sectionName: string, dataObj?: Record<string, any>) => {
      if (!dataObj) return;
      Object.entries(dataObj).forEach(([fieldKey, val]) => {
        if (val && typeof val === 'object') {
          rows.push({
            section: sectionName,
            field: val.label || fieldKey,
            value: typeof val.value === 'number' ? `RM ${val.value.toLocaleString()}` : String(val.value ?? '-'),
            confidence: val.confidence || 'verified',
          });
        } else if (val !== undefined && val !== null) {
          rows.push({
            section: sectionName,
            field: fieldKey,
            value: typeof val === 'number' ? `RM ${val.toLocaleString()}` : String(val),
            confidence: 'verified',
          });
        }
      });
    };

    appendSection('Income Statement', activeDoc.extractedData.incomeStatement);
    appendSection('Balance Sheet', activeDoc.extractedData.balanceSheet);
    appendSection('Cash Flow Statement', activeDoc.extractedData.cashFlow);

    return rows;
  }, [activeDoc]);

  const filteredFieldRows = useMemo(() => {
    if (!searchTerm.trim()) return fieldRows;
    const q = searchTerm.toLowerCase();
    return fieldRows.filter(
      (row) =>
        row.field.toLowerCase().includes(q) ||
        row.section.toLowerCase().includes(q) ||
        String(row.value).toLowerCase().includes(q)
    );
  }, [fieldRows, searchTerm]);

  // Filtered documents list for selector
  const filteredDocs = useMemo(() => {
    if (!docSearch.trim()) return documents;
    const q = docSearch.toLowerCase();
    return documents.filter((d) => d.name.toLowerCase().includes(q) || d.type.includes(q));
  }, [documents, docSearch]);

  return (
    <div className="space-y-8 pb-20 text-gray-900">
      <PageHeader
        title="Files & Raw Data"
        subtitle="Direct inspection of in-memory parsed tables, structured financial matrices, and zero-telemetry raw JSON."
      />

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#EA580C] flex items-center justify-center border border-orange-200/80">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Active Ingested Files</p>
            <h3 className="text-xl font-bold text-gray-900 font-mono mt-0.5">
              {documents.length}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/80">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Memory Cache Footprint</p>
            <h3 className="text-xl font-bold text-gray-900 font-mono mt-0.5">
              {totalSizeMB} MB
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200/80">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Structured Matrices</p>
            <h3 className="text-xl font-bold text-gray-900 font-mono mt-0.5">
              {documents.reduce((acc, d) => acc + (d.extractedData?.rawTables?.length || 0), 0)} Tables
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/80">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Sandbox Telemetry</p>
            <h3 className="text-sm font-bold text-emerald-700 flex items-center gap-1.5 mt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero Leakage</span>
            </h3>
          </div>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-xs">
          <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <h3 className="text-base font-bold text-gray-900">No Raw Data Available</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-5">
            Upload financial statements in the Documents page or load the demo workspace to inspect in-memory data structures.
          </p>
          <button
            type="button"
            onClick={() => navigate('/documents')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span>Go to Documents</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Document Selector Pills & Filter */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>Uploaded Documents ({documents.length})</span>
              </span>

              <div className="relative w-full sm:w-56">
                <Search className="w-3 h-3 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={docSearch}
                  onChange={(e) => setDocSearch(e.target.value)}
                  placeholder="Filter documents..."
                  className="w-full pl-7 pr-3 py-1 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-[#EA580C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto pr-1">
              {filteredDocs.map((doc) => {
                const isSelected = (activeDoc?.id || '') === doc.id;
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'border-[#EA580C] bg-orange-50/50 ring-1 ring-[#EA580C] shadow-2xs'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/70 bg-white'
                    }`}
                  >
                    <div className="mt-0.5">{getFileIcon(doc.type)}</div>
                    <div className="overflow-hidden flex-1">
                      <h4
                        className={`text-xs font-bold truncate ${
                          isSelected ? 'text-[#EA580C]' : 'text-gray-900'
                        }`}
                      >
                        {doc.name}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                        {(doc.fileSize / 1024 / 1024).toFixed(2)} MB • {doc.extractedData?.period || 'FY2025'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Document Content Inspector */}
          {activeDoc && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              {/* Inspector Header */}
              <div className="p-5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#EA580C] flex items-center justify-center border border-orange-200">
                    {getFileIcon(activeDoc.type)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <span>{activeDoc.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {activeDoc.status.toUpperCase()}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500">
                      Period: {activeDoc.extractedData?.period || 'FY2025'} • ID: {activeDoc.id}
                    </p>
                  </div>
                </div>

                {/* View Tabs & Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 border border-gray-200 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setActiveTab('tables')}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeTab === 'tables'
                          ? 'bg-white text-gray-900 shadow-2xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Table className="w-3.5 h-3.5 text-blue-600" />
                      <span>Tabular View</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('fields')}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeTab === 'fields'
                          ? 'bg-white text-gray-900 shadow-2xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <ListTree className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Extracted Fields</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('json')}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeTab === 'json'
                          ? 'bg-white text-gray-900 shadow-2xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5 text-purple-600" />
                      <span>JSON Structure</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsInsightsModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>Side-by-Side View</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportPDF}
                    disabled={isExportingPDF}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isExportingPDF ? 'Generating PDF...' : 'Download Official PDF'}</span>
                  </button>
                </div>
              </div>

              {/* Inspector Content Body */}
              <div className="p-6">
                {activeTab === 'tables' && (
                  <div className="space-y-4">
                    {rawTables.length > 0 ? (
                      rawTables.map((tbl: any, tblIdx: number) => (
                        <div
                          key={tblIdx}
                          className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs"
                        >
                          <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 flex items-center justify-between text-xs font-semibold text-gray-700">
                            <span>
                              Table {tblIdx + 1}: {tbl.name || 'Extracted Matrix'} (
                              {tbl.rows?.length || 0} rows)
                            </span>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse font-mono">
                              <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                  {tbl.headers?.map((h: string, hIdx: number) => (
                                    <th key={hIdx} className="py-2.5 px-4 font-bold text-gray-600">
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {tbl.rows?.map((row: any[], rIdx: number) => (
                                  <tr key={rIdx} className="hover:bg-gray-50/70">
                                    {row.map((cell: any, cIdx: number) => (
                                      <td key={cIdx} className="py-2 px-4 whitespace-nowrap">
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
                      <div className="text-center py-12 text-gray-400 text-xs">
                        <Table className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                        <p>No multi-column tabular matrices detected. Switch to "Extracted Fields" to inspect line items.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'fields' && (
                  <div className="space-y-4">
                    <div className="relative max-w-sm">
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search extracted fields & values..."
                        className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-[#EA580C]"
                      />
                    </div>

                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                          <tr>
                            <th className="py-2.5 px-4">Financial Section</th>
                            <th className="py-2.5 px-4">Identified Metric</th>
                            <th className="py-2.5 px-4">Computed Value</th>
                            <th className="py-2.5 px-4 text-right">Verification Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredFieldRows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/70">
                              <td className="py-2.5 px-4 font-semibold text-gray-700">
                                {row.section}
                              </td>
                              <td className="py-2.5 px-4 text-gray-900 font-medium">{row.field}</td>
                              <td className="py-2.5 px-4 font-mono font-bold text-gray-900">
                                {row.value}
                              </td>
                              <td className="py-2.5 px-4 text-right">
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                  <Check className="w-3 h-3" />
                                  <span>{row.confidence}</span>
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'json' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-mono">
                        Schema: ExtractedData JSON Tree
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCopyJson}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleExportJson}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download JSON</span>
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-950 text-emerald-400 p-4 rounded-xl font-mono text-[11px] overflow-auto max-h-96">
                      <pre>{JSON.stringify(activeDoc.extractedData || {}, null, 2)}</pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Integrated File Insights Modal */}
      <FileInsightsModal
        document={activeDoc || null}
        isOpen={isInsightsModalOpen}
        onClose={() => setIsInsightsModalOpen(false)}
      />
    </div>
  );
};
