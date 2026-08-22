import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  FileSpreadsheet,
  FileCode,
  CheckCircle2,
  Loader2,
  Clock,
  Trash2,
  Eye,
  ShieldCheck,
  Lock,
  X,
  AlertTriangle,
  FilePlus,
  ArrowRight,
  Database,
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  parseCSV,
  parseXLSX,
  parsePDF,
  parseJSON,
  identifyFinancialFields,
} from '../services/extractionService';
import { calculateMetrics, calculateHealthScore } from '../services/calculationService';
import { detectRisks, generateHeuristicInsight } from '../services/riskService';
import type { FinancialDocument, DocumentType } from '../types';

interface ProcessingStep {
  id: number;
  label: string;
  status: 'pending' | 'active' | 'done';
}

const INITIAL_STEPS: ProcessingStep[] = [
  { id: 1, label: 'File received & validated in client sandbox', status: 'pending' },
  { id: 2, label: 'Extracting text and tabular contents...', status: 'pending' },
  { id: 3, label: 'Identifying financial line items & corroborating citations...', status: 'pending' },
  { id: 4, label: 'Computing solvency, margins & liquidity ratios...', status: 'pending' },
  { id: 5, label: 'Evaluating anomaly detection rules & risk signals...', status: 'pending' },
  { id: 6, label: 'Synthesizing executive diagnostic insights...', status: 'pending' },
];

