import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldCheck, Building2, Edit3, X, Check, User } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const TopBar: React.FC = () => {
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
      <header className="fixed top-0 left-[260px] right-0 h-[54px] bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20 select-none">
        {/* Left side: Company & Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => {
              setTempName(companyProfile?.name || '');
              setTempRegNo(companyProfile?.registrationNo || '');
              setTempIndustry(companyProfile?.industry || '');
              setIsCompanyModalOpen(true);
            }}
            className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-orange-50/70 border border-gray-200 hover:border-orange-300 text-gray-700 hover:text-[#EA580C] font-semibold transition-all cursor-pointer shadow-2xs max-w-[200px] sm:max-w-[260px]"
            title="Click to edit corporate profile"
          >
            <Building2 className="w-3.5 h-3.5 text-[#EA580C] flex-shrink-0" />
            <span className="truncate">{companyProfile?.name || 'Company Profile'}</span>
            <Edit3 className="w-3 h-3 text-gray-400 group-hover:text-[#EA580C] flex-shrink-0 ml-0.5 opacity-60 group-hover:opacity-100" />
          </button>

          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-bold">{pageTitle}</span>
        </div>

        {/* Right side: Security indicator and User Profile */}
        <div className="flex items-center gap-4">
          {/* Privacy & Sandbox badge */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-[#059669] border border-emerald-200/70">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Client Sandbox • Zero Telemetry</span>
          </div>

          <div className="h-4 w-px bg-gray-200 hidden sm:block" />

          {/* User avatar & session button */}
          <button
            type="button"
            onClick={() => {
              setTempUserName(currentUser?.name || 'Adam H.');
              setTempUserRole(currentUser?.role || 'Senior Financial Analyst');
              setIsUserModalOpen(true);
            }}
            className="flex items-center gap-2 group p-1 pr-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            title="Click to edit active Auditor session"
          >
            <div className="w-7 h-7 rounded-full bg-orange-50 text-[#EA580C] font-bold text-xs flex items-center justify-center border border-orange-300 shadow-2xs group-hover:scale-105 transition-transform">
              {initials}
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-semibold text-gray-800 block leading-tight">
                {currentUser?.name || 'Adam H.'}
              </span>
              <span className="text-[10px] text-gray-400 block leading-none">
                {currentUser?.role || 'Analyst'}
              </span>
            </div>
          </button>
        </div>
      </header>

      {/* Edit Corporate Profile Modal */}
      {isCompanyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#EA580C] flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Edit Corporate Profile</h3>
                  <p className="text-xs text-gray-500">Configures corporate identity for AI guardrails</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCompanyModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCompany} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Registered Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="e.g. Acme Holdings Sdn Bhd"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EA580C]/20 focus:border-[#EA580C] text-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Registration Number (SSM / SSM Co. No.)
                </label>
                <input
                  type="text"
                  value={tempRegNo}
                  onChange={(e) => setTempRegNo(e.target.value)}
                  placeholder="e.g. 202101009876 (1412345-T)"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EA580C]/20 focus:border-[#EA580C] text-gray-900 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Industry / Sector
                </label>
                <input
                  type="text"
                  value={tempIndustry}
                  onChange={(e) => setTempIndustry(e.target.value)}
                  placeholder="e.g. Retail & Wholesale, F&B, Logistics"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EA580C]/20 focus:border-[#EA580C] text-gray-900"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCompanyModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#EA580C] flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Active Auditor Session</h3>
                  <p className="text-xs text-gray-500">Logs your name on all file actions & audit trails</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUserModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Operator / Auditor Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={tempUserName}
                  onChange={(e) => setTempUserName(e.target.value)}
                  placeholder="e.g. Sarah Tan / Adam Harith"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EA580C]/20 focus:border-[#EA580C] text-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={tempUserRole}
                  onChange={(e) => setTempUserRole(e.target.value)}
                  placeholder="e.g. Lead Financial Controller / Audit Partner"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EA580C]/20 focus:border-[#EA580C] text-gray-900"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
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

