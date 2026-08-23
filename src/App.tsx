import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { Loader2 } from 'lucide-react';

// Dynamic Lazy Loaded Page Components (Code Splitting)
const OverviewPage = lazy(() =>
  import('./pages/OverviewPage').then((m) => ({ default: m.OverviewPage }))
);
const DocumentsPage = lazy(() =>
  import('./pages/DocumentsPage').then((m) => ({ default: m.DocumentsPage }))
);
const FilesPage = lazy(() =>
  import('./pages/FilesPage').then((m) => ({ default: m.FilesPage }))
);
const FinancialAnalysisPage = lazy(() =>
  import('./pages/FinancialAnalysisPage').then((m) => ({ default: m.FinancialAnalysisPage }))
);
const RisksPage = lazy(() =>
  import('./pages/RisksPage').then((m) => ({ default: m.RisksPage }))
);
const InsightsPage = lazy(() =>
  import('./pages/InsightsPage').then((m) => ({ default: m.InsightsPage }))
);
const PrivacyAuditPage = lazy(() =>
  import('./pages/PrivacyAuditPage').then((m) => ({ default: m.PrivacyAuditPage }))
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  },
});

const RouteLoadingFallback = () => (
  <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-3 text-gray-500">
    <Loader2 className="w-7 h-7 text-[#EA580C] animate-spin" />
    <span className="text-xs font-semibold text-gray-600">Loading modules...</span>
  </div>
);

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <WorkspaceProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[#F9FAFB] text-[#111827] flex relative">
            {/* Fixed Left Sidebar (260px) */}
            <Sidebar />

            {/* Main Application Container */}
            <div className="flex-1 ml-[260px] min-h-screen flex flex-col">
              {/* Fixed TopBar (50px high) */}
              <TopBar />

              {/* Scrollable Content Area */}
              <main className="flex-1 mt-[54px] p-6 bg-[#F9FAFB] min-h-[calc(100vh-54px)]">
                <Suspense fallback={<RouteLoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<Navigate to="/overview" replace />} />
                    <Route path="/overview" element={<OverviewPage />} />
                    <Route path="/documents" element={<DocumentsPage />} />
                    <Route path="/files" element={<FilesPage />} />
                    <Route path="/financial-analysis" element={<FinancialAnalysisPage />} />
                    <Route path="/risks" element={<RisksPage />} />
                    <Route path="/insights" element={<InsightsPage />} />
                    <Route path="/privacy-audit" element={<PrivacyAuditPage />} />
                    <Route path="*" element={<Navigate to="/overview" replace />} />
                  </Routes>
                </Suspense>
              </main>
            </div>
          </div>
        </BrowserRouter>
      </WorkspaceProvider>
    </QueryClientProvider>
  );
};

export default App;
