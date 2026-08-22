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
          bg: 'bg-emerald-50 text-[#059669] border border-emerald-200/60',
          icon: <ShieldCheck className="w-3.5 h-3.5" />,
        };
      case 'inferred':
        return {
          label: 'Inferred',
          bg: 'bg-amber-50 text-[#D97706] border border-amber-200/60',
          icon: <HelpCircle className="w-3.5 h-3.5" />,
        };
      case 'flagged':
        return {
          label: 'Flagged',
          bg: 'bg-red-50 text-[#DC2626] border border-red-200/60',
          icon: <AlertTriangle className="w-3.5 h-3.5" />,
        };
      default:
        return {
          label: 'Verified',
          bg: 'bg-emerald-50 text-[#059669] border border-emerald-200/60',
          icon: <ShieldCheck className="w-3.5 h-3.5" />,
        };
    }
  };

  const config = getBadgeConfig(tier);

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide transition-colors ${config.bg} ${className}`}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};
