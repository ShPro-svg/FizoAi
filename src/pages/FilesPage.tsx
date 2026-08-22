import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { FolderOpen, HardDrive, Database, Lock } from 'lucide-react';

export const FilesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Files & Real Data"
        subtitle="Manage client-side raw data storage, cached tables, and memory structures."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <HardDrive className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#111827]">Session Memory</h3>
          <p className="text-xs text-gray-500 mt-1">
            Data resides in browser RAM only and is never uploaded to any remote server.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#111827]">IndexedDB Cache</h3>
          <p className="text-xs text-gray-500 mt-1">
            Fast client-side indexing for large tabular files, CSVs, and Excel sheets.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#111827]">Zero Telemetry</h3>
          <p className="text-xs text-gray-500 mt-1">
            Zero network requests containing sensitive financial line items.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 shadow-sm">
        <FolderOpen className="w-8 h-8 mx-auto text-gray-400 mb-2" />
        <h4 className="text-sm font-semibold text-[#111827]">Files & Real Data View</h4>
        <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
          Raw tabular data viewer and workbook inspection tools.
        </p>
      </div>
    </div>
  );
};
