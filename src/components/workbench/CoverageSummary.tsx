import React from 'react';
import { RegulatoryObligation, ControlMapping } from '../../types';
import { mappingService } from '../../services/mappingService';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, ShieldCheck } from 'lucide-react';

interface CoverageSummaryProps {
  obligation: RegulatoryObligation;
  mappings: ControlMapping[];
}

export const CoverageSummary: React.FC<CoverageSummaryProps> = ({
  obligation,
  mappings,
}) => {
  const summary = mappingService.getObligationCoverageSummary(obligation, mappings);

  const getStatusBadge = () => {
    switch (summary.stateLabel) {
      case 'Approved mapping':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          icon: CheckCircle2,
          color: 'text-emerald-700',
        };
      case 'Partial coverage (Approved)':
      case 'Partial coverage':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          icon: AlertTriangle,
          color: 'text-amber-700',
        };
      case 'Fully mapped, pending approval':
        return {
          bg: 'bg-teal-50 text-teal-800 border-teal-300',
          icon: Info,
          color: 'text-teal-700',
        };
      case 'Mapping rejected':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-300',
          icon: AlertCircle,
          color: 'text-rose-700',
        };
      case 'Applicability requires review':
        return {
          bg: 'bg-purple-50 text-purple-800 border-purple-300',
          icon: AlertTriangle,
          color: 'text-purple-700',
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          icon: Info,
          color: 'text-slate-600',
        };
    }
  };

  const badge = getStatusBadge();
  const Icon = badge.icon;

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 mb-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Control Coverage Assessment
          </div>
          {summary.isProvisional && (
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
              Provisional (Unreviewed)
            </span>
          )}
        </div>

        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
          <Icon className={`w-3.5 h-3.5 ${badge.color}`} />
          <span>{summary.stateLabel}</span>
        </div>
      </div>

      {/* Numerical Breakdown Grid */}
      <div className="grid grid-cols-3 gap-3 text-center mb-3">
        <div className="bg-slate-50 border border-slate-200 rounded p-2.5">
          <div className="text-lg font-bold text-slate-900">{summary.proposedCount}</div>
          <div className="text-[11px] font-medium text-slate-500">Proposed Controls</div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded p-2.5">
          <div className="text-lg font-bold text-emerald-700">{summary.approvedCount}</div>
          <div className="text-[11px] font-medium text-slate-500">Approved Controls</div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded p-2.5">
          <div
            className={`text-lg font-bold ${
              summary.uncoveredComponentsCount > 0 ? 'text-rose-600' : 'text-emerald-700'
            }`}
          >
            {summary.uncoveredComponentsCount}
          </div>
          <div className="text-[11px] font-medium text-slate-500">Uncovered Components</div>
        </div>
      </div>

      {/* Decision-Support Non-Certification Disclaimer */}
      <div className="p-2 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span>
          <strong className="font-semibold text-slate-700">Decision-Support Boundary:</strong> Mapping approval establishes traceable linkage between obligations and internal controls. It does not certify legal compliance or guarantee operational control effectiveness.
        </span>
      </div>
    </div>
  );
};
