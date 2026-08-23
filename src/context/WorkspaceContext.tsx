import React, { createContext, useContext, useState, useEffect } from 'react';
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
import { supabase } from '../services/supabaseClient';

export interface ExtendedWorkspaceContextType extends WorkspaceContextType {
  addAnalyzedBatch: (
    newDocs: FinancialDocument[],
    newMetrics: FinancialMetric[],
    newRisks: RiskSignal[],
    newHealthScore: HealthScore | null,
    newInsights: AIInsight[]
  ) => void;
  clearWorkspace: () => void;
}

const STORAGE_PREFIX = 'fizo_ai_workspace_v1';

const WorkspaceContext = createContext<ExtendedWorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state with LocalStorage persistence
  const [companyProfile, setCompanyProfile] = useState<import('../types').CompanyProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}_company`);
      return saved
        ? JSON.parse(saved)
        : {
            name: 'Warisan Delights Sdn Bhd',
            registrationNo: '201801023456 (1284482-W)',
            industry: 'Food & Beverage / Restaurant Chain',
            currency: 'MYR',
          };
    } catch {
      return {
        name: 'Warisan Delights Sdn Bhd',
        registrationNo: '201801023456 (1284482-W)',
        industry: 'Food & Beverage / Restaurant Chain',
        currency: 'MYR',
      };
    }
  });

  const [documents, setDocuments] = useState<FinancialDocument[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}_docs`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [metrics, setMetrics] = useState<FinancialMetric[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}_metrics`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [risks, setRisks] = useState<RiskSignal[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}_risks`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [insights, setInsights] = useState<AIInsight[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}_insights`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [healthScore, setHealthScore] = useState<HealthScore | null>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}_health`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}_audit`);
      return saved
        ? JSON.parse(saved)
        : [
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
          ];
    } catch {
      return [];
    }
  });

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}_company`, JSON.stringify(companyProfile));
    } catch (e) {
      console.warn('LocalStorage save failed for company:', e);
    }
  }, [companyProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}_docs`, JSON.stringify(documents));
    } catch (e) {
      console.warn('LocalStorage save failed for docs:', e);
    }
  }, [documents]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}_metrics`, JSON.stringify(metrics));
    } catch (e) {
      console.warn('LocalStorage save failed for metrics:', e);
    }
  }, [metrics]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}_risks`, JSON.stringify(risks));
    } catch (e) {
      console.warn('LocalStorage save failed for risks:', e);
    }
  }, [risks]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}_insights`, JSON.stringify(insights));
    } catch (e) {
      console.warn('LocalStorage save failed for insights:', e);
    }
  }, [insights]);

  useEffect(() => {
    try {
      if (healthScore) {
        localStorage.setItem(`${STORAGE_PREFIX}_health`, JSON.stringify(healthScore));
      } else {
        localStorage.removeItem(`${STORAGE_PREFIX}_health`);
      }
    } catch (e) {
      console.warn('LocalStorage save failed for health:', e);
    }
  }, [healthScore]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}_audit`, JSON.stringify(auditEvents));
    } catch (e) {
      console.warn('LocalStorage save failed for audit:', e);
    }
  }, [auditEvents]);

  const addDocument = (doc: FinancialDocument) => {
    setDocuments((prev) => [doc, ...prev]);
    const event: AuditEvent = {
      id: `audit-doc-${Date.now()}`,
      workspaceId: 'ws-active',
      action: 'upload',
      entityType: 'document',
      entityId: doc.id,
      actor: 'Adam H.',
      metadata: { filename: doc.name, size: doc.fileSize },
      timestamp: new Date().toISOString(),
    };
    setAuditEvents((prev) => [event, ...prev]);

    // Optional background Supabase audit record
    try {
      Promise.resolve(
        supabase.from('audit_logs').insert([
          {
            workspace_id: 'ws-active',
            action: 'upload',
            entity_type: 'document',
            entity_id: doc.id,
            actor: 'Adam H.',
            metadata: { filename: doc.name, size: doc.fileSize },
          },
        ])
      ).catch(() => {});
    } catch {
      // Non-blocking fallback
    }
  };

  const removeDocument = (id: string) => {
    const doc = documents.find((d) => d.id === id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    if (doc) {
      const event: AuditEvent = {
        id: `audit-del-${Date.now()}`,
        workspaceId: 'ws-active',
        action: 'delete',
        entityType: 'document',
        entityId: doc.id,
        actor: 'Adam H.',
        metadata: { filename: doc.name },
        timestamp: new Date().toISOString(),
      };
      setAuditEvents((prev) => [event, ...prev]);
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

    const event: AuditEvent = {
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
    };

    setAuditEvents((prev) => [event, ...prev]);

    // Optional Supabase logging
    try {
      Promise.resolve(
        supabase.from('audit_logs').insert([
          {
            workspace_id: 'ws-active',
            action: 'analyze',
            entity_type: 'batch',
            entity_id: event.entityId,
            actor: 'Client-Side Analysis Engine',
            metadata: event.metadata,
          },
        ])
      ).catch(() => {});
    } catch {
      // Non-blocking fallback
    }
  };

  const updateCompanyProfile = (profile: Partial<import('../types').CompanyProfile>) => {
    setCompanyProfile((prev) => ({ ...prev, ...profile }));
  };

  const clearWorkspace = () => {
    setDocuments([]);
    setMetrics([]);
    setRisks([]);
    setInsights([]);
    setHealthScore(null);
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}_docs`);
      localStorage.removeItem(`${STORAGE_PREFIX}_metrics`);
      localStorage.removeItem(`${STORAGE_PREFIX}_risks`);
      localStorage.removeItem(`${STORAGE_PREFIX}_insights`);
      localStorage.removeItem(`${STORAGE_PREFIX}_health`);
    } catch {
      // ignore
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        companyProfile,
        updateCompanyProfile,
        documents,
        metrics,
        risks,
        insights,
        healthScore,
        auditEvents,
        addDocument,
        removeDocument,
        addAnalyzedBatch,
        clearWorkspace,
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
