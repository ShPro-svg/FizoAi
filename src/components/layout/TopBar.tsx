import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, RotateCcw } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const TopBar: React.FC = () => {
  const location = useLocation();
  const { loadDemo, startBlank } = useWorkspace();

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/overview':
        return 'Overview';
      case '/documents':
        return 'Documents';
      case '/files':
        return 'Files & Raw Data';
      case '/financial-analysis':
        return 'Financial Analysis';
      case '/risks':
        return 'Risks & Anomalies';
      case '/insights':
        return 'AI Insights';
      case '/privacy-audit':
        return 'Privacy & Audit';
      default:
        return 'Overview';
    }
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="fixed top-0 left-[260px] right-0 h-[54px] bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20 select-none">
      {/* Left side: Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-gray-500 font-normal">My Company Workspace</span>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-bold">{pageTitle}</span>
      </div>

      {/* Right side: Action Buttons and User Profile */}
      <div className="flex items-center gap-3">
        {/* Load Demo Dataset button */}
        <button
          type="button"
          onClick={loadDemo}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Load Demo Dataset</span>
        </button>

        {/* Reset button */}
        <button
          type="button"
          onClick={startBlank}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium transition-all shadow-2xs cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
          <span>Reset</span>
        </button>

        <div className="h-4 w-px bg-gray-200" />

        {/* User avatar & name */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-orange-50 text-[#EA580C] font-bold text-xs flex items-center justify-center border border-orange-300 shadow-2xs">
            AH
          </div>
          <span className="text-xs font-semibold text-gray-800 hidden sm:inline-block">
            Adam H.
          </span>
        </div>
      </div>
    </header>
  );
};
