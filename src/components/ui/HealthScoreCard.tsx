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
        stroke: '#E5E7EB',
        badgeBg: 'bg-emerald-50 text-[#059669] border-emerald-200/60',
        dot: 'bg-[#059669]',
        label: 'Awaiting Data',
      };
    }
    if (val >= 70) {
      return {
        stroke: '#059669', // Green
        badgeBg: 'bg-emerald-50 text-[#059669] border-emerald-200',
        dot: 'bg-[#059669]',
        label: 'Optimal Health',
      };
    }
    if (val >= 50) {
      return {
        stroke: '#D97706', // Amber
        badgeBg: 'bg-amber-50 text-[#D97706] border-amber-200',
        dot: 'bg-[#D97706]',
        label: 'Moderate Risk',
      };
    }
    return {
      stroke: '#DC2626', // Red
      badgeBg: 'bg-red-50 text-[#DC2626] border-red-200',
      dot: 'bg-[#DC2626]',
      label: 'Deteriorating / Urgent',
    };
  };

  const theme = getTheme(score, isAvailable);

  // SVG Circular Gauge calculations
  const size = 96;
  const strokeWidth = 8;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = isAvailable
    ? circumference - (score / 100) * circumference
    : circumference;

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col justify-between overflow-hidden ${className}`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Financial Health Score
        </span>
        <div
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${theme.badgeBg}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
          <span className="truncate">{theme.label}</span>
        </div>
      </div>

      {/* Center Gauge & Value */}
      <div className="flex items-center gap-4 my-2">
        <div className="relative flex-shrink-0 flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#F3F4F6"
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
            <span className="text-2xl font-bold text-[#111827]">
              {isAvailable ? <motion.span>{displayScore}</motion.span> : '0'}
            </span>
            <span className="text-[9px] uppercase font-semibold text-gray-400">Score</span>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-[#111827]">
              {isAvailable ? <motion.span>{displayScore}</motion.span> : '0'}
            </span>
            <span className="text-sm font-medium text-gray-400">/ 100</span>
          </div>
          <p className="text-[11px] text-[#6B7280] mt-1 leading-snug">
            {isAvailable
              ? 'Computed from 4 solvency & profitability pillars.'
              : 'Awaiting financial document ingestion.'}
          </p>
        </div>
      </div>

      {/* Dimension breakdown mini-indicators */}
      {isAvailable && healthScore?.components && (
        <div className="pt-2.5 border-t border-gray-100 grid grid-cols-3 gap-1.5 text-[10px]">
          <div className="bg-gray-50 rounded p-1 text-center">
            <span className="text-gray-500 block truncate">Profit</span>
            <span className="font-bold text-red-600">{healthScore.components.profitability}/25</span>
          </div>
          <div className="bg-gray-50 rounded p-1 text-center">
            <span className="text-gray-500 block truncate">Liquidity</span>
            <span className="font-bold text-amber-600">{healthScore.components.liquidity}/25</span>
          </div>
          <div className="bg-gray-50 rounded p-1 text-center">
            <span className="text-gray-500 block truncate">Risk</span>
            <span className="font-bold text-red-600">{healthScore.components.riskLevel}/25</span>
          </div>
        </div>
      )}
    </div>
  );
};
