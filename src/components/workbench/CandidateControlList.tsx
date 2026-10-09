import React, { useState, useMemo } from 'react';
import {
  RegulatoryObligation,
  InternalControl,
  ControlMapping,
  ControlFilterState,
  CoverageAssessment,
} from '../../types';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Shield,
  Layers,
  Building,
  User,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { MappingReviewDialog } from './MappingReviewDialog';

interface CandidateControlListProps {
  obligation: RegulatoryObligation;
  controls: InternalControl[];
  mappings: ControlMapping[];
  onApproveMapping: (data: {
    mappingId: string;
    reviewerRationale: string;
    reviewerNotes?: string;
    coverageAssessments: CoverageAssessment[];
  }) => Promise<void>;
  onRejectMapping: (data: {
    mappingId: string;
    rejectionReason: string;
    reviewerNotes?: string;
  }) => Promise<void>;
  onRequestInfo: (data: {
    mappingId: string;
    informationRequired: string;
    reason: string;
    requestedResponsibleFunction: string;
    dueDate?: string;
  }) => Promise<void>;
  onSaveDraft: (data: {
    mappingId: string;
    coverageAssessments: CoverageAssessment[];
    reviewerRationale?: string;
    reviewerNotes?: string;
  }) => Promise<void>;
}

export const CandidateControlList: React.FC<CandidateControlListProps> = ({
  obligation,
  controls,
  mappings,
  onApproveMapping,
  onRejectMapping,
  onRequestInfo,
  onSaveDraft,
}) => {
  const [filterState, setFilterState] = useState<ControlFilterState>({
    searchQuery: '',
    ownerRole: '',
    businessFunction: '',
    designStatus: '',
    coverageStatus: '',
  });

  const [selectedReviewMapping, setSelectedReviewMapping] = useState<{
    mapping: ControlMapping;
    control: InternalControl;
  } | null>(null);

  // Mappings for this obligation
  const obligationMappings = useMemo(
    () => mappings.filter((m) => m.obligationId === obligation.id),
    [mappings, obligation.id]
  );

  // Owners and functions lists
  const owners = useMemo(
    () => Array.from(new Set(controls.map((c) => c.ownerRole))).sort(),
    [controls]
  );
  const functions = useMemo(
    () => Array.from(new Set(controls.map((c) => c.businessFunction))).sort(),
    [controls]
  );

  // Candidate control cards combining control metadata with candidate mapping
  const candidateCards = useMemo(() => {
    return obligationMappings
      .map((mapping) => {
        const ctrl = controls.find((c) => c.id === mapping.controlId);
        if (!ctrl) return null;
        return { mapping, control: ctrl };
      })
      .filter((item): item is { mapping: ControlMapping; control: InternalControl } => item !== null)
      .filter(({ mapping, control }) => {
        const q = filterState.searchQuery.trim().toLowerCase();
        if (q) {
          const matchId = control.id.toLowerCase().includes(q);
          const matchName = control.name.toLowerCase().includes(q);
          const matchDesc = control.description.toLowerCase().includes(q);
          const matchOwner = control.ownerRole.toLowerCase().includes(q);
          if (!matchId && !matchName && !matchDesc && !matchOwner) return false;
        }

        if (filterState.ownerRole && control.ownerRole !== filterState.ownerRole) return false;
        if (filterState.businessFunction && control.businessFunction !== filterState.businessFunction) return false;
        if (filterState.designStatus && control.designStatus !== filterState.designStatus) return false;
        if (filterState.coverageStatus && mapping.status !== filterState.coverageStatus) return false;

        return true;
      })
      // Sort by score descending, approved first
      .sort((a, b) => {
        if (a.mapping.status === 'Approved' && b.mapping.status !== 'Approved') return -1;
        if (b.mapping.status === 'Approved' && a.mapping.status !== 'Approved') return 1;
        return b.mapping.matchScore - a.mapping.matchScore;
      });
  }, [obligationMappings, controls, filterState]);

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-200">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <span>Candidate Internal Controls</span>
            <span className="text-xs font-normal text-slate-500">
              ({candidateCards.length} potential matches)
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational controls evaluated against requirement components.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4 text-xs">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterState.searchQuery}
            onChange={(e) => setFilterState((prev) => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="Search candidate controls..."
            className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 placeholder:text-slate-400"
            aria-label="Filter candidate controls"
          />
        </div>

        <div>
          <select
            value={filterState.coverageStatus}
            onChange={(e) => setFilterState((prev) => ({ ...prev, coverageStatus: e.target.value }))}
            className="w-full py-1.5 px-2 rounded border border-slate-300 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-teal-600"
            aria-label="Filter by mapping status"
          >
            <option value="">All Mapping Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Suggested">Suggested</option>
            <option value="Draft">Draft</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Needs Information">Needs Information</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div>
          <select
            value={filterState.designStatus}
            onChange={(e) => setFilterState((prev) => ({ ...prev, designStatus: e.target.value }))}
            className="w-full py-1.5 px-2 rounded border border-slate-300 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-teal-600"
            aria-label="Filter by design effectiveness"
          >
            <option value="">All Design Statuses</option>
            <option value="Design Effective">Design Effective</option>
            <option value="Under Evaluation">Under Evaluation</option>
            <option value="Deficiency Identified">Deficiency Identified</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Candidate Controls List */}
      {candidateCards.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-lg">
          <Shield className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="font-semibold text-slate-700 text-xs mb-1">
            No Candidate Internal Controls Match Criteria
          </p>
          <p className="text-slate-500 text-xs max-w-md mx-auto">
            This regulatory requirement currently has no linked operational controls meeting the selected filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {candidateCards.map(({ mapping, control }) => {
            const isApproved = mapping.status === 'Approved';
            const isRejected = mapping.status === 'Rejected';
            const isNeedsInfo = mapping.status === 'Needs Information';

            return (
              <div
                key={mapping.id}
                className={`rounded-lg border transition-shadow shadow-xs p-4 ${
                  isApproved
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : isRejected
                    ? 'border-slate-200 bg-slate-50/60 opacity-80'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Top Row: Control ID, Match Score, Status Badge */}
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                      {control.id}
                    </span>
                    <span className="font-semibold text-xs text-slate-900">
                      {control.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Candidate Match Score */}
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-900 font-mono text-xs font-bold">
                      <Sparkles className="w-3 h-3 text-teal-700" />
                      <span>{mapping.matchScore}/100</span>
                    </div>

                    {/* Mapping Status Badge */}
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                        isApproved
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : isRejected
                          ? 'bg-rose-50 text-rose-800 border-rose-300'
                          : isNeedsInfo
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      {mapping.status}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  {control.description}
                </p>

                {/* Metadata tags */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-slate-50 p-2.5 rounded border border-slate-100 mb-3 text-slate-600">
                  <div className="truncate">
                    <span className="text-slate-400">Owner:</span>{' '}
                    <strong className="text-slate-700">{control.ownerRole}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Frequency:</span>{' '}
                    <strong className="text-slate-700">{control.frequency}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Design:</span>{' '}
                    <strong className="text-slate-700">{control.designStatus}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Evidence:</span>{' '}
                    <strong className="text-slate-700">{control.evidenceStatus}</strong>
                  </div>
                </div>

                {/* Match Rationale Callout */}
                <div className="space-y-1.5 text-xs mb-3">
                  <div className="text-[11px] bg-emerald-50/50 p-2 rounded border border-emerald-100 text-slate-800 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-emerald-900 font-semibold">Positive Coverage: </strong>
                      {mapping.matchRationale.positiveCoverage}
                    </span>
                  </div>

                  <div className="text-[11px] bg-amber-50/50 p-2 rounded border border-amber-100 text-slate-800 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-amber-900 font-semibold">Identified Gap: </strong>
                      {mapping.matchRationale.potentialGap}
                    </span>
                  </div>
                </div>

                {/* Rejection / Inquiry reason callout if applicable */}
                {mapping.rejectionReason && (
                  <div className="mb-3 text-[11px] bg-rose-50 p-2 rounded border border-rose-200 text-rose-900">
                    <strong className="font-semibold">Rejection Reason: </strong>
                    {mapping.rejectionReason}
                  </div>
                )}

                {mapping.requestedInformation && (
                  <div className="mb-3 text-[11px] bg-blue-50 p-2 rounded border border-blue-200 text-blue-900">
                    <strong className="font-semibold">Inquiry Requested: </strong>
                    {mapping.requestedInformation.informationRequired} (Assigned to {mapping.requestedInformation.requestedResponsibleFunction})
                  </div>
                )}

                {/* Reviewer signature if approved */}
                {mapping.reviewedBy && (
                  <div className="mb-3 text-[11px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-100 pt-1.5">
                    <span>
                      Decision recorded by: <strong>{mapping.reviewedBy}</strong>
                    </span>
                    <span>{mapping.reviewedAt ? new Date(mapping.reviewedAt).toLocaleDateString() : ''}</span>
                  </div>
                )}

                {/* Action button */}
                <div className="flex items-center justify-between pt-1">
                  <div className="text-[10px] text-slate-400 font-mono">
                    Provider: {mapping.matchProvider}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedReviewMapping({ mapping, control })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-300 rounded-md transition-colors focus:ring-2 focus:ring-teal-600"
                  >
                    <span>{isApproved ? 'Inspect / Re-evaluate Mapping' : 'Review Mapping'}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-teal-700" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mapping Review Dialog Modal */}
      {selectedReviewMapping && (
        <MappingReviewDialog
          obligation={obligation}
          control={selectedReviewMapping.control}
          mapping={selectedReviewMapping.mapping}
          isOpen={true}
          onClose={() => setSelectedReviewMapping(null)}
          onApprove={onApproveMapping}
          onReject={onRejectMapping}
          onRequestInfo={onRequestInfo}
          onSaveDraft={onSaveDraft}
        />
      )}
    </div>
  );
};
