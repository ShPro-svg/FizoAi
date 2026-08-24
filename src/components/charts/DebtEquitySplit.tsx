import React from 'react';
import { motion } from 'framer-motion';

interface DebtEquitySplitProps {
  value: number; // e.g. 1.33x
  isEmpty?: boolean;
}

export const DebtEquitySplit: React.FC<DebtEquitySplitProps> = ({
  value,
  isEmpty = false,
}) => {
  const deRatio = isEmpty ? 0 : Math.max(0, value);
  // Calculate percentage share of Total Capitalization (Liabilities + Equity)
  const debtSharePercent = deRatio > 0 ? (deRatio / (1 + deRatio)) * 100 : 50;
  const equitySharePercent = 100 - debtSharePercent;

  // Leverage Assessment
  const getLeverageGrade = (ratio: number) => {
    if (isEmpty) return { label: 'Awaiting Data', color: 'text-slate-400' };
    if (ratio <= 1.0) return { label: 'Conservative (<1.0x)', color: 'text-[#0F4B2D]' };
    if (ratio <= 2.0) return { label: 'Moderate Leverage', color: 'text-amber-600' };
    return { label: 'High Leverage (>2.0x)', color: 'text-rose-600' };
  };

  const grade = getLeverageGrade(deRatio);

  return (
    <div className="w-full flex flex-col gap-1.5 pt-1">
      {/* Proportion Bar: Debt (Red/Amber) vs Equity (Brandeis Blue) */}
      <div className="relative w-full h-2.5 rounded-full overflow-hidden flex bg-slate-100 p-0.5 border border-slate-200">
        {!isEmpty ? (
          <>
            {/* Debt Portion */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${debtSharePercent}%` }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-l-full"
              title={`Total Debt: ${debtSharePercent.toFixed(0)}%`}
            />
            {/* Equity Portion */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${equitySharePercent}%` }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-gradient-to-r from-[#91BEFF] to-[#0064FA] rounded-r-full"
              title={`Equity: ${equitySharePercent.toFixed(0)}%`}
            />
          </>
        ) : (
          <div className="h-full w-full bg-slate-200 rounded-full" />
        )}
      </div>

      {/* Breakdown Legend */}
      <div className="flex items-center justify-between text-[10px] font-semibold tracking-tight">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          <span className="text-slate-500">
            Debt: <strong className="text-slate-800 font-mono font-bold">{isEmpty ? '--' : `${debtSharePercent.toFixed(0)}%`}</strong>
          </span>
        </div>

        <span className={`text-[10px] font-bold ${grade.color}`}>
          {grade.label}
        </span>

        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0064FA]" />
          <span className="text-slate-500">
            Equity: <strong className="text-slate-800 font-mono font-bold">{isEmpty ? '--' : `${equitySharePercent.toFixed(0)}%`}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

