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
    if (isEmpty) return '#E2E8F0';
    if (val >= 40) return '#5AA55A'; // Pastel Green
    if (val >= 25) return '#0064FA'; // Brandeis Blue
    return '#EF4444'; // Red
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
          stroke="#F1F5F9"
          strokeWidth={strokeWidth}
        />
        {/* Benchmark target dash */}
        {!isEmpty && (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#94A3B8"
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
        <span className="text-[11px] font-extrabold text-slate-800 leading-none">
          {isEmpty ? '--' : `${displayVal}%`}
        </span>
        <span className="text-[8px] font-bold text-slate-400 mt-0.5 uppercase tracking-tight">
          Margin
        </span>
      </div>
    </div>
  );
};

