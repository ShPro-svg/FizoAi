import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type {
  FinancialDocument,
  FinancialMetric,
  RiskSignal,
  AIInsight,
  HealthScore,
  AuditEvent,
  WorkspaceContextType,
} from '../types';
export interface ExtendedWorkspaceContextType extends WorkspaceContextType {
  addAnalyzedBatch: (
    newDocs: FinancialDocument[],
    newMetrics: FinancialMetric[],
    newRisks: RiskSignal[],
    newHealthScore: HealthScore | null,
    newInsights: AIInsight[]
  ) => void;
}

const WorkspaceContext = createContext<ExtendedWorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<FinancialDocument[]>([]);
  const [metrics, setMetrics] = useState<FinancialMetric[]>([]);
  const [risks, setRisks] = useState<RiskSignal[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([
    {
      id: `audit-init-${Date.now()}`,
      workspaceId: 'ws-active',
      action: 'upload',
      entityType: 'workspace',
      entityId: 'ws-active',
      actor: 'Adam H.',
      metadata: { status: 'Session active', zeroKnowledge: true },
      timestamp: new Date().toISOString(),
    },
  ]);

  const addDocument = (doc: FinancialDocument) => {
    setDocuments((prev) => [doc, ...prev]);
    setAuditEvents((prev) => [
      {
        id: `audit-doc-${Date.now()}`,
        workspaceId: 'ws-active',
        action: 'upload',
        entityType: 'document',
        entityId: doc.id,
        actor: 'Adam H.',
        metadata: { filename: doc.name, size: doc.fileSize },
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const removeDocument = (id: string) => {
    const doc = documents.find((d) => d.id === id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    if (doc) {
      setAuditEvents((prev) => [
        {
          id: `audit-del-${Date.now()}`,
          workspaceId: 'ws-active',
          action: 'delete',
          entityType: 'document',
          entityId: doc.id,
          actor: 'Adam H.',
          metadata: { filename: doc.name },
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
    }
  };

  const addAnalyzedBatch = (
    newDocs: FinancialDocument[],
    newMetrics: FinancialMetric[],
    newRisks: RiskSignal[],
    newHealthScore: HealthScore | null,
    newInsights: AIInsight[]
  ) => {
    setDocuments((prev) => [...newDocs, ...prev]);
    if (newMetrics.length > 0) setMetrics(newMetrics);
    if (newRisks.length > 0) setRisks(newRisks);
    if (newHealthScore) setHealthScore(newHealthScore);
    if (newInsights.length > 0) setInsights(newInsights);

    setAuditEvents((prev) => [
      {
        id: `audit-batch-${Date.now()}`,
        workspaceId: 'ws-active',
        action: 'analyze',
        entityType: 'batch',
        entityId: `batch-${Date.now()}`,
        actor: 'Client-Side Analysis Engine',
        metadata: {
          documentsProcessed: newDocs.length,
          metricsComputed: newMetrics.length,
          risksDetected: newRisks.length,
        },
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        documents,
        metrics,
        risks,
        insights,
        healthScore,
        auditEvents,
        addDocument,
        removeDocument,
        addAnalyzedBatch,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = (): ExtendedWorkspaceContextType => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
