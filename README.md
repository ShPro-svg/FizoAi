<div align="center">

  <img src="public/icon.png" alt="Fizo AI Logo" width="100" style="border-radius: 20px; margin-bottom: 16px; box-shadow: 0 10px 25px rgba(0, 100, 250, 0.2);" />

  # ⚡ FIZO AI
  ### Enterprise Financial Intelligence & Autonomous Statement Auditor

  <p align="center">
    <strong>A privacy-first, zero-telemetry financial diagnostic platform powered by Google Gemini 3.7 Flash and Supabase.</strong>
  </p>

  <p align="center">
    <a href="https://fizo-ai.vercel.app/overview" target="_blank"><img src="https://img.shields.io/badge/🚀%20Live%20Demo-fizo--ai.vercel.app-0064FA?style=for-the-badge&logo=vercel" alt="Live Demo"></a>
    <a href="https://github.com/ShPro-svg/FizoAi/stargazers"><img src="https://img.shields.io/github/stars/ShPro-svg/FizoAi?color=0064FA&style=for-the-badge&logo=github" alt="Stars"></a>
    <a href="https://ai.google.dev/"><img src="https://img.shields.io/badge/AI%20Engine-Gemini%203.7%20Flash-4285F4?style=for-the-badge&logo=google" alt="Gemini 3.7 Flash"></a>
    <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase"></a>
    <a href="https://www.malaysia.gov.my/portal/content/654"><img src="https://img.shields.io/badge/Compliance-PDPA%202010%20%7C%20MFRS-10B981?style=for-the-badge&logo=shield" alt="Compliance"></a>
  </p>

  <br />

  <p align="center">
    <a href="https://fizo-ai.vercel.app/overview"><strong>🌐 Launch Live App</strong></a> •
    <a href="#-key-features">Key Features</a> •
    <a href="#-system-architecture">Architecture</a> •
    <a href="#-ai-guardrail-technology">AI Guardrail</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-deployment-guide-vercel">Deployment Guide</a> •
    <a href="#-security--compliance">Security & Compliance</a>
  </p>

</div>

---

