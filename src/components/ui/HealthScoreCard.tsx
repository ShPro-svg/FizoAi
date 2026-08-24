import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import type { HealthScore } from '../../types';

export interface HealthScoreCardProps {
  healthScore?: HealthScore | null;
  className?: string;
}

export const HealthScoreCard: React.FC<HealthScoreCardProps> = ({
  healthScore,
  className = '',
}) => {
  const isAvailable = healthScore !== null && healthScore !== undefined;
  const score = isAvailable ? healthScore.score : 0;

  // Animated score counter
  const animatedScore = useMotionValue(0);
  useEffect(() => {
    const controls = animate(animatedScore, score, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [score, animatedScore]);

  const displayScore = useTransform(animatedScore, (val) => Math.round(val));

  // Determine theme color based on score
  const getTheme = (val: number, available: boolean) => {
    if (!available) {
      return {
        stroke: '#E2E8F0',
        trackStroke: '#F1F5F9',
        badgeBg: 'bg-slate-100 text-slate-500 border-slate-200',
        dot: 'bg-slate-400',
        label: 'Awaiting Data',
        pillars: [
          { key: 'Profit', color: 'text-slate-300' },
          { key: 'Liquidity', color: 'text-slate-300' },
          { key: 'Solvency', color: 'text-slate-300' },
          { key: 'Risk', color: 'text-slate-300' },
        ],
      };
    }
    if (val >= 70) {
      return {
        stroke: '#5AA55A',
        trackStroke: '#E2F1E2',
        badgeBg: 'bg-[#E2F1E2] text-[#0F4B2D] border-[#5AA55A]/40',
        dot: 'bg-[#5AA55A]',
        label: 'Optimal Health',
        pillars: [],
      };
    }
    if (val >= 50) {
      return {
        stroke: '#F59E0B',
        trackStroke: '#FEF3C7',
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-[#F59E0B]',
        label: 'Moderate Risk',
        pillars: [],
      };
    }
    return {
      stroke: '#EF4444',
      trackStroke: '#FEE2E2',
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
      dot: 'bg-[#EF4444]',
      label: 'Deteriorating',
      pillars: [],
    };
  };

  const theme = getTheme(score, isAvailable);

  // SVG Circular Gauge calculations
  const size = 88;
  const strokeWidth = 7;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = isAvailable
    ? circumference - (score / 100) * circumference
    : circumference;

  const getPillarColor = (val: number) =>
    val >= 18 ? 'text-[#0F4B2D]' : val >= 12 ? 'text-amber-600' : 'text-rose-600';

  const pillars = isAvailable && healthScore?.components
    ? [
        { label: 'Profit', val: healthScore.components.profitability, max: 25 },
        { label: 'Liquid', val: healthScore.components.liquidity, max: 25 },
        { label: 'Solven', val: healthScore.components.efficiency ?? 20, max: 25 },
        { label: 'Risk', val: healthScore.components.riskLevel, max: 25 },
      ]
    : null;

  return (
    <div
      className={`group bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.03)] p-5 sm:p-6 flex flex-col justify-between h-full min-h-[260px] overflow-hidden hover:shadow-[0_8px_24px_rgba(0,100,250,0.09)] hover:border-[#91BEFF]/70 hover:-translate-y-0.5 transition-all duration-200 relative ${className}`}
    >
      {/* Subtle top-edge accent glow on hover */}
      <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-[#91BEFF]/0 via-[#0064FA]/30 to-[#91BEFF]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
          Financial Health Score
        </span>
        <div
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${theme.badgeBg}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${theme.dot}`} />
          <span className="truncate">{theme.label}</span>
        </div>
      </div>

      {/* Center Gauge & Value */}
      <div className="flex-1 flex items-center gap-3.5 my-2">
        {/* SVG Gauge */}
        <div className="relative flex-shrink-0 flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#F1F5F9"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Animated fill circle */}
            <motion.circle
              cx={center}
              cy={center}
              r={radius}
              stroke={theme.stroke}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Center score text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-black text-slate-900 leading-none">
              {isAvailable ? <motion.span>{displayScore}</motion.span> : '—'}
            </span>
            <span className="text-[8px] uppercase font-bold text-slate-400 tracking-widest mt-0.5">Score</span>
          </div>
        </div>

        {/* Right side text */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900 tracking-tight leading-none">
              {isAvailable ? <motion.span>{displayScore}</motion.span> : '—'}
            </span>
            <span className="text-sm font-semibold text-slate-300 ml-0.5">/ 100</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5 leading-snug font-medium">
            {isAvailable
              ? 'Computed from 4 solvency & profitability pillars.'
              : 'Awaiting financial document ingestion.'}
          </p>
        </div>
      </div>

      {/* 4 Pillar Breakdown - Pinned at bottom */}
      <div className="mt-auto pt-3 border-t border-slate-100/80">
        {pillars ? (
          <div className="grid grid-cols-4 gap-1.5">
            {pillars.map(({ label, val, max }) => (
              <div
                key={label}
                className="bg-slate-50 border border-slate-100 rounded-xl p-1.5 text-center"
              >
                <span className="text-[9px] text-slate-400 font-semibold block truncate uppercase tracking-wide">
                  {label}
                </span>
                <span className={`text-[11px] font-black ${getPillarColor(val)}`}>
                  {val}<span className="text-slate-300 font-normal">/{max}</span>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-1.5">
            {['Profit', 'Liquid', 'Solven', 'Risk'].map((l) => (
              <div key={l} className="bg-slate-50 border border-slate-100 rounded-xl p-1.5 text-center">
                <span className="text-[9px] text-slate-300 font-semibold block truncate uppercase tracking-wide">{l}</span>
                <span className="text-[11px] font-black text-slate-200">—</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
