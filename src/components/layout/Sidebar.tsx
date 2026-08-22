import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  PieChart,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import fizoLogo from '../../assets/fizo-logo.png';

export const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Overview', path: '/overview', icon: LayoutDashboard },
    { name: 'Documents', path: '/documents', icon: FileText },
    { name: 'Files & Real Data', path: '/files', icon: FolderOpen },
    { name: 'Financial Analysis', path: '/financial-analysis', icon: PieChart },
    { name: 'Risks & Anomalies', path: '/risks', icon: AlertTriangle },
    { name: 'AI Insights', path: '/insights', icon: Sparkles },
    { name: 'Privacy & Audit', path: '/privacy-audit', icon: ShieldCheck },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-[260px] bg-white border-r border-gray-200 flex flex-col justify-between z-30 select-none">
      {/* Top Section */}
      <div className="p-4 flex flex-col">
        {/* FizoAI Logo & Brand */}
        <div className="flex items-center gap-3 px-2 py-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-center overflow-hidden p-1 flex-shrink-0">
            <img
              src={fizoLogo}
              alt="FizoAI Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-[#111827] tracking-tight leading-none">
              FizoAI
            </span>
            <span className="text-[10px] text-gray-400 font-medium mt-0.5">
              Financial Intelligence
            </span>
          </div>
        </div>

        {/* Current Workspace Section */}
        <div className="mb-4 px-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
            CURRENT WORKSPACE
          </span>
          <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 flex items-center justify-between cursor-pointer hover:bg-gray-100/80 transition-colors">
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">
                WORKSPACE / EVENT
              </span>
              <span className="text-xs font-semibold text-[#111827] truncate">
                Warisan Delights Sdn Bhd
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-1" />
          </div>
        </div>

        {/* Workspace Nav Section */}
        <div className="px-2 mb-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            WORKSPACE
          </span>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-[#2563EB] font-semibold shadow-xs'
                      : 'text-[#4B5563] hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        isActive ? 'text-[#2563EB]' : 'text-gray-500'
                      }`}
                    />
                    <span className="truncate">{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Need help? */}
      <div className="p-4 border-t border-gray-100">
        <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
              <HelpCircle className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold text-[#111827]">Need help?</span>
          </div>
          <p className="text-[11px] text-[#4B5563] leading-relaxed">
            All calculations & extractions execute 100% locally in your browser.
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 mt-0.5 hover:underline"
          >
            <span>View documentation</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </aside>
  );
};
