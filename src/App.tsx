import React, { Suspense, lazy, useState } from 'react';
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
  <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-3 text-slate-500">
    <Loader2 className="w-8 h-8 text-[#0064FA] animate-spin" />
    <span className="text-xs font-semibold text-slate-600">Loading module data...</span>
  </div>
);

export const App: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <WorkspaceProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex relative selection:bg-[#E1F5FF] selection:text-[#0064FA]">
            {/* Left Sidebar */}
            <Sidebar
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={toggleSidebar}
            />

            {/* Main Application Container */}
            <div
              className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ${
                isSidebarCollapsed ? 'ml-[72px]' : 'ml-[260px]'
              }`}
            >
              {/* Fixed TopBar */}
              <TopBar
                isSidebarCollapsed={isSidebarCollapsed}
                onToggleSidebar={toggleSidebar}
              />

              {/* Scrollable Content Area with ample whitespace */}
              <main className="flex-1 mt-[56px] p-6 lg:p-8 bg-[#F8FAFC] min-h-[calc(100vh-56px)]">
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