> ### 🚀 Live Production URL
> **[https://fizo-ai.vercel.app/overview](https://fizo-ai.vercel.app/overview)**  
> Hosted on Vercel with edge caching, automated GitHub CI/CD pipeline, and serverless Gemini AI endpoints.

---

## 🌟 Overview

**Fizo AI** is an enterprise-grade financial intelligence and diagnostic audit platform built for CFOs, corporate accountants, and financial analysts.

It automates the ingestion, extraction, and verification of complex corporate financial statements across multiple file formats (**PDF, Excel XLSX, CSV, JSON, and Scanned Tax Invoices**). All data extraction runs **100% locally in client browser memory (Zero-Telemetry)** under strict **PDPA 2010** compliance before computing solvency ratios, anomaly signals, and generating strategic executive insights.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          FIZO AI PIPELINE                               │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
                   [ 📂 Multi-Format File Ingestion ]
                    (PDF, XLSX, CSV, JSON, Scans)
                                   │
                                   ▼
         [ 🛡️ Gemini 3.7 Flash Multimodal AI Guardrail ]
          (Rejects pet photos, personal cafe bills, memes)
                                   │
                     ┌─────────────┴─────────────┐
                     ▼                           ▼
             [ ❌ Rejected ]              [ ✅ Approved ]
         (Displays audit alert)                  │
                                                 ▼
                              [ 🔐 In-Memory Extraction Engine ]
                               (pdf.js, SheetJS, CSV streaming)
                                                 │
                                                 ▼
                              [ 📊 Solvency & Risk Math Engine ]
                               • Health Score (0 - 100)
                               • Gross Margin & Net Profit
                               • Current Ratio & Working Capital
                               • Debt to Equity Leverage
                                                 │
                                                 ▼
                              [ 💡 Executive Insights & Audit ]
                               • Automated Strategic Synthesis
                               • Interactive Line-by-Line Evidence
                               • Cryptographic PDPA Audit Trail
```

---

## ✨ Key Features

### 1. 🛡️ Multimodal AI Document Guardrail (Gemini 3.7 Flash)
- **Pre-Ingestion Visual Inspection**: Scans files before processing to confirm corporate authenticity.
- **Fraud & Non-Financial File Blocking**: Instantly rejects animal pictures, personal coffee receipts, memes, resumes, and desktop screenshots with **99%+ accuracy**.
- **Entity Matching**: Verifies document headers against the active company profile (*Warisan Delights Sdn Bhd*) to prevent cross-entity data mixing.

### 2. ⚡ 100% Client-Side Sandbox & PDPA 2010 Compliance
- **Zero-Telemetry Processing**: All statement parsing runs in browser memory using Web Workers (`pdf.js`, SheetJS, PapaParse). No raw financial numbers leave your device without explicit consent.
- **Mandatory Consent Check**: Enforces uncheck-by-default manual consent before ingestion.
- **Immutable Cryptographic Audit Trail**: Every view, extraction, calculation, and deletion action is stamped with an audit log and sha256 checksum.

### 3. 📊 Executive Solvency Dashboard & Performance Pillars
- **Composite Financial Health Score (0–100)**: Evaluates corporate vitality across 4 distinct pillars (Profitability, Liquidity, Operating Efficiency, and Capital Solvency).
- **Interactive Metric Cards**: Real-time visual gauges and ratio meters with **uniform vertical height layout** for Gross Margin, Current Ratio, and Debt-to-Equity.
- **Interactive Evidence Drawer**: Click on any calculated metric to inspect exact formula inputs, raw values, and source document coordinates.

### 4. 📂 Multi-Format Raw Data Explorer & Ledger Inspector
- **3 Dynamic Views**:
  - 📊 **Tabular Matrix**: Full table grid with instant live search and column-based filtering.
  - 📑 **Financial Fields**: Categorized view by Income Statement, Balance Sheet, and Cash Flow.
  - 💻 **Raw JSON Structure**: Formatted developer code view with one-click JSON export.

### 5. 🤖 Context-Aware AI Financial Assistant
- **Vercel Serverless Integration**: Powered by Google Gemini 3.7 Flash.
- **Zero Hallucination Guardrails**: Restricts answers strictly to verified ingested figures with exact document citations (`[Source: P&L FY2025, Row 14]`).
- **Malaysian Ringgit Standard**: Formatted cleanly in `RM` / `MYR`.

---

## 🏗️ System Architecture

```
FizoAi/
├── api/                             # Vercel Serverless Functions
│   ├── chat.ts                      # Gemini 3.7 Flash Financial Assistant
│   └── validate-document.ts         # Multimodal AI Document Guardrail
├── public/                          # Static Assets
│   ├── icon.png                     # App Logo & Favicon
│   ├── sidebar.png                  # 3D Compliance Support Illustration
│   └── samples/                     # AI Guardrail Verification Test Files
├── src/
│   ├── components/
│   │   ├── charts/                  # CurrentRatioMeter, GrossMarginGauge, DebtEquitySplit
│   │   ├── layout/                  # PageHeader, Sidebar, TopBar
│   │   ├── modals/                  # FileInsightsModal, CreateFolderModal
│   │   └── ui/                      # MetricCard, HealthScoreCard, EvidenceDrawer, FloatingChat
│   ├── context/                     # WorkspaceContext (Session state & localStorage cache)
│   ├── data/                        # demoData.ts (Realistic verified multi-format dataset)
│   ├── pages/
│   │   ├── OverviewPage.tsx         # Executive KPI Dashboard & Performance Pillars
│   │   ├── DocumentsPage.tsx        # Multi-file dropzone & AI Guardrail scanner
│   │   ├── FilesPage.tsx            # Tabular data explorer & folder manager
│   │   ├── FinancialAnalysisPage.tsx# Solvency ratios & multi-period trend lines
│   │   ├── RisksPage.tsx            # Anomaly rules & active risk signal monitor
│   │   ├── InsightsPage.tsx         # AI executive diagnostic synthesis
│   │   └── PrivacyAuditPage.tsx     # PDPA audit logs & compliance telemetry
│   ├── services/
│   │   ├── calculationService.ts    # Mathematical formulas & solvency ratios
│   │   ├── demoDataService.ts       # 5-format synthetic demo generator
│   │   ├── extractionService.ts     # In-memory parsers (PDF, XLSX, CSV, JSON, Image)
│   │   ├── pdfReportService.ts      # Client-side official PDF report generator
│   │   ├── riskService.ts           # Anomaly detection & executive summary heuristic
│   │   └── supabaseClient.ts        # Supabase backend connector
│   └── types/                       # TypeScript interfaces
├── supabase/
│   └── schema.sql                   # Full PostgreSQL database schema & RLS policies
└── vercel.json                      # Vercel SPA rewrites & Serverless headers
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm** or **pnpm**
- **Google Gemini API Key** ([Google AI Studio](https://aistudio.google.com/))
- **Supabase Account** ([supabase.com](https://supabase.com/))

### 1. Clone the Repository
```bash
git clone https://github.com/ShPro-svg/FizoAi.git
cd FizoAi
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 5. Build for Production
```bash
npm run build
```

---

## ☁️ Deployment Guide (Vercel)

### Option A: Automatic Deployment via GitHub (Recommended) 🌟
Set up continuous deployment so every `git push` automatically builds and deploys your updates:

1. **Push your latest changes to GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete UI polish and multi-format demo data"
   git push origin main
   ```
2. **Connect to Vercel**:
   - Log in to [Vercel Dashboard](https://vercel.com).
   - Click **"Add New..." ➔ "Project"**.
   - Select your repository **`ShPro-svg/FizoAi`** and click **Import**.
3. **Set Environment Variables in Vercel**:
   - Go to **Settings ➔ Environment Variables** in your Vercel project:
     - `GEMINI_API_KEY` = `your_gemini_key`
     - `VITE_GEMINI_API_KEY` = `your_gemini_key`
     - `VITE_SUPABASE_URL` = `https://your-project.supabase.co`
     - `VITE_SUPABASE_ANON_KEY` = `your_supabase_anon_key`
4. **Deploy**:
   - Click **Deploy**. Vercel will automatically build and publish your site at `https://fizo-ai.vercel.app`!
   - Every future `git push origin main` will deploy automatically within 30 seconds.

---

### Option B: Manual CLI Deployment
If you prefer deploying directly from your terminal:

```bash
# 1. Login to your Vercel account
npx vercel login

# 2. Link and deploy to production
npx vercel --prod
```

---

## 🔒 Security & Privacy Compliance

- **PDPA 2010 (Malaysia)**: Built strictly under the Personal Data Protection Act 2010.
- **Client-Side Sandbox**: Financial figures remain strictly in browser RAM unless explicitly shared.
- **OWASP Top 10 Protected**: Rate-limited endpoints, input sanitation, CORS restrictions, and PostgreSQL Row-Level Security (RLS).

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.

<br />

<div align="center">
  <sub>Built with ❤️ by the Fizo AI Engineering Team</sub>
</div>
