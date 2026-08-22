-- ==============================================================================
-- FIZO AI - COMPLETE ENTERPRISE SUPABASE DATABASE SCHEMA
-- Schema version: 1.0.0
-- Target System: PostgreSQL 15+ / Supabase
-- Description: Financial Intelligence, Ingestion, OCR Guardrail, Metrics, 
--              Risk Signals, Executive Insights, AI Chat, and Audit Trails.
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. WORKSPACES & COMPANY PROFILE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.workspaces (
    id TEXT PRIMARY KEY DEFAULT ('ws-' || substr(md5(random()::text), 1, 12)),
    name TEXT NOT NULL,
    registration_no TEXT,
    industry TEXT DEFAULT 'Food & Beverage / Restaurant Chain',
    base_currency TEXT DEFAULT 'MYR',
    currency_symbol TEXT DEFAULT 'RM',
    tax_identifier TEXT,
    fiscal_year_start DATE,
    fiscal_year_end DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. FINANCIAL DOCUMENTS & INGESTION
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.documents (
    id TEXT PRIMARY KEY DEFAULT ('doc-' || substr(md5(random()::text), 1, 12)),
    workspace_id TEXT NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('pdf', 'csv', 'xlsx', 'json', 'image', 'png', 'jpg', 'jpeg', 'webp')),
    status TEXT NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'extracted', 'analyzed', 'rejected', 'error')),
    file_size BIGINT NOT NULL DEFAULT 0,
    file_url TEXT,
    storage_path TEXT,
    extracted_data JSONB DEFAULT '{}'::jsonb,
    validation_meta JSONB DEFAULT '{}'::jsonb, -- Stores AI Guardrail confidence, category, warning, company match
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. FINANCIAL METRICS & COMPUTED RATIOS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.financial_metrics (
    id TEXT PRIMARY KEY DEFAULT ('met-' || substr(md5(random()::text), 1, 12)),
    workspace_id TEXT NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    value NUMERIC(18, 4) NOT NULL,
    unit TEXT DEFAULT 'RM',
    formula TEXT NOT NULL,
    inputs JSONB DEFAULT '[]'::jsonb,
    compared_to JSONB DEFAULT '{}'::jsonb, -- Stores previous period value, change percentage
    confidence TEXT DEFAULT 'verified' CHECK (confidence IN ('verified', 'inferred', 'flagged')),
    calculated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. RISK SIGNALS & ANOMALIES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.risk_signals (
    id TEXT PRIMARY KEY DEFAULT ('risk-' || substr(md5(random()::text), 1, 12)),
    workspace_id TEXT NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewed', 'resolved')),
    category TEXT NOT NULL,
    rule TEXT NOT NULL,
    threshold TEXT,
    current_value TEXT,
    compared_value TEXT,
    deviation TEXT,
    evidence JSONB DEFAULT '[]'::jsonb, -- Stores citations, line item references
    detected_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. AI EXECUTIVE INSIGHTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.ai_insights (
    id TEXT PRIMARY KEY DEFAULT ('ins-' || substr(md5(random()::text), 1, 12)),
    workspace_id TEXT NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    narrative TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'ai-generated' CHECK (source IN ('manual', 'rule-based', 'ai-generated')),
    confidence TEXT DEFAULT 'verified' CHECK (confidence IN ('verified', 'inferred', 'flagged')),
    evidence JSONB DEFAULT '[]'::jsonb,
    limitations TEXT,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 7. FINANCIAL HEALTH SCORE SNAPSHOTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.health_scores (
    id TEXT PRIMARY KEY DEFAULT ('hs-' || substr(md5(random()::text), 1, 12)),
    workspace_id TEXT NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    score NUMERIC(5, 2) NOT NULL CHECK (score >= 0 AND score <= 100),
    profitability NUMERIC(5, 2) DEFAULT 0,
    liquidity NUMERIC(5, 2) DEFAULT 0,
    efficiency NUMERIC(5, 2) DEFAULT 0,
    risk_level NUMERIC(5, 2) DEFAULT 0,
    formula TEXT NOT NULL,
    source_documents JSONB DEFAULT '[]'::jsonb,
    calculated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 8. AI CHAT CONVERSATIONS & ASSISTANT HISTORY
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id TEXT PRIMARY KEY DEFAULT ('msg-' || substr(md5(random()::text), 1, 12)),
    workspace_id TEXT NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant', 'system')),
    text TEXT NOT NULL,
    sources JSONB DEFAULT '[]'::jsonb, -- Stores document citations, page, row references
    confidence_badge TEXT DEFAULT 'verified' CHECK (confidence_badge IN ('verified', 'inferred', 'flagged')),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 9. AUDIT TRAILS & ZERO TELEMETRY LOGS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY DEFAULT ('audit-' || substr(md5(random()::text), 1, 12)),
    workspace_id TEXT DEFAULT 'ws-active',
    action TEXT NOT NULL, -- 'upload_document', 'consent', 'extract', 'analyze', 'view', 'delete', 'ai_query'
    entity_type TEXT DEFAULT 'document',
    entity_id TEXT,
    file_name TEXT,
    document_id TEXT,
    file_size BIGINT,
    actor TEXT DEFAULT 'Adam H. (Analyst)',
    metadata JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 10. INDEXES FOR HIGH-SPEED QUERYING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_documents_workspace ON public.documents(workspace_id);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded ON public.documents(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_workspace ON public.financial_metrics(workspace_id);
CREATE INDEX IF NOT EXISTS idx_risks_workspace ON public.risk_signals(workspace_id);
CREATE INDEX IF NOT EXISTS idx_insights_workspace ON public.ai_insights(workspace_id);
CREATE INDEX IF NOT EXISTS idx_chat_workspace ON public.chat_messages(workspace_id);
CREATE INDEX IF NOT EXISTS idx_audit_workspace ON public.audit_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON public.audit_logs(timestamp DESC);

-- ==============================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow public access for anon & authenticated roles during app operation
CREATE POLICY "Allow public read/write on workspaces" ON public.workspaces FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on documents" ON public.documents FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on metrics" ON public.financial_metrics FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on risks" ON public.risk_signals FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on insights" ON public.ai_insights FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on health_scores" ON public.health_scores FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on chat_messages" ON public.chat_messages FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on audit_logs" ON public.audit_logs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- 12. STORAGE BUCKET FOR DOCUMENTS (OPTIONAL CLOUD STORAGE)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('financial-documents', 'financial-documents', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow all uploads to financial-documents bucket"
ON storage.objects FOR ALL TO anon, authenticated
USING (bucket_id = 'financial-documents')
WITH CHECK (bucket_id = 'financial-documents');

-- ==============================================================================
-- 13. SEED INITIAL COMPANY WORKSPACE
-- ==============================================================================
INSERT INTO public.workspaces (
    id,
    name,
    registration_no,
    industry,
    base_currency,
    currency_symbol
) VALUES (
    'ws-active',
    'Warisan Delights Sdn Bhd',
    '201801023456 (1284482-W)',
    'Food & Beverage / Restaurant Chain',
    'MYR',
    'RM'
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    registration_no = EXCLUDED.registration_no,
    industry = EXCLUDED.industry;
