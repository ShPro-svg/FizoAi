import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  PieChart,
  ShieldAlert,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Building2,
  HelpCircle,
  Flame,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Overview', path: '/overview', icon: LayoutDashboard },
    { name: 'Documents', path: '/documents', icon: FileText },
    { name: 'Files & Raw Data', path: '/files', icon: FolderOpen },
    { name: 'Financial Analysis', path: '/financial-analysis', icon: PieChart },
    { name: 'Risks & Anomalies', path: '/risks', icon: ShieldAlert },
    { name: 'AI Insights', path: '/insights', icon: Sparkles },
    { name: 'Privacy & Audit', path: '/privacy-audit', icon: ShieldCheck },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-[260px] bg-[#0B0F17] border-r border-[#1E2738] flex flex-col justify-between z-30 select-none text-white">
      {/* Top Section */}
      <div className="p-4 flex flex-col">
        {/* Fizo AI Brand Header */}
        <div className="flex items-center gap-3 px-2 py-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#EA580C] to-[#F97316] shadow-md shadow-orange-500/20 flex items-center justify-center p-1.5 flex-shrink-0">
            <Flame className="w-full h-full text-white fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-white tracking-tight leading-none">
              Fizo AI
            </span>
            <span className="text-[10px] text-gray-400 font-medium mt-1">
              Financial Intelligence
            </span>
          </div>
        </div>

        {/* Section Label: CLIENTS & WORKSPACES */}
        <div className="px-2 mb-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            CLIENTS & WORKSPACES
          </span>
        </div>

        {/* Workspace Dropdown Button */}
        <div className="mb-5 px-1">
          <div className="w-full bg-[#131A26] border border-[#222E42] rounded-xl p-2.5 flex items-center justify-between cursor-pointer hover:bg-[#1A2436] transition-colors shadow-inner">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-xs font-semibold text-white truncate">
                My Company Workspace
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-1" />
          </div>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#EA580C]/15 border border-[#EA580C]/40 text-[#FB923C] font-semibold shadow-xs shadow-orange-950/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        isActive ? 'text-[#FB923C]' : 'text-gray-400'
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
      <div className="p-4 border-t border-[#1E2738]/80">
        <div className="bg-[#131A26] border border-[#1E2738] rounded-xl p-3.5 flex flex-col gap-1.5 shadow-sm">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#FB923C] flex-shrink-0" />
            <span className="text-xs font-semibold text-[#FB923C]">Need Help?</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Read our compliance guide or contact your data protection officer.
          </p>
        </div>
      </div>
    </aside>
  );
};
