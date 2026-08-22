import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';

export const TopBar: React.FC = () => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/overview':
        return 'Overview';
      case '/documents':
        return 'Documents';
      case '/files':
        return 'Files & Real Data';
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
    <header className="fixed top-0 left-[260px] right-0 h-[50px] bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20 select-none">
      {/* Left side: Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-gray-400 font-medium">Workspace</span>
        <span className="text-gray-300">/</span>
        <span className="text-[#111827] font-semibold">{pageTitle}</span>
      </div>

      {/* Right side: Theme toggle and User profile */}
      <div className="flex items-center gap-4">
        {/* Visual Light/Dark mode toggle */}
        <button
          type="button"
          onClick={() => setIsDark(!isDark)}
          aria-label="Toggle theme (visual only)"
          title="Toggle theme (visual only)"
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none"
        >
          {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        <div className="h-4 w-px bg-gray-200" />

        {/* User avatar & name */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">
            AH
          </div>
          <span className="text-xs font-semibold text-[#111827] hidden sm:inline-block">
            Adam H.
          </span>
        </div>
      </div>
    </header>
  );
};
