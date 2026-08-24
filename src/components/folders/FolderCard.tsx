import React from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, ArrowRight } from 'lucide-react';
import type { DocumentFolder, FolderColor } from '../../types';

interface FolderCardProps {
  folder: DocumentFolder;
  fileCount: number;
  totalSizeBytes?: number;
  lastUpdated?: string;
  onClick: () => void;
  onMenuClick?: (e: React.MouseEvent) => void;
}

const COLOR_STYLES: Record<
  FolderColor,
  {
    backBg: string;
    tabBg: string;
    frontBg: string;
    accentGlow: string;
    badgeBg: string;
    badgeText: string;
    iconColor: string;
  }
> = {
  blue: {
    backBg: 'from-[#0053D6] via-[#0064FA] to-[#003FB3]',
    tabBg: 'bg-[#0053D6]',
    frontBg: 'from-[#0064FA] via-[#4691FF] to-[#0053D6]',
    accentGlow: 'hover:shadow-[0_16px_36px_-12px_rgba(0,100,250,0.30)]',
    badgeBg: 'bg-white/20',
    badgeText: 'text-white',
    iconColor: 'text-blue-100',
  },
  purple: {
    backBg: 'from-[#6D28D9] via-[#7C3AED] to-[#5B21B6]',
    tabBg: 'bg-[#6D28D9]',
    frontBg: 'from-[#7C3AED] via-[#8B5CF6] to-[#6D28D9]',
    accentGlow: 'hover:shadow-[0_16px_36px_-12px_rgba(124,58,237,0.30)]',
    badgeBg: 'bg-white/20',
    badgeText: 'text-white',
    iconColor: 'text-purple-200',
  },
  emerald: {
    backBg: 'from-[#0F4B2D] via-[#357A38] to-[#0F4B2D]',
    tabBg: 'bg-[#0F4B2D]',
    frontBg: 'from-[#5AA55A] via-[#6BB66B] to-[#498B49]',
    accentGlow: 'hover:shadow-[0_16px_36px_-12px_rgba(90,165,90,0.30)]',
    badgeBg: 'bg-white/20',
    badgeText: 'text-white',
    iconColor: 'text-emerald-100',
  },
  amber: {
    backBg: 'from-[#B45309] via-[#D97706] to-[#92400E]',
    tabBg: 'bg-[#B45309]',
    frontBg: 'from-[#D97706] via-[#F59E0B] to-[#B45309]',
    accentGlow: 'hover:shadow-[0_16px_36px_-12px_rgba(217,119,6,0.30)]',
    badgeBg: 'bg-white/20',
    badgeText: 'text-white',
    iconColor: 'text-amber-200',
  },
  rose: {
    backBg: 'from-[#BE123C] via-[#E11D48] to-[#9F1239]',
    tabBg: 'bg-[#BE123C]',
    frontBg: 'from-[#E11D48] via-[#F43F5E] to-[#BE123C]',
    accentGlow: 'hover:shadow-[0_16px_36px_-12px_rgba(225,29,72,0.30)]',
    badgeBg: 'bg-white/20',
    badgeText: 'text-white',
    iconColor: 'text-rose-200',
  },
  slate: {
    backBg: 'from-[#334155] via-[#475569] to-[#1E293B]',
    tabBg: 'bg-[#334155]',
    frontBg: 'from-[#475569] via-[#64748B] to-[#334155]',
    accentGlow: 'hover:shadow-[0_16px_36px_-12px_rgba(71,85,105,0.30)]',
    badgeBg: 'bg-white/20',
    badgeText: 'text-white',
    iconColor: 'text-slate-200',
  },
};

