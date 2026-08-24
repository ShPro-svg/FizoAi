import React from 'react';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionButton?: ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionButton,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 p-10 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto shadow-soft ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#E1F5FF] flex items-center justify-center text-[#0064FA] mb-4 border border-[#BAE0FF]/60 shadow-2xs">
        <Icon className="w-7 h-7" />
      </div>

      <h3 className="text-base font-extrabold text-slate-900 mb-1.5">{title}</h3>

      <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-sm mb-6">
        {description}
      </p>

      {actionButton && <div>{actionButton}</div>}
    </div>
  );
};

