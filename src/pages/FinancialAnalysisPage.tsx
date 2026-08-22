import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { PieChart } from 'lucide-react';
import { MetricCard } from '../components/ui/MetricCard';
import { useWorkspace } from '../context/WorkspaceContext';

export const FinancialAnalysisPage: React.FC = () => {
  const { metrics } = useWorkspace();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Analysis"
        subtitle="Deep-dive into income statement margins, liquidity ratios, and cash flow trends."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            label={metric.name}
            value={metric.value}
            unit={metric.unit}
            change={metric.comparedTo?.changePercent}
            changeLabel={metric.comparedTo ? `vs ${metric.comparedTo.period}` : undefined}
            confidence={metric.confidence}
          />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 shadow-sm">
        <PieChart className="w-10 h-10 mx-auto text-blue-600 mb-3" />
        <h3 className="text-sm font-semibold text-[#111827]">Interactive Financial Charts</h3>
        <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
          Detailed revenue breakdowns, EBITDA trend lines, and liquidity simulations.
        </p>
      </div>
    </div>
  );
};
