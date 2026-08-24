import React from 'react';
import type { ConfidenceTier } from '../../types';
import { ShieldCheck, HelpCircle, AlertTriangle } from 'lucide-react';

interface ConfidenceBadgeProps {
  tier?: ConfidenceTier;
  className?: string;
  showIcon?: boolean;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  tier = 'verified',
  className = '',
  showIcon = true,
}) => {
  const getBadgeConfig = (tier: ConfidenceTier) => {
    switch (tier) {
      case 'verified':
        return {
          label: 'Verified',
          bg: 'bg-[#E2F1E2] text-[#0F4B2D] border border-[#5AA55A]/40 font-bold',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-[#5AA55A]" />,
        };
      case 'inferred':
        return {
          label: 'Inferred',
          bg: 'bg-[#E1F5FF] text-[#0064FA] border border-[#91BEFF]/70 font-semibold',
          icon: <HelpCircle className="w-3.5 h-3.5 text-[#0064FA]" />,
        };
      case 'flagged':
        return {
          label: 'Flagged',
          bg: 'bg-rose-50 text-rose-700 border border-rose-200 font-bold',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />,
        };
      default:
        return {
          label: 'Verified',
          bg: 'bg-[#E2F1E2] text-[#0F4B2D] border border-[#5AA55A]/40 font-bold',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-[#5AA55A]" />,
        };
    }
  };

  const config = getBadgeConfig(tier);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs transition-colors shadow-2xs ${config.bg} ${className}`}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};

