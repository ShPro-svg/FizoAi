import React from 'react';
import { motion } from 'framer-motion';

interface CurrentRatioMeterProps {
  value: number; // e.g. 1.03
  target?: number; // e.g. 1.5
  isEmpty?: boolean;
}

export const CurrentRatioMeter: React.FC<CurrentRatioMeterProps> = ({
  value,
  target = 1.5,
  isEmpty = false,
}) => {
  // Max scale is 3.0x
  const maxScale = 3.0;
  const ratioValue = isEmpty ? 0 : Math.max(0, Math.min(value, maxScale));
  const pointerPercent = Math.min(100, (ratioValue / maxScale) * 100);
  const targetPercent = (target / maxScale) * 100; // 50%

  // Health assessment
  const getStatus = (val: number) => {
    if (isEmpty) return { color: 'text-slate-400', label: 'No Data' };
    if (val >= 1.5) return { color: 'text-[#0F4B2D]', label: 'Safe Liquidity' };
    if (val >= 1.0) return { color: 'text-amber-600', label: 'Tight Liquidity' };
    return { color: 'text-rose-600', label: 'Liquidity Deficit' };
  };

  const status = getStatus(ratioValue);

  return (
    <div className="w-full flex flex-col gap-1.5 pt-1">
      {/* Spectrum Bar */}
      <div className="relative w-full h-2.5 rounded-full overflow-hidden flex bg-slate-100 p-0.5 border border-slate-200">
        {/* Zone 1: <1.0x Critical */}
        <div className="h-full w-[33.3%] bg-gradient-to-r from-rose-400 to-rose-500 rounded-l-full" title="< 1.0x Critical" />
        {/* Zone 2: 1.0x - 1.5x Caution */}
        <div className="h-full w-[16.7%] bg-gradient-to-r from-amber-400 to-amber-500" title="1.0x - 1.5x Warning" />
        {/* Zone 3: > 1.5x Safe */}
        <div className="h-full w-[50%] bg-gradient-to-r from-[#91BEFF] to-[#5AA55A] rounded-r-full" title="> 1.5x Optimal" />

        {/* Target Benchmark Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-slate-800 z-10"
          style={{ left: `${targetPercent}%` }}
          title={`Target benchmark: ${target}x`}
        />
      </div>

      {/* Dynamic Pointer Marker */}
      <div className="relative w-full h-3">
        {!isEmpty && (
          <motion.div
            initial={{ left: '0%' }}
            animate={{ left: `${pointerPercent}%` }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -top-0.5 -translate-x-1/2 flex flex-col items-center"
          >
            <div className="w-2 h-2 rotate-45 bg-slate-900 shadow-xs" />
          </motion.div>
        )}
      </div>

      {/* Sub-label indicators */}
      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 tracking-tight -mt-1.5">
        <span className="text-rose-600 font-mono">0.0x Deficit</span>
        <span className={`font-extrabold ${status.color}`}>
          {status.label}
        </span>
        <span className="text-[#0F4B2D] font-mono">3.0x+ Optimal</span>
      </div>
    </div>
  );
};