export const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  fileCount,
  totalSizeBytes,
  lastUpdated,
  onClick,
  onMenuClick,
}) => {
  const styles = COLOR_STYLES[folder.color] || COLOR_STYLES.blue;

  const sizeText =
    totalSizeBytes !== undefined && totalSizeBytes > 0
      ? (totalSizeBytes / 1024 / 1024).toFixed(1) + ' MB'
      : '';

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group relative cursor-pointer select-none transition-all duration-300 w-full ${styles.accentGlow}`}
    >
      {/* 3D Folder Container */}
      <div className="relative aspect-[4/3.2] w-full min-h-[190px] flex flex-col justify-end">
        {/* 1. BACK FOLDER TAB & BODY */}
        <div className="absolute inset-0 top-0 left-0 right-0 bottom-0 pointer-events-none">
          {/* Top Tab Cutout */}
          <div
            className={`absolute top-0 left-0 w-[46%] h-[26px] rounded-tl-2xl rounded-tr-xl bg-gradient-to-r ${styles.backBg} shadow-xs`}
            style={{
              clipPath: 'polygon(0% 0%, 82% 0%, 100% 100%, 0% 100%)',
            }}
          />
          {/* Back Wall of the folder */}
          <div
            className={`absolute top-[18px] inset-x-0 bottom-0 rounded-2xl bg-gradient-to-br ${styles.backBg} shadow-md`}
          />
        </div>

        {/* 2. LAYERED PAPER SHEETS (Peeking out from inside pocket) */}
        <div className="absolute inset-x-4 top-[10px] bottom-[30%] flex items-start justify-center pointer-events-none z-10">
          {/* Sheet 3 (Back-most tilted) */}
          <div
            className="absolute w-[86%] h-[74px] bg-white/80 rounded-xl shadow-xs border border-white/60 transform -rotate-3 transition-transform duration-300 group-hover:-translate-y-3 group-hover:-rotate-5"
          >
            <div className="p-2 space-y-1 opacity-30">
              <div className="h-1 bg-slate-400 rounded-full w-2/3" />
              <div className="h-1 bg-slate-300 rounded-full w-full" />
            </div>
          </div>

          {/* Sheet 2 (Middle tilted right) */}
          <div
            className="absolute w-[89%] h-[78px] bg-white/90 rounded-xl shadow-sm border border-white/80 transform rotate-2 transition-transform duration-300 group-hover:-translate-y-4 group-hover:rotate-4"
          >
            <div className="p-2.5 space-y-1 opacity-40">
              <div className="h-1.5 bg-slate-400 rounded-full w-1/2" />
              <div className="h-1 bg-slate-300 rounded-full w-4/5" />
              <div className="h-1 bg-slate-300 rounded-full w-3/5" />
            </div>
          </div>

          {/* Sheet 1 (Front straight crisp white sheet) */}
          <div
            className="absolute w-[92%] h-[82px] bg-white rounded-xl shadow-md border border-slate-100 transform transition-transform duration-300 group-hover:-translate-y-5"
          >
            {/* Miniature paper header mimicking financial document */}
            <div className="p-2.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="h-2 bg-[#0064FA]/70 rounded-full w-1/3" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#5AA55A]" />
              </div>
              <div className="space-y-1 opacity-50">
                <div className="h-1 bg-slate-300 rounded-full w-full" />
                <div className="h-1 bg-slate-200 rounded-full w-5/6" />
                <div className="h-1 bg-slate-200 rounded-full w-2/3" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. FRONT GLOSSY FOLDER POCKET */}
        <div
          className={`relative z-20 w-full h-[68%] rounded-2xl bg-gradient-to-br ${styles.frontBg} p-4 text-white shadow-lg backdrop-blur-xs flex flex-col justify-between overflow-hidden border-t border-white/40`}
        >
          {/* Glass Reflection Highlight Gradient on Top Corner */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-white/20 rounded-full blur-xl pointer-events-none" />
          <div className="absolute top-0 right-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

          {/* Folder Top Metadata Row */}
          <div className="flex items-start justify-between gap-2 relative z-10">
            <div className="space-y-0.5 max-w-[80%]">
              <h3 className="text-sm font-bold tracking-tight text-white drop-shadow-xs truncate">
                {folder.name}
              </h3>
              <p className="text-[11px] font-medium text-white/85">
                {fileCount} {fileCount === 1 ? 'document' : 'documents'}
                {sizeText ? ` • ${sizeText}` : ''}
              </p>
            </div>

            {/* Menu / Details Icon */}
            {onMenuClick && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMenuClick(e);
                }}
                className="w-6 h-6 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer flex-shrink-0"
                title="Folder options"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Folder Bottom Row */}
          <div className="flex items-center justify-between pt-2 border-t border-white/15 text-[10px] text-white/85 relative z-10">
            <span className="truncate">
              {lastUpdated ? `Updated ${lastUpdated}` : 'Active ledger'}
            </span>
            <div className="flex items-center gap-1 font-bold text-white group-hover:translate-x-0.5 transition-transform">
              <span>Open</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

