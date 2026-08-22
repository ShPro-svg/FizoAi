import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { FloatingChat } from './components/ui/FloatingChat';

import { OverviewPage } from './pages/OverviewPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { FilesPage } from './pages/FilesPage';
import { FinancialAnalysisPage } from './pages/FinancialAnalysisPage';
import { RisksPage } from './pages/RisksPage';
import { InsightsPage } from './pages/InsightsPage';
import { PrivacyAuditPage } from './pages/PrivacyAuditPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  },
});

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
              </main>
            </div>

            {/* Global Floating AI Assistant Button & Chat Panel */}
            <FloatingChat />
          </div>
        </BrowserRouter>
      </WorkspaceProvider>
    </QueryClientProvider>
  );
};

export default App;
