export type ConfidenceTier = 'verified' | 'inferred' | 'flagged';
export type DocumentStatus = 'uploaded' | 'processing' | 'extracted' | 'analyzed' | 'error';
export type DocumentType = 'pdf' | 'csv' | 'xlsx' | 'json' | 'image' | 'png' | 'jpg' | 'jpeg';
export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';
export type RiskStatus = 'open' | 'reviewed' | 'resolved';
export type InsightSource = 'manual' | 'rule-based' | 'ai-generated';
export type AuditAction =
  | 'upload'
  | 'consent'
  | 'extract'
  | 'analyze'
  | 'view'
  | 'edit'
  | 'export'
  | 'delete'
  | 'ai_query';

export interface DataSource {
  documentId: string;
  documentName: string;
  page?: number;
  row?: number;
  section?: string;
}

export interface ExtractedField {
  label: string;
  value: number;
  rawText: string;
  source: DataSource;
  confidence: ConfidenceTier;
}

export interface ExtractedData {
  period?: string;
  incomeStatement?: Record<string, ExtractedField>;
  balanceSheet?: Record<string, ExtractedField>;
  cashFlow?: Record<string, ExtractedField>;
  [key: string]: any;
}

export type FolderColor = 'purple' | 'blue' | 'emerald' | 'amber' | 'rose' | 'slate';

export interface DocumentFolder {
  id: string;
  name: string;
  description?: string;
  color: FolderColor;
  icon?: string;
  createdAt: string;
  isSystem?: boolean;
}

export interface FinancialDocument {
  id: string;
  workspaceId: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  uploadedAt: string;
  fileSize: number;
  extractedData?: ExtractedData;
  folderId?: string;
  category?: string;
}

export interface MetricInput {
  label: string;
  value: number | string;
  source: DataSource;
}

export interface MetricComparison {
  value: number;
  period: string;
  changePercent: number;
}

export interface FinancialMetric {
  id: string;
  name: string;
  value: number;
  unit?: string;
  formula: string;
  inputs: MetricInput[];
  comparedTo?: MetricComparison;
  confidence: ConfidenceTier;
  calculatedAt: string;
}

export interface RiskSignal {
  id: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  status: RiskStatus;
  category: string;
  rule: string;
  threshold: string | number;
  currentValue: string | number;
  comparedValue: string | number;
  deviation: string;
  evidence: DataSource[];
  detectedAt: string;
}

export interface AIInsight {
  id: string;
  title: string;
  narrative: string;
  source: InsightSource;
  confidence: ConfidenceTier;
  evidence: DataSource[];
  limitations: string;
  generatedAt: string;
}

export interface HealthScoreComponents {
  profitability: number; // 0-25
  liquidity: number;     // 0-25
  efficiency: number;    // 0-25
  riskLevel: number;     // 0-25
}

export interface HealthScore {
  score: number; // 0-100
  components: HealthScoreComponents;
  formula: string;
  calculatedAt: string;
  sourceDocuments: string[];
}

export interface AuditEvent {
  id: string;
  workspaceId: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  actor: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface CompanyProfile {
  name: string;
  registrationNo?: string;
  industry?: string;
  currency?: string;
}

export interface SessionUser {
  id: string;
  name: string;
  role: string;
  email?: string;
}

export interface WorkspaceContextType {
  currentUser: SessionUser;
  updateCurrentUser: (user: Partial<SessionUser>) => void;
  companyProfile: CompanyProfile;
  updateCompanyProfile: (profile: Partial<CompanyProfile>) => void;
  documents: FinancialDocument[];
  metrics: FinancialMetric[];
  risks: RiskSignal[];
  insights: AIInsight[];
  healthScore: HealthScore | null;
  auditEvents: AuditEvent[];
  addDocument: (doc: FinancialDocument) => void;
  removeDocument: (id: string) => void;
  bulkRemoveDocuments: (ids: string[]) => void;
  moveDocumentToFolder: (docId: string, folderId: string) => void;
}
