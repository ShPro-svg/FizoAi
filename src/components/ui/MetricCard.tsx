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
      ease: [0.16, 1, 0.3, 1], // Smooth exponential ease-out
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
  valueColor = 'text-gray-900',
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
      className={`bg-white rounded-xl border border-gray-200 shadow-xs p-5 flex flex-col justify-between transition-all hover:shadow-md relative overflow-hidden ${
        showBottomAccent ? 'border-b-4 border-b-[#EA580C]' : ''
      } ${className}`}
    >
      {/* Top row: Label & Icon / Badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          {label}
        </span>
        {icon ? (
          <div className="w-6 h-6 rounded-md bg-orange-50 text-[#EA580C] flex items-center justify-center flex-shrink-0 text-xs">
            {icon}
          </div>
        ) : isEmpty ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
            {emptyLabel}
          </span>
        ) : (
          confidence && <ConfidenceBadge tier={confidence} />
        )}
      </div>

      {/* Middle row: Large Value & Optional Side Graph */}
      {graphPosition === 'side' && graph ? (
        <div className="flex items-center justify-between gap-3 my-1">
          <div className={`text-2xl font-black tracking-tight ${valueColor}`}>
            {isEmpty ? (
              <span className="text-gray-300">0</span>
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
        <div className="my-1.5 space-y-2">
          <div className={`text-2xl font-black tracking-tight ${valueColor}`}>
            {isEmpty ? (
              <span className="text-gray-300">0</span>
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

      {/* Bottom row: Subtitle / Change percentage & Trace */}
      <div className="mt-2 pt-2 border-t border-gray-100/80 flex items-center justify-between flex-wrap gap-2 text-xs">
        {isEmpty ? (
          <span className="text-xs text-gray-400">No baseline</span>
        ) : change !== undefined && change !== null ? (
          <div className="flex items-center gap-1.5 font-medium">
            <span
              className={`inline-flex items-center gap-0.5 font-semibold ${
                changeColor
                  ? changeColor
                  : isPositive
                  ? 'text-[#059669]'
                  : isNegative
                  ? 'text-[#DC2626]'
                  : 'text-gray-500'
              }`}
            >
              {isPositive && <ArrowUpRight className="w-3.5 h-3.5" />}
              {isNegative && <ArrowDownRight className="w-3.5 h-3.5" />}
              {typeof change === 'number' ? `${change > 0 ? '+' : ''}${change}%` : change}
            </span>
            {cleanChangeLabel && (
              <span className="text-gray-500">{cleanChangeLabel}</span>
            )}
          </div>
        ) : (
          <div />
        )}

        {!isEmpty && onEvidenceClick && (
          <button
            type="button"
            onClick={onEvidenceClick}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#EA580C] hover:underline transition-colors ml-auto focus:outline-none cursor-pointer"
          >
            <HelpCircle className="w-3 h-3 text-[#EA580C]" />
            <span>Trace</span>
          </button>
        )}
      </div>
    </div>
  );
};
