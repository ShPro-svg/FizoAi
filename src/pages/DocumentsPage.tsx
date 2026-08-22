import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { useWorkspace } from '../context/WorkspaceContext';
import { FileText, Trash2, ShieldCheck, Upload } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';

export const DocumentsPage: React.FC = () => {
  const { documents, removeDocument } = useWorkspace();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        subtitle="Manage and parse financial statements, invoices, and ledger exports locally."
        actionButton={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Document</span>
          </button>
        }
      />

      {documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents in workspace"
          description="Upload PDF statements, Excel ledgers, or CSV reconciliations to begin local extraction."
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Document Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#111827] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>{doc.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px] uppercase">
                    {doc.type}
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 font-mono">
                    {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                  </td>
                  <td className="py-3.5 px-4 text-blue-600 font-medium">
                    {doc.extractedData?.period || 'FY2025'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[#059669] font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{doc.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => removeDocument(doc.id)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                      title="Remove document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
