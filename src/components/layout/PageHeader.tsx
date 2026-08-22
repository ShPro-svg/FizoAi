import React from 'react';
import type { ReactNode } from 'react';

export interface PageHeaderProps {
  title: string;
  subtitle: string;
  actionButton?: ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actionButton,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 ${className}`}
    >
      <div>
        <h1 className="text-2xl font-bold text-[#111827] tracking-tight">{title}</h1>
        <p className="text-sm text-[#6B7280] mt-1">{subtitle}</p>
      </div>

      {actionButton && (
        <div className="flex-shrink-0 flex items-center gap-2">{actionButton}</div>
      )}
    </div>
  );
};
