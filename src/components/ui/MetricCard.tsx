import React, { useEffect } from 'react';
import type { ConfidenceTier } from '../../types';
import { ConfidenceBadge } from './ConfidenceBadge';
import { ArrowUpRight, ArrowDownRight, HelpCircle } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

export interface MetricCardProps {
  label: string;
  value: number | string;
  unit?: string;
  change?: number | string;
  changeLabel?: string;
  confidence?: ConfidenceTier;
  onEvidenceClick?: () => void;
  className?: string;
  isEmpty?: boolean;
  emptyLabel?: string;
  animateCount?: boolean;
  prefix?: string;
  icon?: React.ReactNode;
  valueColor?: string;
  changeColor?: string;
  showBottomAccent?: boolean;
  graph?: React.ReactNode;
  graphPosition?: 'side' | 'bottom';
}

// Animated counting number using Framer Motion
const AnimatedNumber: React.FC<{
  value: number;
  unit?: string;
  prefix?: string;
  duration?: number;
}> = ({ value, unit = '', prefix = '', duration = 1.2 }) => {
  const count = useMotionValue(0);

  useEffect(() => {
    const controls = animate(count, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [value, count, duration]);

  const display = useTransform(count, (latest) => {
    const isInteger = Number.isInteger(value);
    const formatted = latest.toLocaleString('en-US', {
      minimumFractionDigits: isInteger ? 0 : Math.abs(value) < 10 ? 2 : 2,
      maximumFractionDigits: 2,
    });

    if (prefix) {
      return `${prefix} ${formatted}${unit}`;
    }
    if (unit === '%') {
      return `${formatted}%`;
    }
    if (unit === 'x') {
      return `${formatted}x`;
    }
    if (unit === 'RM' || unit === '$') {
      return `${unit} ${formatted}`;
    }
    return `${formatted}${unit ? ' ' + unit : ''}`;
  });

  return <motion.span>{display}</motion.span>;
};

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  change,
  changeLabel,
  confidence,
  onEvidenceClick,
  className = '',
  isEmpty = false,
  emptyLabel = 'Awaiting data',
  animateCount = true,
  prefix,
  icon,
  valueColor = 'text-slate-900',
  changeColor,
  showBottomAccent = false,
  graph,
  graphPosition = 'bottom',
}) => {
  const numericChange = typeof change === 'number' ? change : change ? parseFloat(String(change)) : null;
  const isPositive = numericChange !== null && numericChange >= 0;
  const isNegative = numericChange !== null && numericChange < 0;

  // Clean changeLabel to avoid duplicated percentages
  const cleanChangeLabel = changeLabel
    ? changeLabel.replace(/^[+-]?\d+(\.\d+)?%?\s*/, '').trim()
    : '';

  // Determine prefix from unit if needed
  const displayPrefix = prefix || (unit === 'RM' || unit === '$' ? unit : undefined);
  const displayUnit = unit === 'RM' || unit === '$' ? undefined : unit;

  return (
    <div
      className={`group bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.03)] p-5 sm:p-6 flex flex-col justify-between h-full min-h-[260px] transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,100,250,0.09)] hover:border-[#91BEFF]/70 hover:-translate-y-0.5 relative overflow-hidden ${
        showBottomAccent ? 'border-b-[3px] border-b-[#0064FA]' : ''
      } ${className}`}
    >
      {/* Subtle top-edge accent glow on hover */}
      <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-[#91BEFF]/0 via-[#0064FA]/30 to-[#91BEFF]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Top row: Label & Badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
          {label}
        </span>
        {icon ? (
          <div className="w-7 h-7 rounded-xl bg-[#E1F5FF] text-[#0064FA] flex items-center justify-center flex-shrink-0 text-xs border border-[#BAE0FF]/60">
            {icon}
          </div>
        ) : isEmpty ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-400 border border-slate-200/80">
            {emptyLabel}
          </span>
        ) : (
          confidence && <ConfidenceBadge tier={confidence} />
        )}
      </div>

      {/* Middle row: Large Value & Graph with vertical centering */}
      <div className="flex-1 flex flex-col justify-center my-2">
        {graphPosition === 'side' && graph ? (
          <div className="flex items-center justify-between gap-3">
            <div className={`text-2xl sm:text-3xl font-black tracking-tight ${isEmpty ? 'text-slate-300' : valueColor}`}>
              {isEmpty ? (
                <span>—</span>
              ) : typeof value === 'number' && animateCount ? (
                <AnimatedNumber
                  value={value}
                  unit={displayUnit}
                  prefix={displayPrefix}
                  duration={1.2}
                />
              ) : (
                <span>
                  {displayPrefix ? `${displayPrefix} ` : ''}
                  {typeof value === 'number' ? value.toLocaleString() : value}
                  {displayUnit ? ` ${displayUnit}` : ''}
                </span>
              )}
            </div>
            <div className="flex-shrink-0">{graph}</div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className={`text-2xl sm:text-3xl font-black tracking-tight ${isEmpty ? 'text-slate-300' : valueColor}`}>
              {isEmpty ? (
                <span>—</span>
              ) : typeof value === 'number' && animateCount ? (
                <AnimatedNumber
                  value={value}
                  unit={displayUnit}
                  prefix={displayPrefix}
                  duration={1.2}
                />
              ) : (
                <span>
                  {displayPrefix ? `${displayPrefix} ` : ''}
                  {typeof value === 'number' ? value.toLocaleString() : value}
                  {displayUnit ? ` ${displayUnit}` : ''}
                </span>
              )}
            </div>
            {graph && <div className="pt-1">{graph}</div>}
          </div>
        )}
      </div>

      {/* Bottom row: Change badge & Trace link */}
      <div className="mt-auto pt-3 border-t border-slate-100/80 flex items-center justify-between flex-wrap gap-2 text-xs">
        {isEmpty ? (
          <span className="text-[10px] text-slate-300 font-medium italic">No baseline</span>
        ) : change !== undefined && change !== null ? (
          <div className="flex items-center gap-1.5 font-semibold">
            <span
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-xs font-bold ${
                changeColor
                  ? changeColor
                  : isPositive
                  ? 'bg-[#E2F1E2] text-[#0F4B2D]'
                  : isNegative
                  ? 'bg-rose-50 text-rose-600'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {isPositive && <ArrowUpRight className="w-3.5 h-3.5 text-[#5AA55A]" />}
              {isNegative && <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />}
              {typeof change === 'number' ? `${change > 0 ? '+' : ''}${change}%` : change}
            </span>
            {cleanChangeLabel && (
              <span className="text-[10px] text-slate-400 font-medium">{cleanChangeLabel}</span>
            )}
          </div>
        ) : (
          <div />
        )}

        {!isEmpty && onEvidenceClick && (
          <button
            type="button"
            onClick={onEvidenceClick}
            className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0064FA] hover:text-[#0053D6] hover:underline transition-colors ml-auto focus:outline-none cursor-pointer opacity-60 group-hover:opacity-100"
          >
            <HelpCircle className="w-3 h-3" />
            <span>Trace</span>
          </button>
        )}
      </div>
    </div>
  );
};
