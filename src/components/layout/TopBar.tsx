import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldCheck, Building2, Edit3, X, Check, User, Menu } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

interface TopBarProps {
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  isSidebarCollapsed = false,
  onToggleSidebar,
}) => {
  const location = useLocation();
  const { companyProfile, updateCompanyProfile, currentUser, updateCurrentUser } = useWorkspace();

  // Company Modal State
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [tempName, setTempName] = useState(companyProfile?.name || 'Warisan Delights Sdn Bhd');
  const [tempRegNo, setTempRegNo] = useState(companyProfile?.registrationNo || '201801023456 (1284482-W)');
  const [tempIndustry, setTempIndustry] = useState(companyProfile?.industry || 'Food & Beverage / Restaurant Chain');

  // User Session Modal State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [tempUserName, setTempUserName] = useState(currentUser?.name || 'Adam H.');
  const [tempUserRole, setTempUserRole] = useState(currentUser?.role || 'Senior Financial Analyst');

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      updateCompanyProfile({
        name: tempName.trim(),
        registrationNo: tempRegNo.trim(),
        industry: tempIndustry.trim(),
      });
      setIsCompanyModalOpen(false);
    }
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUserName.trim()) {
      updateCurrentUser({
        name: tempUserName.trim(),
        role: tempUserRole.trim(),
      });
      setIsUserModalOpen(false);
    }
  };

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

  // Initials for avatar
  const initials = (currentUser?.name || 'AH')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <header
        className={`fixed top-0 right-0 h-[56px] bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-5 sm:px-7 z-20 select-none transition-all duration-300 ${
          isSidebarCollapsed ? 'left-[72px]' : 'left-[260px]'
        }`}
      >
        {/* Left side: Sidebar Toggle & Company & Breadcrumbs */}
        <div className="flex items-center gap-2.5 text-xs">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              aria-label="Toggle sidebar"
              className="p-1.5 rounded-lg text-slate-500 hover:text-[#0064FA] hover:bg-[#E1F5FF]/50 border border-slate-200/60 transition-colors mr-1 cursor-pointer"
              title="Toggle sidebar visibility"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setTempName(companyProfile?.name || '');
              setTempRegNo(companyProfile?.registrationNo || '');
              setTempIndustry(companyProfile?.industry || '');
              setIsCompanyModalOpen(true);
            }}
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-[#E1F5FF] border border-slate-200 hover:border-[#91BEFF] text-slate-700 hover:text-[#0064FA] font-semibold transition-all cursor-pointer shadow-2xs max-w-[200px] sm:max-w-[260px]"
            title="Click to edit corporate profile"
          >
            <Building2 className="w-3.5 h-3.5 text-[#0064FA] flex-shrink-0" />
            <span className="truncate">{companyProfile?.name || 'Company Profile'}</span>
            <Edit3 className="w-3 h-3 text-slate-400 group-hover:text-[#0064FA] flex-shrink-0 ml-0.5 opacity-60 group-hover:opacity-100" />
          </button>

          <span className="text-slate-300 font-medium">/</span>
          <span className="text-slate-900 font-bold tracking-tight">{pageTitle}</span>
        </div>

        {/* Right side: Security indicator and User Profile */}
        <div className="flex items-center gap-3.5">
          {/* Privacy & Sandbox badge */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#E2F1E2] text-[#0F4B2D] border border-[#5AA55A]/30 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5AA55A]" />
            <span>Client Sandbox • Zero Telemetry</span>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* User avatar & session button */}
          <button
            type="button"
            onClick={() => {
              setTempUserName(currentUser?.name || 'Adam H.');
              setTempUserRole(currentUser?.role || 'Senior Financial Analyst');
              setIsUserModalOpen(true);
            }}
            className="flex items-center gap-2.5 group p-1 pr-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all cursor-pointer"
            title="Click to edit active Auditor session"
          >
            <div className="w-7 h-7 rounded-lg bg-[#E1F5FF] text-[#0064FA] font-bold text-xs flex items-center justify-center border border-[#91BEFF] shadow-2xs group-hover:scale-105 transition-transform">
              {initials}
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold text-slate-800 block leading-tight">
                {currentUser?.name || 'Adam H.'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium block leading-none mt-0.5">
                {currentUser?.role || 'Analyst'}
              </span>
            </div>
          </button>
        </div>
      </header>

      {/* Edit Corporate Profile Modal */}
      {isCompanyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E1F5FF] text-[#0064FA] flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Edit Corporate Profile</h3>
                  <p className="text-xs text-slate-500">Configures corporate identity for AI guardrails</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCompanyModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCompany} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Registered Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="e.g. Acme Holdings Sdn Bhd"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0064FA]/20 focus:border-[#0064FA] text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Registration Number (SSM / SSM Co. No.)
                </label>
                <input
                  type="text"
                  value={tempRegNo}
                  onChange={(e) => setTempRegNo(e.target.value)}
                  placeholder="e.g. 202101009876 (1412345-T)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0064FA]/20 focus:border-[#0064FA] text-slate-900 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Industry / Sector
                </label>
                <input
                  type="text"
                  value={tempIndustry}
                  onChange={(e) => setTempIndustry(e.target.value)}
                  placeholder="e.g. Retail & Wholesale, F&B, Logistics"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0064FA]/20 focus:border-[#0064FA] text-slate-900"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCompanyModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0064FA] hover:bg-[#0053D6] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Auditor / Session User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E1F5FF] text-[#0064FA] flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Active Auditor Session</h3>
                  <p className="text-xs text-slate-500">Logs your name on all file actions & audit trails</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUserModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Operator / Auditor Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={tempUserName}
                  onChange={(e) => setTempUserName(e.target.value)}
                  placeholder="e.g. Sarah Tan / Adam Harith"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0064FA]/20 focus:border-[#0064FA] text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={tempUserRole}
                  onChange={(e) => setTempUserRole(e.target.value)}
                  placeholder="e.g. Lead Financial Controller / Audit Partner"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0064FA]/20 focus:border-[#0064FA] text-slate-900"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0064FA] hover:bg-[#0053D6] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Update Session</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};