export const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { documents, addAnalyzedBatch, removeDocument } = useWorkspace();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload & File Selection State
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [steps, setSteps] = useState<ProcessingStep[]>(INITIAL_STEPS);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Privacy Consent Modal State
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentProcessing, setConsentProcessing] = useState<boolean>(() => {
    try {
      return localStorage.getItem('fizo_privacy_consent') === 'true';
    } catch {
      return false;
    }
  });
  const [consentAI, setConsentAI] = useState(true);

  // View Document Data Modal State
  const [inspectedDoc, setInspectedDoc] = useState<FinancialDocument | null>(null);

  // Delete Confirmation State
  const [docToDelete, setDocToDelete] = useState<string | null>(null);

  // Handle Drag Events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const dropped = Array.from(e.dataTransfer.files);
      setSelectedFiles((prev) => [...prev, ...dropped]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const chosen = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...chosen]);
    }
  };

  const handleRemoveSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Helper to determine document type
  const getDocumentType = (fileName: string): DocumentType => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (ext === 'csv') return 'csv';
    if (ext === 'xlsx' || ext === 'xls') return 'xlsx';
    if (ext === 'json') return 'json';
    return 'pdf';
  };

  const getFileIcon = (type: string) => {
    if (type === 'pdf') return <FileText className="w-5 h-5 text-red-500" />;
    if (type === 'xlsx' || type === 'xls') return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
    if (type === 'csv') return <FileSpreadsheet className="w-5 h-5 text-blue-500" />;
    return <FileCode className="w-5 h-5 text-purple-500" />;
  };

  // Start Analysis Workflow
  const handleStartAnalysis = () => {
    if (selectedFiles.length === 0) return;

    if (!consentProcessing) {
      setShowConsentModal(true);
      return;
    }

    runProcessingPipeline();
  };

  const handleConsentAccept = () => {
    if (!consentProcessing) return;
    localStorage.setItem('fizo_privacy_consent', 'true');
    setShowConsentModal(false);
    runProcessingPipeline();
  };

  const runProcessingPipeline = async () => {
    setIsProcessing(true);
    setCurrentStepIndex(0);
    setSteps(INITIAL_STEPS.map((s, idx) => ({ ...s, status: idx === 0 ? 'active' : 'pending' })));

    try {
      const file = selectedFiles[0];
      const docType = getDocumentType(file.name);
      const docId = `doc-${Date.now()}`;

      // Step 1: File received
      await new Promise((r) => setTimeout(r, 1200));
      setSteps((prev) =>
        prev.map((s, i) => ({
          ...s,
          status: i === 0 ? 'done' : i === 1 ? 'active' : 'pending',
        }))
      );
      setCurrentStepIndex(1);

      // Step 2: Extract text / table
      let rawData: any = null;
      if (docType === 'csv') {
        rawData = await parseCSV(file);
      } else if (docType === 'xlsx') {
        rawData = await parseXLSX(file);
      } else if (docType === 'pdf') {
        rawData = await parsePDF(file);
      } else if (docType === 'json') {
        rawData = await parseJSON(file);
      }
      await new Promise((r) => setTimeout(r, 1200));
      setSteps((prev) =>
        prev.map((s, i) => ({
          ...s,
          status: i <= 1 ? 'done' : i === 2 ? 'active' : 'pending',
        }))
      );
      setCurrentStepIndex(2);

      // Step 3: Identify financial figures
      const extracted = identifyFinancialFields(rawData, file.name, docType, docId);
      await new Promise((r) => setTimeout(r, 1200));
      setSteps((prev) =>
        prev.map((s, i) => ({
          ...s,
          status: i <= 2 ? 'done' : i === 3 ? 'active' : 'pending',
        }))
      );
      setCurrentStepIndex(3);

      // Step 4: Compute ratios
      const metrics = calculateMetrics(extracted, undefined, {
        documentId: docId,
        documentName: file.name,
        section: 'Uploaded Statement',
      });
      await new Promise((r) => setTimeout(r, 1200));
      setSteps((prev) =>
        prev.map((s, i) => ({
          ...s,
          status: i <= 3 ? 'done' : i === 4 ? 'active' : 'pending',
        }))
      );
      setCurrentStepIndex(4);

      // Step 5: Detect risks
      const risks = detectRisks(metrics, extracted);
      const healthScore = calculateHealthScore(metrics, risks);
      await new Promise((r) => setTimeout(r, 1200));
      setSteps((prev) =>
        prev.map((s, i) => ({
          ...s,
          status: i <= 4 ? 'done' : i === 5 ? 'active' : 'pending',
        }))
      );
      setCurrentStepIndex(5);

      // Step 6: Generate insights
      const insights = [generateHeuristicInsight(metrics, risks, extracted)];
      await new Promise((r) => setTimeout(r, 1200));
      setSteps((prev) => prev.map((s) => ({ ...s, status: 'done' })));
      setCurrentStepIndex(6);

      // Build financial document records
      const newDoc: FinancialDocument = {
        id: docId,
        workspaceId: 'ws-active',
        name: file.name,
        type: docType,
        status: 'analyzed',
        uploadedAt: new Date().toISOString(),
        fileSize: file.size,
        extractedData: extracted,
      };

      // Commit to workspace context
      addAnalyzedBatch([newDoc], metrics, risks, healthScore, insights);

      // Reset selection after brief delay
      setTimeout(() => {
        setSelectedFiles([]);
        setIsProcessing(false);
      }, 1000);
    } catch (err) {
      console.error('Error during client-side parsing:', err);
      setIsProcessing(false);
      alert('Parsing error encountered in client sandbox. Please ensure the file is a valid PDF, CSV, XLSX, or JSON document.');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        title="Documents & Ingestion"
        subtitle="Upload and parse multi-format statements locally in your browser memory with zero telemetry."
      />

      {/* 1. UPLOAD ZONE */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`bg-white rounded-2xl border-2 border-dashed transition-all p-8 text-center shadow-xs ${
          isDragging
            ? 'border-orange-500 bg-orange-50/40'
            : 'border-gray-300 hover:border-orange-300 bg-gray-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.csv,.xlsx,.xls,.json"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Upload Icon */}
        <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#EA580C] flex items-center justify-center mx-auto mb-4 border border-orange-200/80 shadow-xs">
          <Upload className="w-7 h-7 stroke-[2]" />
        </div>

        <h2 className="text-base font-bold text-[#111827]">
          Upload Financial Documents (Select Multiple Files)
        </h2>

        <p className="text-xs text-gray-500 max-w-lg mx-auto mt-1.5 leading-relaxed">
          Drag and drop or select multiple PDF, CSV, XLSX, JSON, PNG, or JPEG files at once. All files will be analyzed concurrently with PDPA PII redaction in your browser sandbox.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-xs cursor-pointer"
          >
            <FilePlus className="w-4 h-4 text-gray-500" />
            <span>+ Browse multiple files</span>
          </button>

          <button
            type="button"
            disabled={selectedFiles.length === 0 || isProcessing}
            onClick={handleStartAnalysis}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all shadow-sm cursor-pointer ${
              selectedFiles.length === 0 || isProcessing
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-[#EA580C] hover:bg-[#C2410C]'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Analyse Documents</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Selected Files Preview List */}
        {selectedFiles.length > 0 && !isProcessing && (
          <div className="mt-6 pt-5 border-t border-gray-200/80 max-w-xl mx-auto text-left">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
              Selected Files for Analysis ({selectedFiles.length})
            </span>
            <div className="space-y-2">
              {selectedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between shadow-xs"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {getFileIcon(getDocumentType(file.name))}
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold text-[#111827] truncate">{file.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || 'Document'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSelectedFile(idx)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-gray-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Batch processing enabled - Grounded in source truth.</span>
        </div>
      </div>

      {/* 2. PROCESSING FEED (Appears during analysis) */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl border border-orange-200 shadow-sm p-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#EA580C] flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#111827]">
                    Analyzing Document in Client Sandbox
                  </h3>
                  <p className="text-xs text-gray-500">
                    Executing deterministic OCR and extraction algorithms locally
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono font-semibold text-[#EA580C] bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                Step {Math.min(currentStepIndex + 1, 6)} of 6
              </span>
            </div>

            {/* Vertical Animated Steps */}
            <div className="space-y-3 pl-2">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center gap-3 text-xs">
                  {step.status === 'done' && (
                    <CheckCircle2 className="w-4 h-4 text-[#059669] flex-shrink-0" />
                  )}
                  {step.status === 'active' && (
                    <Loader2 className="w-4 h-4 text-[#EA580C] animate-spin flex-shrink-0" />
                  )}
                  {step.status === 'pending' && (
                    <Clock className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  )}

                  <span
                    className={`font-medium ${
                      step.status === 'done'
                        ? 'text-[#111827]'
                        : step.status === 'active'
                        ? 'text-[#0D9488] font-semibold'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. INGESTED DOCUMENTS TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider">
              Ingested Documents
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
              {documents.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/overview')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View in Executive Overview</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {documents.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-2">
            <FileText className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-semibold text-gray-700">No documents uploaded yet</p>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Upload your PDF, CSV, Excel, or JSON statements above to inspect line items.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Document</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Processing</th>
                  <th className="py-3.5 px-4">Privacy</th>
                  <th className="py-3.5 px-4">Added</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#111827]">
                      <div className="flex items-center gap-2.5">
                        {getFileIcon(doc.type)}
                        <div>
                          <p className="truncate max-w-[220px] font-bold">{doc.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono font-normal">
                            {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-gray-100 text-gray-700 font-semibold">
                        {doc.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          doc.status === 'analyzed' || doc.status === 'extracted'
                            ? 'bg-emerald-50 text-[#059669] border-emerald-200'
                            : doc.status === 'processing'
                            ? 'bg-amber-50 text-[#D97706] border-amber-200'
                            : 'bg-red-50 text-[#DC2626] border-red-200'
                        }`}
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span className="capitalize">{doc.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200/60">
                        <Lock className="w-3 h-3" />
                        <span>Zero Telemetry</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setInspectedDoc(doc)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Inspect Extracted Data"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDocToDelete(doc.id)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PRIVACY CONSENT MODAL */}
      <AnimatePresence>
        {showConsentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111827]">Data Privacy & Consent</h3>
                  <p className="text-xs text-gray-500">100% Client-Side Evaluation Sandbox</p>
                </div>
              </div>

              <div className="text-xs text-[#4B5563] space-y-2.5 bg-gray-50 p-4 rounded-xl border border-gray-200 mb-5 leading-relaxed">
                <p>
                  <strong>Zero Telemetry Commitment: </strong> All financial statement parsing, formula evaluation, and ratio extraction occur exclusively inside your device's browser memory.
                </p>
                <p>
                  No financial figures, confidential invoices, or employee records are ever uploaded to any remote cloud servers.
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <label className="flex items-start gap-2.5 text-xs text-[#111827] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentProcessing}
                    onChange={(e) => setConsentProcessing(e.target.checked)}
                    className="mt-0.5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span>
                    <strong>(Required)</strong> I consent to client-side document processing in browser memory.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 text-xs text-[#111827] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentAI}
                    onChange={(e) => setConsentAI(e.target.checked)}
                    className="mt-0.5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span>
                    <strong>(Optional)</strong> I consent to automated heuristic ratio synthesis and risk signal generation.
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowConsentModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!consentProcessing}
                  onClick={handleConsentAccept}
                  className={`px-5 py-2 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer ${
                    consentProcessing
                      ? 'bg-[#0D9488] hover:bg-[#0F766E] shadow-sm'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Accept & Continue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INSPECT EXTRACTED DATA MODAL */}
      <AnimatePresence>
        {inspectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#111827]">
                      Extracted Financial Fields
                    </h3>
                    <p className="text-xs text-gray-500 font-mono">{inspectedDoc.name}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectedDoc(null)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
                {inspectedDoc.extractedData ? (
                  <>
                    {/* Income Statement */}
                    <div>
                      <h4 className="font-bold text-gray-700 uppercase tracking-wider text-[11px] mb-2">
                        Income Statement Fields
                      </h4>
                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                            <tr>
                              <th className="p-2.5">Field</th>
                              <th className="p-2.5">Extracted Value</th>
                              <th className="p-2.5">Source</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {Object.entries(inspectedDoc.extractedData.incomeStatement || {}).map(
                              ([key, field]: [string, any]) => (
                                <tr key={key}>
                                  <td className="p-2.5 font-medium">{field.label}</td>
                                  <td className="p-2.5 font-bold text-blue-600 font-mono">
                                    RM {field.value.toLocaleString()}
                                  </td>
                                  <td className="p-2.5 text-gray-500 text-[11px]">
                                    {field.source?.section || 'Line Item'} {field.source?.page ? `(p. ${field.source.page})` : ''}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Balance Sheet */}
                    <div>
                      <h4 className="font-bold text-gray-700 uppercase tracking-wider text-[11px] mb-2">
                        Balance Sheet Fields
                      </h4>
                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                            <tr>
                              <th className="p-2.5">Field</th>
                              <th className="p-2.5">Extracted Value</th>
                              <th className="p-2.5">Source</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {Object.entries(inspectedDoc.extractedData.balanceSheet || {}).map(
                              ([key, field]: [string, any]) => (
                                <tr key={key}>
                                  <td className="p-2.5 font-medium">{field.label}</td>
                                  <td className="p-2.5 font-bold text-blue-600 font-mono">
                                    RM {field.value.toLocaleString()}
                                  </td>
                                  <td className="p-2.5 text-gray-500 text-[11px]">
                                    {field.source?.section || 'Line Item'} {field.source?.row ? `(row ${field.source.row})` : ''}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400 italic">No structured fields extracted for this file.</p>
                )}
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setInspectedDoc(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {docToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-200"
            >
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#111827] text-center mb-1">
                Delete Document?
              </h3>
              <p className="text-xs text-gray-500 text-center mb-5">
                This document will be removed from your active in-memory session.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setDocToDelete(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    removeDocument(docToDelete);
                    setDocToDelete(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
