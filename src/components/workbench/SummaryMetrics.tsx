import React from 'react';
import { SummaryMetricsData } from '../../types';
import { FileText, Clock, CheckCircle2, AlertOctagon, HelpCircle } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface SummaryMetricsProps {
  metrics: SummaryMetricsData;
  activeFilter: string | null;
  onSelectMetricFilter: (filterKey: 'all' | 'pending' | 'approved' | 'unmapped') => void;
}

export const SummaryMetrics: React.FC<SummaryMetricsProps> = ({
  metrics,
  activeFilter,
  onSelectMetricFilter,
}) => {
  const cards = [
    {
      id: 'all' as const,
      title: 'Total Obligations',
      value: metrics.totalObligations,
      definition:
        'Total number of regulatory obligation records ingested into the workbench registry.',
      icon: FileText,
      color: 'border-slate-200 text-slate-800 bg-white hover:border-slate-400',
      activeColor: 'ring-2 ring-slate-800 border-slate-800 bg-slate-50',
      badge: 'All Ingested',
    },
    {
      id: 'pending' as const,
      title: 'Pending Review',
      value: metrics.pendingReview,
      definition:
        'Obligations with at least one active proposed mapping awaiting analyst review or clarification.',
      icon: Clock,
      color: 'border-amber-200 text-amber-900 bg-white hover:border-amber-400',
      activeColor: 'ring-2 ring-amber-600 border-amber-500 bg-amber-50/50',
      badge: 'Needs Action',
    },
    {
      id: 'approved' as const,
      title: 'Approved Mappings',
      value: metrics.approvedMappings,
      definition:
        'Total active obligation-to-control mapping relationships reviewed and approved by compliance analysts.',
      icon: CheckCircle2,
      color: 'border-emerald-200 text-emerald-900 bg-white hover:border-emerald-400',
      activeColor: 'ring-2 ring-emerald-600 border-emerald-500 bg-emerald-50/50',
      badge: 'Active & Validated',
    },
    {
      id: 'unmapped' as const,
      title: 'Unmapped Obligations',
      value: metrics.unmappedObligations,
      definition:
        'Applicable obligations currently without an approved, active operational control mapping.',
      icon: AlertOctagon,
      color: 'border-rose-200 text-rose-900 bg-white hover:border-rose-400',
      activeColor: 'ring-2 ring-rose-600 border-rose-500 bg-rose-50/50',
      badge: 'High Attention',
    },
  ];

  return (
    <Tooltip.Provider delayDuration={200}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Executive Control Portfolio Metrics
          </div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
            <span>Illustrative demo dataset</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {cards.map((card) => {
            const Icon = card.icon;
            const isSelected = activeFilter === card.id;

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => onSelectMetricFilter(card.id)}
                className={`relative text-left p-4 rounded-lg border transition-all duration-150 shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                  isSelected ? card.activeColor : card.color
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-slate-600">{card.title}</span>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <span
                          tabIndex={0}
                          role="button"
                          aria-label={`Definition for ${card.title}`}
                          className="text-slate-400 hover:text-slate-600 cursor-help focus:outline-none"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                        </span>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          side="top"
                          align="center"
                          className="z-50 max-w-xs rounded-md bg-slate-900 px-3 py-2 text-xs text-white shadow-md animate-in fade-in-0"
                          sideOffset={5}
                        >
                          {card.definition}
                          <div className="text-[10px] text-teal-300 mt-1 font-mono">
                            Click metric card to filter table
                          </div>
                          <Tooltip.Arrow className="fill-slate-900" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  </div>
                  <Icon className="w-4 h-4 text-slate-400" />
                </div>

                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl font-bold tracking-tight text-slate-900">
                    {card.value}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {card.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Tooltip.Provider>
  );
};
