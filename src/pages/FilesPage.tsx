import React, { useState } from 'react';
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
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { useWorkspace } from '../context/WorkspaceContext';
import type { FinancialDocument, DocumentType } from '../types';

export const FilesPage: React.FC = () => {
  const navigate = useNavigate();
  const { documents } = useWorkspace();

  const [selectedDocId, setSelectedDocId] = useState<string>(
    documents[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'tables' | 'fields' | 'json'>('tables');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedJson, setCopiedJson] = useState(false);

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

  // Extract all tabular data from active document
  const rawTables = activeDoc?.extractedData?.rawTables || [];

  // Flattened extracted fields for tabular viewing if rawTables is empty
  const getExtractedFieldRows = () => {
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
  };

  const fieldRows = getExtractedFieldRows();

  const filteredFieldRows = fieldRows.filter(
    (row) =>
      row.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(row.value).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        title="Files & Real Data"
        subtitle="Manage client-side raw data storage, cached workbooks, and deterministic extraction memory."
      />

      {/* Storage Architecture Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Session Memory
            </span>
            <h3 className="text-base font-bold text-[#111827]">
              {documents.length} File{documents.length !== 1 ? 's' : ''} In-Memory
            </h3>
            <p className="text-xs text-gray-500 mt-1 leading-snug">
              Encrypted in local browser RAM memory with zero server telemetry.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Indexed Cache
            </span>
            <h3 className="text-base font-bold text-[#111827]">
              {totalSizeMB} MB Active Data
            </h3>
            <p className="text-xs text-gray-500 mt-1 leading-snug">
              Fast local indexing for large CSV, Excel workbooks & statements.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 border border-purple-100">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Privacy & Integrity
            </span>
            <h3 className="text-base font-bold text-[#111827]">
              Zero Telemetry
            </h3>
            <p className="text-xs text-gray-500 mt-1 leading-snug">
              PDPA 2010 compliant sandbox. Raw line items stay on device.
            </p>
          </div>
        </div>
      </div>

      {documents.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#EA580C] flex items-center justify-center mx-auto mb-4 border border-orange-200/80">
            <FolderOpen className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#111827]">
            No Uploaded Documents in Active Memory
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto mt-1.5 leading-relaxed">
            Upload your company's P&L, Balance Sheet, or invoices in the Documents page to inspect raw tabular structures and data matrices here.
          </p>
          <button
            type="button"
            onClick={() => navigate('/documents')}
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
          >
            <span>Upload Documents</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Active Document Explorer */
        <div className="space-y-6">
          {/* Document Selector Pills */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-gray-500" />
                <span>Uploaded Documents ({documents.length})</span>
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Click a document to inspect raw tabular memory
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {documents.map((doc) => {
                const isSelected = (activeDoc?.id || '') === doc.id;
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-[#EA580C] bg-orange-50/40 ring-2 ring-orange-500/20 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 bg-white'
                    }`}
                  >
                    <div className="mt-0.5">{getFileIcon(doc.type)}</div>
                    <div className="overflow-hidden flex-1">
                      <h4
                        className={`text-xs font-bold truncate ${
                          isSelected ? 'text-[#EA580C]' : 'text-[#111827]'
                        }`}
                      >
                        {doc.name}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                        {(doc.fileSize / 1024 / 1024).toFixed(2)} MB •{' '}
                        {new Date(doc.uploadedAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Document Content Inspector */}
          {activeDoc && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Inspector Header */}
              <div className="p-5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200">
                    {getFileIcon(activeDoc.type)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                      <span>{activeDoc.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {activeDoc.status.toUpperCase()}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-400">
                      Format: {activeDoc.type.toUpperCase()} • ID: {activeDoc.id}
                    </p>
                  </div>
                </div>

                {/* View Mode Tabs */}
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 border border-gray-200 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setActiveTab('tables')}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeTab === 'tables'
                          ? 'bg-white text-[#111827] shadow-xs'
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
                          ? 'bg-white text-[#111827] shadow-xs'
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
                          ? 'bg-white text-[#111827] shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5 text-purple-600" />
                      <span>JSON Structure</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors cursor-pointer"
                    title="Export JSON Data"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Inspector Content */}
              <div className="p-6">
                {/* 1. TABULAR VIEW */}
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
                              {tbl.headers && (
                                <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-semibold">
                                  <tr>
                                    {tbl.headers.map((h: string, hIdx: number) => (
                                      <th key={hIdx} className="py-2.5 px-4">
                                        {h}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                              )}
                              <tbody className="divide-y divide-gray-100 text-gray-800">
                                {tbl.rows?.map((row: any[], rIdx: number) => (
                                  <tr key={rIdx} className="hover:bg-gray-50/60">
                                    {row.map((cell: any, cIdx: number) => (
                                      <td key={cIdx} className="py-2 px-4 whitespace-nowrap">
                                        {String(cell ?? '-')}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))
                    ) : fieldRows.length > 0 ? (
                      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                        <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between gap-4">
                          <div className="relative flex-1 max-w-sm">
                            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                            <input
                              type="text"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              placeholder="Search extracted fields & figures..."
                              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                            />
                          </div>
                          <span className="text-xs text-gray-500 font-medium">
                            Showing {filteredFieldRows.length} of {fieldRows.length} fields
                          </span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                              <tr>
                                <th className="py-2.5 px-4">Section / Category</th>
                                <th className="py-2.5 px-4">Financial Line Item</th>
                                <th className="py-2.5 px-4">Extracted Value</th>
                                <th className="py-2.5 px-4">Confidence</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {filteredFieldRows.map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-gray-50/60">
                                  <td className="py-2.5 px-4 font-semibold text-gray-600">
                                    {row.section}
                                  </td>
                                  <td className="py-2.5 px-4 text-[#111827] font-medium">
                                    {row.field}
                                  </td>
                                  <td className="py-2.5 px-4 font-mono font-semibold text-blue-700">
                                    {row.value}
                                  </td>
                                  <td className="py-2.5 px-4">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      <ShieldCheck className="w-3 h-3" />
                                      <span>{row.confidence.toUpperCase()}</span>
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-400 text-xs">
                        No tabular data detected in this document.
                      </div>
                    )}
                  </div>
                )}

                {/* 2. EXTRACTED FIELDS VIEW */}
                {activeTab === 'fields' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fieldRows.map((row, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 flex items-center justify-between"
                      >
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                            {row.section}
                          </span>
                          <h4 className="text-xs font-semibold text-[#111827] mt-0.5">
                            {row.field}
                          </h4>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-blue-700 block">
                            {row.value}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-semibold">
                            {row.confidence}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. JSON STRUCTURE VIEW */}
                {activeTab === 'json' && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={handleCopyJson}
                      className="absolute top-3 right-3 px-3 py-1.5 bg-white/90 backdrop-blur-xs hover:bg-white text-gray-700 text-xs font-semibold rounded-lg border border-gray-300 shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      {copiedJson ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-gray-500" />
                          <span>Copy JSON</span>
                        </>
                      )}
                    </button>
                    <pre className="bg-gray-900 text-gray-100 p-5 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed max-h-[500px]">
                      {JSON.stringify(activeDoc.extractedData || {}, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
