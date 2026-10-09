import React, { useState } from 'react';
import { RegulatoryObligation } from '../../types';
import { BookOpen, ExternalLink, ShieldAlert, Calendar, Building, Layers } from 'lucide-react';
import { SourceViewDialog } from './SourceViewDialog';
import { SYNTHETIC_SOURCE_LABEL } from '../../data/seedData';

interface ObligationDetailsProps {
  obligation: RegulatoryObligation;
}

export const ObligationDetails: React.FC<ObligationDetailsProps> = ({ obligation }) => {
  const [isSourceDialogOpen, setIsSourceDialogOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 mb-4 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-sm font-bold bg-teal-50 text-teal-900 border border-teal-300 px-2.5 py-1 rounded">
            {obligation.id}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {obligation.regulationName} • {obligation.sourceSection}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
              obligation.applicabilityStatus === 'Applicable'
                ? 'bg-slate-100 text-slate-700 border-slate-300'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}
          >
            {obligation.applicabilityStatus}
          </span>
          <button
            type="button"
            onClick={() => setIsSourceDialogOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>View Source</span>
          </button>
        </div>
      </div>

      {/* Title & Normalized Requirement */}
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900 mb-2">
          {obligation.title}
        </h3>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 leading-relaxed">
          <div className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider mb-1">
            Normalized Requirement Statement
          </div>
          <p className="font-medium text-slate-900">{obligation.normalizedRequirement}</p>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
        <div className="p-2.5 bg-white border border-slate-200 rounded">
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <Building className="w-3 h-3 text-slate-400" /> Business Function
          </div>
          <div className="font-medium text-slate-800 mt-1 truncate">
            {obligation.businessFunction}
          </div>
        </div>

        <div className="p-2.5 bg-white border border-slate-200 rounded">
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <Layers className="w-3 h-3 text-slate-400" /> Jurisdiction
          </div>
          <div className="font-medium text-slate-800 mt-1 truncate">
            {obligation.jurisdiction}
          </div>
        </div>

        <div className="p-2.5 bg-white border border-slate-200 rounded">
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" /> Effective Date
          </div>
          <div className="font-medium text-slate-800 mt-1">
            {obligation.effectiveDate}
          </div>
        </div>

        <div className="p-2.5 bg-white border border-slate-200 rounded">
          <div className="text-[11px] text-slate-500">Source Doc & Page</div>
          <div className="font-medium text-slate-800 mt-1 truncate font-mono text-[11px]">
            {obligation.sourceDocumentId} (p.{obligation.sourcePage || 'N/A'})
          </div>
        </div>
      </div>

      {/* Source Citation Status Callout */}
      <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-md flex items-center justify-between text-xs text-amber-900">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
          <span className="text-[11px]">
            {SYNTHETIC_SOURCE_LABEL}
          </span>
        </div>
        <span className="font-mono text-[11px] font-semibold text-amber-800">
          Status: {obligation.sourceVerificationStatus}
        </span>
      </div>

      {/* Source Dialog */}
      <SourceViewDialog
        obligation={obligation}
        isOpen={isSourceDialogOpen}
        onClose={() => setIsSourceDialogOpen(false)}
      />
    </div>
  );
};
