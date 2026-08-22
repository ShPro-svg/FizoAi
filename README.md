<div align="center">

  <img src="public/fizo-logo.png" alt="Fizo AI Logo" width="120" style="border-radius: 24px; margin-bottom: 16px;" />

  # ⚡ FIZO AI
  ### Enterprise Financial Intelligence & Autonomous Statement Auditor

  <p align="center">
    <strong>A privacy-first, zero-telemetry financial diagnostic platform powered by Google Gemini 3.7 Flash and Supabase.</strong>
  </p>

  <p align="center">
    <a href="https://github.com/Rizz-Code-2026/Fizo-AI/stargazers"><img src="https://img.shields.io/github/stars/Rizz-Code-2026/Fizo-AI?color=EA580C&style=for-the-badge&logo=github" alt="Stars"></a>
    <a href="https://github.com/Rizz-Code-2026/Fizo-AI/network/members"><img src="https://img.shields.io/github/forks/Rizz-Code-2026/Fizo-AI?color=059669&style=for-the-badge&logo=github" alt="Forks"></a>
    <a href="https://github.com/Rizz-Code-2026/Fizo-AI/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License"></a>
    <a href="https://ai.google.dev/"><img src="https://img.shields.io/badge/AI%20Engine-Gemini%203.7%20Flash-4285F4?style=for-the-badge&logo=google" alt="Gemini 3.7 Flash"></a>
    <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase"></a>
    <a href="https://vercel.com/"><img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel" alt="Vercel"></a>
  </p>

  <br />

  <p align="center">
    <a href="#-key-features">Key Features</a> •
    <a href="#-system-architecture">Architecture</a> •
    <a href="#-ai-guardrail-technology">AI Guardrail</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-database-schema">Database Schema</a> •
    <a href="#-deployment">Deployment</a>
  </p>

</div>

---

## 🌟 Overview

**Fizo AI** is an enterprise-grade financial diagnostic and statement auditing suite built for corporate accountants, CFOs, and business analysts. 

It eliminates hours of manual financial data entry by autonomously extracting balance sheets, income statements (P&L), and cash flows from multi-format files (**PDF, Excel XLSX, CSV, JSON, and Scanned Images**). All data processing executes locally inside the browser's memory sandbox under strict **PDPA 2010 (Personal Data Protection Act)** compliance before synthesizing executive diagnostic insights.

```
[ Upload Statement / Invoice ] 
             │
             ▼
[ 🛡️ Gemini 3.7 Flash AI Guardrail ] ──( Rejects Pets, Memes, Screenshots, Personal Receipts )
             │
             ▼ ( Verified Valid )
[ 🔐 In-Memory Extraction Engine ] ──( Deterministic Regex & Tabular Parser )
             │
             ▼
[ 📊 Solvency, Liquidity & Anomaly Engine ] ──( Computes Health Score 0-100 )
             │
             ▼
[ 💬 Executive Assistant & Real Data Explorer ] ──( Strict Document Citations in RM / MYR )
```

---

## ✨ Key Features

### 1. 🛡️ Strict AI Document Guardrail (Powered by Gemini 3.7 Flash)
- **Multimodal Visual Inspection**: Pre-screens files prior to ingestion using multimodal computer vision OCR.
- **Strict Fraud & Irrelevance Blocking**: Automatically rejects non-corporate files (e.g. cat/animal pictures, individual cafe/coffee receipts, desktop screenshots, memes, candidate resumes, and cooking recipes) with **99-100% confidence**.
- **Company Verification**: Validates documents against the active company profile (*Warisan Delights Sdn Bhd*) and flags cross-entity spoofing.

### 2. 🔐 Privacy-First & PDPA 2010 Compliance
- **Zero-Telemetry Client Sandbox**: Parsing occurs locally inside browser memory using Web Workers (`pdf.js` worker, SheetJS, and fast CSV stream readers).
- **Mandatory Manual Consent**: Enforces explicit, unchecked-by-default consent checkboxes on every upload batch in compliance with PDPA standards.
- **Immutable Audit Trail**: All ingestion events and analyst actions are logged in local session memory and securely recorded to Supabase.

### 3. 📊 Executive Dashboard & Solvency Health Score
- **Holistic Health Scoring (0–100)**: Evaluates corporate vitality across Profitability, Liquidity, Operating Efficiency, and Capital Structure Risk.
- **Dynamic Ratio Gauges**: Real-time visual gauges for **Gross Profit Margin**, **Current Ratio**, and **Debt-to-Equity Breakdown**.
- **Interactive Evidence Drawer**: Click on any formula metric to view line-by-line proof, verified source citations, and audited document coordinates.

### 4. 📂 Interactive Files & Real Data Inspector
- **3-Mode Data Explorer**:
  - 📊 **Tabular Matrix**: Full table grid with instant live search and column-based filtering.
  - 📑 **Financial Fields**: Line-by-line categorization (Income Statement, Balance Sheet, Cash Flow).
  - 💻 **Raw JSON Structure**: Formatted developer code view with one-click JSON export and clipboard copy.

### 5. 🤖 Executive Financial Assistant (Vercel Serverless)
- **Context-Aware Analyst**: Answers complex financial queries based exclusively on your ingested statements.
- **Source Citation Enforcement**: Every AI statement is backed by explicit source tags (`[Source: P&L FY2025, Row 12]`) to prevent hallucinations.
- **Currency Standardization**: Defaulted to Malaysian Ringgit (`RM` / `MYR`).

---

## 🏗️ System Architecture

