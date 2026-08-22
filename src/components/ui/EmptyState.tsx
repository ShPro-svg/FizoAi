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
      className={`bg-white rounded-xl border border-gray-200 p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto shadow-sm ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
        <Icon className="w-6 h-6" />
      </div>

      <h3 className="text-base font-semibold text-[#111827] mb-1.5">{title}</h3>

      <p className="text-sm text-[#6B7280] leading-relaxed max-w-sm mb-6">
        {description}
      </p>

      {actionButton && <div>{actionButton}</div>}
    </div>
  );
};
