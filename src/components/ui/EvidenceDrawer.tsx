import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calculator, Database, Calendar, Clock, FileText } from 'lucide-react';
import type { FinancialMetric } from '../../types';
import { ConfidenceBadge } from './ConfidenceBadge';

export interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  metric?: FinancialMetric | null;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({
  isOpen,
  onClose,
  metric,
}) => {
  return (
    <AnimatePresence>
      {isOpen && metric && (
        <motion.div
          key="evidence-drawer"
          initial={{ x: 400 }}
          animate={{ x: 0 }}
          exit={{ x: 400 }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          className="fixed top-0 right-0 h-full w-[400px] max-w-full bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col pointer-events-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Calculation & Audit Trail
              </span>
              <h3 className="text-lg font-bold text-[#111827] mt-0.5 truncate">
                {metric.name || 'Metric Details'}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
            {/* Confidence & Timestamp */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Confidence:</span>
                <ConfidenceBadge tier={metric.confidence || 'verified'} />
              </div>
              {metric.calculatedAt && (
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(metric.calculatedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Formula Display */}
            {metric.formula && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-2">
                  <Calculator className="w-4 h-4 text-blue-600" />
                  <span>MATHEMATICAL FORMULA</span>
                </div>
                <div className="font-mono text-xs text-[#111827] bg-white p-3 rounded-lg border border-gray-200 overflow-x-auto">
                  {metric.formula}
                </div>
              </div>
            )}

            {/* Input Values & Sources Table */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-3">
                <Database className="w-4 h-4 text-blue-600" />
                <span>INPUT VALUES & CORROBORATING SOURCES</span>
              </div>

              {metric.inputs && metric.inputs.length > 0 ? (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">Variable</th>
                        <th className="py-2.5 px-3">Value</th>
                        <th className="py-2.5 px-3">Source Citation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {metric.inputs.map((input, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-2.5 px-3 font-medium text-[#111827]">
                            {input.label}
                          </td>
                          <td className="py-2.5 px-3 text-blue-600 font-mono font-semibold whitespace-nowrap">
                            {typeof input.value === 'number'
                              ? input.value.toLocaleString()
                              : input.value}
                          </td>
                          <td className="py-2.5 px-3 text-gray-500">
                            <div className="flex items-center gap-1 font-mono text-[11px]">
                              <FileText className="w-3 h-3 text-gray-400 flex-shrink-0" />
                              <span className="truncate max-w-[120px]" title={input.source.documentName}>
                                {input.source.documentName}
                              </span>
                            </div>
                            {(input.source.page || input.source.row || input.source.section) && (
                              <div className="text-[10px] text-gray-400 mt-0.5">
                                {input.source.page ? `Page ${input.source.page} ` : ''}
                                {input.source.row ? `Row ${input.source.row} ` : ''}
                                {input.source.section ? `(${input.source.section})` : ''}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No input data found.</p>
              )}
            </div>

            {/* Benchmark / Compared Period */}
            {metric.comparedTo && (
              <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 mb-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>BENCHMARK COMPARISON ({metric.comparedTo.period})</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-800">
                    Prior Period Value: <strong className="font-semibold">{metric.comparedTo.value}{metric.unit ? ` ${metric.unit}` : ''}</strong>
                  </span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                      metric.comparedTo.changePercent >= 0
                        ? 'bg-emerald-100 text-[#059669]'
                        : 'bg-red-100 text-[#DC2626]'
                    }`}
                  >
                    {metric.comparedTo.changePercent >= 0 ? '+' : ''}
                    {metric.comparedTo.changePercent}%
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
            <span>Deterministic client-side calculation</span>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
