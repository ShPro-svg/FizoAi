import React, { useState, useMemo, useEffect } from 'react';
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
  ArrowLeft,
  ShieldCheck,
  Eye,
  Trash2,
  Upload,
  Plus,
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { useWorkspace } from '../context/WorkspaceContext';
import { generateFinancialReportPDF } from '../services/pdfReportService';
import { FileInsightsModal } from '../components/modals/FileInsightsModal';
import { FolderCard } from '../components/folders/FolderCard';
import { AddFolderCard } from '../components/folders/AddFolderCard';
import { CreateFolderModal } from '../components/folders/CreateFolderModal';
import type { FinancialDocument, DocumentType, DocumentFolder } from '../types';

const STORAGE_KEY_FOLDERS = 'fizo_ai_custom_folders_v1';

const DEFAULT_FOLDERS: DocumentFolder[] = [
  {
    id: 'folder-fin',
    name: 'Financial Statements',
    description: 'P&L, Balance Sheets, & Solvency Audits',
    color: 'purple',
    createdAt: '2026-08-01T00:00:00Z',
    isSystem: true,
  },
  {
    id: 'folder-inv',
    name: 'Invoices & Billing',
    description: 'Vendor invoices, customer billings & receipts',
    color: 'blue',
    createdAt: '2026-08-01T00:00:00Z',
    isSystem: true,
  },
  {
    id: 'folder-pay',
    name: 'Payroll & HR',
    description: 'Salary registers, EPF, SOCSO & wages',
    color: 'emerald',
    createdAt: '2026-08-01T00:00:00Z',
    isSystem: true,
  },
  {
    id: 'folder-bank',
    name: 'Banking & Tax',
    description: 'Bank statements, cashflow & tax filings',
    color: 'amber',
    createdAt: '2026-08-01T00:00:00Z',
    isSystem: true,
  },
  {
    id: 'folder-warr',
    name: 'Warranties & Contracts',
    description: 'Legal agreements & service contracts',
    color: 'rose',
    createdAt: '2026-08-01T00:00:00Z',
    isSystem: true,
  },
  {
    id: 'folder-unsorted',
    name: 'Unsorted Documents',
    description: 'General raw spreadsheets & unclassified files',
    color: 'slate',
    createdAt: '2026-08-01T00:00:00Z',
    isSystem: true,
  },
];

