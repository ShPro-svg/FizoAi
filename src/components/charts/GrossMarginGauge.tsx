import React from 'react';
import { motion } from 'framer-motion';

interface GrossMarginGaugeProps {
  value: number; // e.g. 39 for 39%
  target?: number; // e.g. 50%
  size?: number;
  isEmpty?: boolean;
}

export const GrossMarginGauge: React.FC<GrossMarginGaugeProps> = ({
  value,
  target = 50,
  size = 72,
  isEmpty = false,
}) => {
  const displayVal = isEmpty ? 0 : Math.min(Math.max(value, 0), 100);
  const strokeWidth = 7;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayVal / 100) * circumference;

  // Determine color based on margin health
  const getStrokeColor = (val: number) => {
    if (isEmpty) return '#E5E7EB';
    if (val >= 40) return '#059669'; // Emerald
    if (val >= 25) return '#EA580C'; // Warm Orange
    return '#DC2626'; // Red
  };

  const strokeColor = getStrokeColor(displayVal);

  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="#F3F4F6"
          strokeWidth={strokeWidth}
        />
        {/* Benchmark target dash */}
        {!isEmpty && (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#9CA3AF"
            strokeWidth={strokeWidth + 1}
            strokeDasharray={`2 ${circumference - 2}`}
            strokeDashoffset={circumference - (target / 100) * circumference}
            className="opacity-40"
          />
        )}
        {/* Animated Progress Arc */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          strokeLinecap="round"
        />
      </svg>
      {/* Inner label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[11px] font-black text-gray-800 leading-none">
          {isEmpty ? '--' : `${displayVal}%`}
        </span>
        <span className="text-[8px] font-bold text-gray-400 mt-0.5 uppercase tracking-tight">
          Margin
        </span>
      </div>
    </div>
  );
};
