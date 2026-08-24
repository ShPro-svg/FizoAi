import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  Files,
  Database,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { Logo } from '../ui/Logo';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const navItems = [
    { name: 'Overview', path: '/overview', icon: LayoutGrid },
    { name: 'Documents', path: '/documents', icon: Files },
    { name: 'Files & Raw Data', path: '/files', icon: Database },
    { name: 'Financial Analysis', path: '/financial-analysis', icon: TrendingUp },
    { name: 'Risks & Anomalies', path: '/risks', icon: AlertTriangle },
    { name: 'AI Insights', path: '/insights', icon: Sparkles },
    { name: 'Privacy & Audit', path: '/privacy-audit', icon: ShieldCheck },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white border-r border-slate-200/90 flex flex-col justify-between z-30 select-none transition-all duration-300 ease-in-out shadow-[1px_0_12px_rgba(0,0,0,0.02)] overflow-y-auto overflow-x-hidden ${
        isCollapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Top Section */}
      <div className="p-3.5 flex flex-col">
        {/* Brand Header */}
        <div
          className={`flex items-center justify-between px-1.5 py-2 mb-4 ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <Logo
            size={isCollapsed ? 'sm' : 'md'}
            showText={!isCollapsed}
            className="cursor-pointer"
          />

          {!isCollapsed && onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation links with updated modern icon styling */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={isCollapsed ? item.name : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all group relative ${
                    isCollapsed ? 'justify-center px-2.5' : ''
                  } ${
                    isActive
                      ? 'bg-[#E1F5FF] text-[#0064FA] shadow-[0_1px_3px_rgba(0,100,250,0.08)] border border-[#BAE0FF]/70'
                      : 'text-slate-600 hover:text-[#0064FA] hover:bg-[#F0F7FF] border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-colors stroke-[2.2] ${
                        isActive
                          ? 'text-[#0064FA]'
                          : 'text-slate-400 group-hover:text-[#0064FA]'
                      }`}
                    />
                    {!isCollapsed && <span className="truncate">{item.name}</span>}

                    {/* Tooltip on collapsed hover */}
                    {isCollapsed && (
                      <span className="fixed left-[76px] hidden group-hover:inline-block px-2.5 py-1 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-lg whitespace-nowrap z-50 pointer-events-none animate-in fade-in">
                        {item.name}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Large 3D Card (Reference 2 Style) */}
      <div className="p-3 border-t border-slate-100 flex flex-col gap-2">
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-2">
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label="Expand sidebar"
                title="Expand sidebar"
                className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-[#E1F5FF] text-slate-500 hover:text-[#0064FA] border border-slate-200/80 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <div
              title="Compliance & Support • Zero-telemetry active"
              className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-[#E1F5FF] border border-slate-200/60 p-1 flex items-center justify-center cursor-pointer transition-all shadow-2xs group relative"
            >
              <img
                src="/sidebar.png"
                alt="Support"
                className="w-full h-full object-contain"
              />
              <span className="fixed left-[76px] hidden group-hover:inline-block px-2.5 py-1 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-lg whitespace-nowrap z-50 pointer-events-none animate-in fade-in">
                Compliance &amp; Support
              </span>
            </div>
          </div>
        ) : (
          <div className="group relative overflow-hidden bg-gradient-to-b from-[#F8FAFC] via-[#F0F7FF] to-[#E1F5FF]/50 border border-[#BAE0FF]/60 rounded-2xl p-4 text-center shadow-soft transition-all duration-200 hover:shadow-md hover:border-[#91BEFF] flex flex-col items-center">
            {/* Ambient circular glow */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full bg-white/80 pointer-events-none blur-xl" />

            {/* Large 3D Illustration */}
            <div className="relative z-10 w-full flex items-center justify-center mb-2">
              <img
                src="/sidebar.png"
                alt="Compliance & Support"
                className="h-24 sm:h-28 w-auto object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Title & Subtitle */}
            <div className="relative z-10 w-full">
              <span className="text-xs font-black text-slate-900 block leading-tight">
                Compliance &amp; Support
              </span>
              <span className="text-[10px] text-slate-500 font-medium block mt-1 leading-snug">
                Zero-telemetry active client sandbox
              </span>

              {/* Action Link (like "Upgrade your plan ->") */}
              <NavLink
                to="/privacy-audit"
                className="inline-flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#0064FA] hover:text-[#0053D6] mt-2.5 px-3 py-1.5 rounded-xl bg-white border border-[#BAE0FF]/80 shadow-2xs hover:shadow-xs transition-all w-full active:scale-95"
              >
                <span>Audit &amp; Privacy Log</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

