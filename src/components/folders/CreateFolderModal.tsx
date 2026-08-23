import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FolderPlus, Check } from 'lucide-react';
import type { FolderColor, DocumentFolder } from '../../types';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder: (newFolder: Omit<DocumentFolder, 'id' | 'createdAt'>) => void;
}

const COLOR_OPTIONS: { id: FolderColor; name: string; bgClass: string; borderClass: string }[] = [
  { id: 'purple', name: 'Royal Purple', bgClass: 'bg-purple-500', borderClass: 'border-purple-600' },
  { id: 'blue', name: 'Ocean Blue', bgClass: 'bg-blue-500', borderClass: 'border-blue-600' },
  { id: 'emerald', name: 'Mint Emerald', bgClass: 'bg-emerald-500', borderClass: 'border-emerald-600' },
  { id: 'amber', name: 'Warm Amber', bgClass: 'bg-amber-500', borderClass: 'border-amber-600' },
  { id: 'rose', name: 'Rose Pink', bgClass: 'bg-rose-500', borderClass: 'border-rose-600' },
  { id: 'slate', name: 'Modern Slate', bgClass: 'bg-slate-600', borderClass: 'border-slate-700' },
];

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  isOpen,
  onClose,
  onCreateFolder,
}) => {
  const [folderName, setFolderName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState<FolderColor>('purple');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    onCreateFolder({
      name: folderName.trim(),
      description: description.trim() || undefined,
      color: selectedColor,
    });

    setFolderName('');
    setDescription('');
    setSelectedColor('purple');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border border-gray-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#EA580C] flex items-center justify-center border border-orange-200">
                <FolderPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Create New Folder</h3>
                <p className="text-xs text-gray-500">Organize and group corporate financial files</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Folder Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                autoFocus
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="e.g. Audit Receipts 2026 / Tax Declarations"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EA580C]/20 focus:border-[#EA580C] text-gray-900"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Verified vendor payment receipts and SSM copies"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EA580C]/20 focus:border-[#EA580C] text-gray-900"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Folder 3D Theme Color
              </label>
              <div className="grid grid-cols-3 gap-2">
                {COLOR_OPTIONS.map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setSelectedColor(col.id)}
                    className={`p-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                      selectedColor === col.id
                        ? 'border-gray-900 bg-gray-50 ring-2 ring-gray-900/10'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full ${col.bgClass} flex-shrink-0 flex items-center justify-center`}>
                      {selectedColor === col.id && <Check className="w-2.5 h-2.5 text-white" />}
                    </span>
                    <span className="text-[11px] font-medium text-gray-800 truncate">{col.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Create Folder</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
