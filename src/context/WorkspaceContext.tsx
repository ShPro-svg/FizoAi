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
import {
  getDemoDocuments,
  getDemoMetrics,
  getDemoRisks,
  getDemoInsights,
  getDemoHealthScore,
  getDemoAuditTrail,
} from '../data/demoData';

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<FinancialDocument[]>(getDemoDocuments());
  const [metrics, setMetrics] = useState<FinancialMetric[]>(getDemoMetrics());
  const [risks, setRisks] = useState<RiskSignal[]>(getDemoRisks());
  const [insights, setInsights] = useState<AIInsight[]>(getDemoInsights());
  const [healthScore, setHealthScore] = useState<HealthScore | null>(getDemoHealthScore());
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(getDemoAuditTrail());
  const [isDemo, setIsDemo] = useState<boolean>(true);

  const loadDemo = () => {
    setDocuments(getDemoDocuments());
    setMetrics(getDemoMetrics());
    setRisks(getDemoRisks());
    setInsights(getDemoInsights());
    setHealthScore(getDemoHealthScore());
    setAuditEvents(getDemoAuditTrail());
    setIsDemo(true);
  };

  const startBlank = () => {
    setDocuments([]);
    setMetrics([]);
    setRisks([]);
    setInsights([]);
    setHealthScore(null);
    setAuditEvents([
      {
        id: `audit-reset-${Date.now()}`,
        workspaceId: 'ws-active',
        action: 'delete',
        entityType: 'workspace',
        entityId: 'ws-active',
        actor: 'Adam H.',
        metadata: { reason: 'Clean slate initialization' },
        timestamp: new Date().toISOString(),
      },
    ]);
    setIsDemo(false);
  };

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

  return (
    <WorkspaceContext.Provider
      value={{
        documents,
        metrics,
        risks,
        insights,
        healthScore,
        auditEvents,
        isDemo,
        loadDemo,
        startBlank,
        addDocument,
        removeDocument,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = (): WorkspaceContextType => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