export const FilesPage: React.FC = () => {
  const navigate = useNavigate();
  const { documents, metrics, risks, insights, companyProfile, currentUser, removeDocument } =
    useWorkspace();

  // Custom Folders State with LocalStorage persistence
  const [folders, setFolders] = useState<DocumentFolder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FOLDERS);
      return saved ? JSON.parse(saved) : DEFAULT_FOLDERS;
    } catch {
      return DEFAULT_FOLDERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FOLDERS, JSON.stringify(folders));
    } catch (e) {
      console.warn('Failed to save folders:', e);
    }
  }, [folders]);

  // Navigation: Active Folder (null = root folder grid view)
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);

  // Inspector & Document Selection State
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'tables' | 'fields' | 'json'>('tables');
  const [searchTerm, setSearchTerm] = useState('');
  const [globalSearch, setGlobalSearch] = useState('');
  const [copiedJson, setCopiedJson] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [inspectedModalDoc, setInspectedModalDoc] = useState<FinancialDocument | null>(null);

  // Helper to map document to a folder
  const mapDocToFolderId = (doc: FinancialDocument): string => {
    if (doc.folderId) return doc.folderId;
    const nameLower = doc.name.toLowerCase();
    if (
      nameLower.includes('financial') ||
      nameLower.includes('report') ||
      nameLower.includes('p&l') ||
      nameLower.includes('profit') ||
      nameLower.includes('balance_sheet')
    ) {
      return 'folder-fin';
    }
    if (nameLower.includes('invoice') || nameLower.includes('bill') || nameLower.includes('receipt')) {
      return 'folder-inv';
    }
    if (nameLower.includes('payroll') || nameLower.includes('salary') || nameLower.includes('hr')) {
      return 'folder-pay';
    }
    if (
      nameLower.includes('bank') ||
      nameLower.includes('tax') ||
      nameLower.includes('lhdn') ||
      nameLower.includes('epf')
    ) {
      return 'folder-bank';
    }
    if (nameLower.includes('warranty') || nameLower.includes('contract') || nameLower.includes('agreement')) {
      return 'folder-warr';
    }
    return 'folder-unsorted';
  };

  // Group documents by folder
  const docsByFolder = useMemo(() => {
    const map: Record<string, FinancialDocument[]> = {};
    folders.forEach((f) => {
      map[f.id] = [];
    });
    documents.forEach((doc) => {
      const folderId = mapDocToFolderId(doc);
      if (!map[folderId]) {
        map[folderId] = [];
      }
      map[folderId].push(doc);
    });
    return map;
  }, [folders, documents]);

  // Active Folder Object
  const activeFolder = folders.find((f) => f.id === activeFolderId) || null;

  // Documents inside active folder
  const currentFolderDocs = useMemo(() => {
    if (!activeFolderId) return [];
    const rawList = docsByFolder[activeFolderId] || [];
    if (!searchTerm.trim()) return rawList;
    const q = searchTerm.toLowerCase();
    return rawList.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.type.includes(q) ||
        (d.extractedData?.period || '').toLowerCase().includes(q)
    );
  }, [activeFolderId, docsByFolder, searchTerm]);

  // Active Document for Raw Data Inspector
  const activeDoc: FinancialDocument | undefined =
    documents.find((d) => d.id === selectedDocId) ||
    currentFolderDocs[0] ||
    documents[0];

  const totalSizeMB = (
    documents.reduce((acc, d) => acc + (d.fileSize || 0), 0) /
    (1024 * 1024)
  ).toFixed(2);

  const getFileIcon = (type: DocumentType) => {
    if (type === 'pdf') return <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />;
    if (type === 'xlsx') return <FileSpreadsheet className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
    if (type === 'csv') return <FileSpreadsheet className="w-5 h-5 text-blue-500 flex-shrink-0" />;
    if (type === 'json') return <FileCode className="w-5 h-5 text-purple-500 flex-shrink-0" />;
    return <ImageIcon className="w-5 h-5 text-amber-500 flex-shrink-0" />;
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

  const handleExportPDF = (docToExport?: FinancialDocument) => {
    const target = docToExport || activeDoc;
    if (!target) return;
    setIsExportingPDF(true);
    try {
      generateFinancialReportPDF({
        document: target,
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

  const handleCreateFolder = (newFolderData: Omit<DocumentFolder, 'id' | 'createdAt'>) => {
    const newFolder: DocumentFolder = {
      ...newFolderData,
      id: `folder-custom-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setFolders((prev) => [...prev, newFolder]);
  };

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

  // Raw multi-column matrix tables
  const rawTables = activeDoc?.extractedData?.rawTables || [];

  return (
    <div className="space-y-8 pb-20 text-gray-900">
      <PageHeader
        title="Files & Raw Data"
        subtitle="Explore organized 3D document folders, parsed tabular matrices, and zero-telemetry memory cache."
      />

      {/* Top Storage & Memory Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#EA580C] flex items-center justify-center border border-orange-200/80">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Active Folders</p>
            <h3 className="text-xl font-bold text-gray-900 font-mono mt-0.5">
              {folders.length}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/80">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Documents</p>
            <h3 className="text-xl font-bold text-gray-900 font-mono mt-0.5">
              {documents.length} Files
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200/80">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">In-Memory Cache</p>
            <h3 className="text-xl font-bold text-gray-900 font-mono mt-0.5">
              {totalSizeMB} MB
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/80">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Client Sandbox</p>
            <h3 className="text-sm font-bold text-emerald-700 flex items-center gap-1.5 mt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero Leakage</span>
            </h3>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: ROOT FOLDERS HUB (GRID OF 3D FOLDER CARDS + ADD NEW CARD) */}
      {/* ========================================================================= */}
      {!activeFolderId && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">Document Folders</h2>
              <p className="text-xs text-gray-500">
                Click any folder to inspect individual files and extracted tabular data
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsCreateFolderModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-300 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 text-gray-500" />
                <span>New Folder</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/documents')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Documents</span>
              </button>
            </div>
          </div>

          {/* 3D FOLDERS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* 1. Add New Folder / Upload Card (Reference Image 2) */}
            <AddFolderCard
              onClick={() => setIsCreateFolderModalOpen(true)}
              title="Add new"
              subtitle="Tap to create folder or add files"
            />

            {/* 2. List of 3D-styled Folder Cards */}
            {folders.map((folder) => {
              const folderDocs = docsByFolder[folder.id] || [];
              const folderSize = folderDocs.reduce((acc, d) => acc + (d.fileSize || 0), 0);
              const latestDate =
                folderDocs.length > 0
                  ? new Date(
                      Math.max(...folderDocs.map((d) => new Date(d.uploadedAt).getTime()))
                    ).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })
                  : undefined;

              return (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  fileCount={folderDocs.length}
                  totalSizeBytes={folderSize}
                  lastUpdated={latestDate}
                  onClick={() => {
                    setActiveFolderId(folder.id);
                    if (folderDocs.length > 0) {
                      setSelectedDocId(folderDocs[0].id);
                    }
                  }}
                />
              );
            })}
          </div>

          {/* All Ingested Files Quick Summary Table */}
          {documents.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden mt-8">
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Recent Ingested Files
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                    {documents.length}
                  </span>
                </div>

                <div className="relative w-60">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    placeholder="Search all files..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#EA580C]"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                    <tr>
                      <th className="py-3 px-4">Document</th>
                      <th className="py-3 px-4">Folder</th>
                      <th className="py-3 px-4">Format</th>
                      <th className="py-3 px-4">Period</th>
                      <th className="py-3 px-4">Size</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {documents
                      .filter((d) =>
                        globalSearch
                          ? d.name.toLowerCase().includes(globalSearch.toLowerCase())
                          : true
                      )
                      .slice(0, 8)
                      .map((doc) => {
                        const assignedFolderId = mapDocToFolderId(doc);
                        const assignedFolder = folders.find((f) => f.id === assignedFolderId);
                        return (
                          <tr key={doc.id} className="hover:bg-gray-50/70">
                            <td className="py-3 px-4 font-semibold text-gray-900">
                              <div
                                onClick={() => {
                                  setActiveFolderId(assignedFolderId);
                                  setSelectedDocId(doc.id);
                                }}
                                className="flex items-center gap-2.5 cursor-pointer hover:text-[#EA580C] transition-colors"
                              >
                                {getFileIcon(doc.type)}
                                <span className="truncate max-w-[260px]">{doc.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
                                <span>{assignedFolder?.name || 'Unsorted'}</span>
                              </span>
                            </td>
                            <td className="py-3 px-4 uppercase text-[10px] font-mono font-semibold text-gray-500">
                              {doc.type}
                            </td>
                            <td className="py-3 px-4 text-gray-600 font-mono text-[11px]">
                              {doc.extractedData?.period || 'FY2025'}
                            </td>
                            <td className="py-3 px-4 text-gray-500 font-mono text-[11px]">
                              {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setInspectedModalDoc(doc)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 text-gray-700 hover:text-[#EA580C] bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                                  title="View File Insights & Export PDF"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Insights</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: INSIDE FOLDER VIEW (DRILL-DOWN WITH BREADCRUMB & RAW DATA INSPECTOR) */}
      {/* ========================================================================= */}
      {activeFolder && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header with Back button */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveFolderId(null)}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                title="Back to all folders"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <div className="h-6 w-px bg-gray-200" />

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-gray-900">{activeFolder.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-[#EA580C] border border-orange-200">
                    {currentFolderDocs.length} {currentFolderDocs.length === 1 ? 'file' : 'files'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {activeFolder.description || 'Folder repository'}
                </p>
              </div>
            </div>

            {/* Folder Actions */}
            <div className="flex items-center gap-3">
              <div className="relative w-56">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search in folder..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <button
                type="button"
                onClick={() => navigate('/documents')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Here</span>
              </button>
            </div>
          </div>

          {/* Files Inside Folder Cards */}
          {currentFolderDocs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-xs">
              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-sm font-bold text-gray-900">This folder is empty</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-5">
                Upload financial statements or documents to populate this folder.
              </p>
              <button
                type="button"
                onClick={() => navigate('/documents')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EA580C] text-white text-xs font-semibold shadow-xs hover:bg-[#C2410C] cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Documents</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {currentFolderDocs.map((doc) => {
                const isSelected = (activeDoc?.id || '') === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#EA580C] bg-orange-50/40 ring-1 ring-[#EA580C] shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/70 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          {getFileIcon(doc.type)}
                          <h4
                            className={`text-xs font-bold truncate ${
                              isSelected ? 'text-[#EA580C]' : 'text-gray-900'
                            }`}
                          >
                            {doc.name}
                          </h4>
                        </div>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-gray-100 text-gray-600">
                          {doc.type}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500 font-mono">
                        <span>Period: {doc.extractedData?.period || 'FY2025'}</span>
                        <span>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectedModalDoc(doc);
                        }}
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>AI Insights</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExportPDF(doc);
                          }}
                          className="p-1.5 text-gray-400 hover:text-[#EA580C] hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                          title="Download Official PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeDocument(doc.id);
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Document Content Inspector */}
          {activeDoc && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden mt-6">
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
                    onClick={() => setInspectedModalDoc(activeDoc)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>Side-by-Side View</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExportPDF(activeDoc)}
                    disabled={isExportingPDF}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isExportingPDF ? 'Generating...' : 'Download PDF Report'}</span>
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
                          {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                          <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleExportJson}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-gray-500" />
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

      {/* Create Folder Modal */}
      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
        onCreateFolder={handleCreateFolder}
      />

      {/* File Insights & Side-by-Side PDF Export Modal */}
      <FileInsightsModal
        document={inspectedModalDoc}
        isOpen={Boolean(inspectedModalDoc)}
        onClose={() => setInspectedModalDoc(null)}
      />
    </div>
  );
};
