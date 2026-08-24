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
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7 ${className}`}
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {title}
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1.5 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {actionButton && (
        <div className="flex-shrink-0 flex items-center gap-2.5">{actionButton}</div>
      )}
    </div>
  );
};