```
Fizo-AI/
├── api/                             # Vercel Serverless Functions
│   ├── chat.ts                      # Gemini 3.7 Flash financial assistant API
│   └── validate-document.ts         # Multimodal AI Document Guardrail endpoint
├── public/                          # Static Assets & Sample Test Files
│   ├── samples/                     # Guardrail test suite (Cat photo, personal receipt, valid P&L)
│   └── favicon.svg                  # Brand favicon
├── src/
│   ├── components/                  # Reusable UI & Chart Components
│   │   ├── charts/                  # CurrentRatioMeter, GrossMarginGauge, DebtEquitySplit
│   │   ├── layout/                  # PageHeader, Sidebar, TopBar
│   │   └── ui/                      # MetricCard, EvidenceDrawer, FloatingChat
│   ├── context/                     # WorkspaceContext (Session state & memory ledger)
│   ├── pages/                       # App Views
│   │   ├── OverviewPage.tsx         # Executive KPI cards & Health Score
│   │   ├── DocumentsPage.tsx        # Multi-file dropzone, PDPA consent modal & AI Guardrail
│   │   ├── FilesPage.tsx            # Real tabular data viewer & workbook inspector
│   │   ├── FinancialAnalysisPage.tsx# Solvency ratios & multi-year trend breakdown
│   │   ├── RisksPage.tsx            # Deterministic anomaly detection & risk signals
│   │   ├── InsightsPage.tsx         # AI executive diagnostic synthesis
│   │   └── PrivacyAuditPage.tsx     # PDPA audit logs & compliance telemetry
│   ├── services/                    # Core Client Engines
│   │   ├── calculationService.ts    # Mathematical ratio & health score formulas
│   │   ├── extractionService.ts     # Multi-format statement parsing (PDF/XLSX/CSV/JSON)
│   │   ├── riskService.ts           # Anomaly rules & heuristic insight generators
│   │   └── supabaseClient.ts        # Supabase client connector
│   └── types/                       # Enterprise TypeScript interfaces
├── supabase/
│   └── schema.sql                   # Complete PostgreSQL database migration script
└── vercel.json                      # Vercel SPA routing & Serverless API config
```

---

## 🛡️ AI Guardrail Technology

Fizo AI includes a built-in test suite to verify the AI Guardrail against malicious or accidental uploads:

| Test File | File Type | Guardrail Result | AI Action |
|---|---|---|---|
| 🐱 **`kucing_comel.jpg`** | Scanned Image | 🛑 **Rejected (100%)** | Blocks ingestion. Displays warning: *"Identified as a pet/animal photo."* |
| ☕ **`resit_starbucks_personal.jpg`** | Cafe Bill | 🛑 **Rejected (99%)** | Blocks ingestion. Displays warning: *"Identified as an individual personal expense receipt."* |
| 🖥️ **`Screenshot...png`** | Desktop Screen | 🛑 **Rejected (98%)** | Blocks ingestion. Displays warning: *"Identified as a random screen capture."* |
| 📝 **`invalid_resume.csv`** | CSV Data | 🛑 **Rejected (100%)** | Blocks ingestion. Displays warning: *"Contains candidate biodata, not financial records."* |
| ✅ **`valid_pnl_fy2025.csv`** | P&L Statement | 🟢 **Verified (98%)** | Ingested, calculated, and reflected in financial metrics. |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm**
- **Google Gemini API Key** ([Get one here](https://aistudio.google.com/))
- **Supabase Account** ([supabase.com](https://supabase.com/))

### 1. Clone the Repository
```bash
git clone https://github.com/Rizz-Code-2026/Fizo-AI.git
cd Fizo-AI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Google Gemini API Key (Gemini 3.7 Flash)
GEMINI_API_KEY=your_gemini_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Run Locally
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🗄️ Database Schema

The database schema is fully scripted and optimized for PostgreSQL 15+ / Supabase with Row Level Security (RLS) enabled.

To initialize your database:
1. Navigate to **Supabase Dashboard ➔ SQL Editor**.
2. Copy and execute the contents of [supabase/schema.sql](supabase/schema.sql).

### Core Tables:
- `workspaces`: Corporate profile, registration, and base currency.
- `documents`: Uploaded statement metadata, status, and AI validation flags.
- `financial_metrics`: Calculated solvency, liquidity, and profitability metrics.
- `risk_signals`: Detected anomalies, deviations, and evidentiary line items.
- `ai_insights`: Synthesized executive insights and strategic guidance.
- `health_scores`: Historical snapshots of financial health scores (0-100).
- `chat_messages`: Assistant conversation history and document citations.
- `audit_logs`: Zero-telemetry compliance logs and audit trails.

---

## ☁️ Deployment (Vercel)

This repository includes a pre-configured [vercel.json](vercel.json) supporting Single Page Application (SPA) routing and Serverless API functions.

### One-Click Deploy via GitHub (Recommended)
1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New..." ➔ "Project"**.
3. Import **`Fizo-AI`**.
4. In **Environment Variables**, add:
   - `GEMINI_API_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **"Deploy"**.

### Deploy via Vercel CLI
```bash
npx vercel --prod
```

---

## 🔒 Security & Compliance

- **PDPA 2010 Compliant**: Built strictly under the guidelines of Malaysia's Personal Data Protection Act 2010.
- **Client-Side Sandbox**: No unverified financial data leaves the client browser without explicit consent.
- **OWASP Top 10 Protected**: Rate-limited endpoints, input sanitation, CORS restrictions, and strict RLS policies.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<br />

<div align="center">
  <sub>Built with ❤️ by the Fizo AI Engineering Team</sub>
</div>
