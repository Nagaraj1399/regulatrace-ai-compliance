import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  RegulatoryObligation,
  InternalControl,
  ControlMapping,
  CoverageAssessment,
  CoverageStatus,
  ApprovalSchema,
} from '../../types';
import { ComponentCoverageTable } from './ComponentCoverageTable';
import { RejectMappingDialog } from './RejectMappingDialog';
import { RequestInfoDialog } from './RequestInfoDialog';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShieldAlert,
  ArrowRight,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';
import { SYNTHETIC_SOURCE_LABEL } from '../../data/seedData';

interface MappingReviewDialogProps {
  obligation: RegulatoryObligation | null;
  control: InternalControl | null;
  mapping: ControlMapping | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (data: {
    mappingId: string;
    reviewerRationale: string;
    reviewerNotes?: string;
    coverageAssessments: CoverageAssessment[];
  }) => Promise<void>;
  onReject: (data: {
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

export const MappingReviewDialog: React.FC<MappingReviewDialogProps> = ({
  obligation,
  control,
  mapping,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onRequestInfo,
  onSaveDraft,
}) => {
  const [assessments, setAssessments] = useState<CoverageAssessment[]>([]);
  const [reviewerRationale, setReviewerRationale] = useState('');
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [acknowledgedGaps, setAcknowledgedGaps] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sub-dialog states
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isRequestInfoOpen, setIsRequestInfoOpen] = useState(false);

  useEffect(() => {
    if (mapping) {
      setAssessments(JSON.parse(JSON.stringify(mapping.coverageAssessments)));
      setReviewerRationale(mapping.reviewerRationale || '');
      setReviewerNotes(mapping.reviewerNotes || '');
      setAcknowledgedGaps(false);
      setErrorMessage(null);
    }
  }, [mapping, isOpen]);

  if (!obligation || !control || !mapping) return null;

  const hasGaps = assessments.some(
    (a) => a.status === 'Not supported' || a.status === 'Unknown' || a.status === 'Partially supported'
  );

  const handleUpdateAssessment = (
    componentId: string,
    updates: Partial<CoverageAssessment>
  ) => {
    setAssessments((prev) =>
      prev.map((a) => (a.requirementComponentId === componentId ? { ...a, ...updates } : a))
    );
  };

  const handleApprove = async () => {
    setErrorMessage(null);

    const validation = ApprovalSchema.safeParse({
      reviewerRationale,
      reviewerNotes,
      acknowledgedGaps,
    });

    if (!validation.success) {
      const firstErr = validation.error.issues?.[0]?.message;
      setErrorMessage(firstErr || 'Validation failed.');
      return;
    }

    if (hasGaps && !acknowledgedGaps) {
      setErrorMessage(
        'You must acknowledge that uncovered or unknown components exist before approving this mapping.'
      );
      return;
    }

    try {
      setIsSaving(true);
      await onApprove({
        mappingId: mapping.id,
        reviewerRationale: reviewerRationale.trim(),
        reviewerNotes: reviewerNotes.trim() || undefined,
        coverageAssessments: assessments,
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to approve mapping due to a repository error.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    setErrorMessage(null);
    try {
      setIsSaving(true);
      await onSaveDraft({
        mappingId: mapping.id,
        coverageAssessments: assessments,
        reviewerRationale: reviewerRationale.trim() || undefined,
        reviewerNotes: reviewerNotes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save draft.');
    } finally {
      setIsSaving(false);
    }
  };

  const isAlreadyApproved = mapping.status === 'Approved';

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={(open) => !open && !isSaving && onClose()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 animate-in fade-in-0" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-slate-200 z-50 p-6 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150 focus:outline-none"
            aria-describedby="review-dialog-desc"
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-50 border border-teal-200 rounded-lg text-teal-800">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <Dialog.Title className="text-base font-bold text-slate-900">
                    Review Obligation-to-Control Mapping
                  </Dialog.Title>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 font-mono">
                    <span>Obligation: {obligation.id}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span>Control: {control.id}</span>
                    <span className="text-slate-300">•</span>
                    <span>Mapping ID: {mapping.id} (v{mapping.version})</span>
                  </div>
                </div>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSaving}
                  aria-label="Close dialog"
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>

            <div id="review-dialog-desc" className="py-4 space-y-4 text-xs">
              {/* Alert / Supersede Warning */}
              {isAlreadyApproved && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg flex items-start gap-2.5 text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block">Active Approved Mapping Being Modified</strong>
                    <span className="text-[11px] leading-relaxed">
                      This mapping is currently active and approved. Saving edits or updating component coverage will mark the previous version as <strong>Superseded</strong> in the audit trail, and require formal re-approval.
                    </span>
                  </div>
                </div>
              )}

              {/* Status and Match Score Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div>
                  <div className="text-[11px] font-medium text-slate-500">Current Mapping Status</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-xs px-2.5 py-0.5 rounded bg-white text-slate-800 border border-slate-200">
                      {mapping.status}
                    </span>
                    {mapping.reviewedBy && (
                      <span className="text-[10px] text-slate-500">
                        by {mapping.reviewedBy}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-medium text-slate-500">Candidate Match Score</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-base font-bold text-teal-800 font-mono">
                      {mapping.matchScore}/100
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-100/70 text-teal-900 border border-teal-200">
                      {mapping.matchProvider}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-medium text-slate-500">Score Breakdown (Weights)</div>
                  <div className="text-[10px] text-slate-600 mt-1 font-mono grid grid-cols-2 gap-x-2">
                    <span>Overlap: {mapping.matchRationale.scoreBreakdown?.componentOverlap ?? 35}/50</span>
                    <span>Process: {mapping.matchRationale.scoreBreakdown?.processAlignment ?? 20}/25</span>
                    <span>Cadence: {mapping.matchRationale.scoreBreakdown?.frequencyOwnerAlignment ?? 12}/15</span>
                    <span>Meta: {mapping.matchRationale.scoreBreakdown?.metadataAlignment ?? 8}/10</span>
                  </div>
                </div>
              </div>

              {/* Rationale & Gaps Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-lg">
                  <div className="font-semibold text-emerald-900 flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Positive Coverage Rationale</span>
                  </div>
                  <p className="text-slate-800 text-[11px] leading-relaxed">
                    {mapping.matchRationale.positiveCoverage}
                  </p>
                </div>

                <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg">
                  <div className="font-semibold text-amber-900 flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                    <span>Identified Gaps & Uncertainty</span>
                  </div>
                  <p className="text-slate-800 text-[11px] leading-relaxed">
                    {mapping.matchRationale.potentialGap}
                  </p>
                </div>
              </div>

              {/* Requirement Component Coverage Table */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                    <span>Requirement Component Coverage Assessment</span>
                    <span className="text-[10px] font-normal text-slate-500">
                      (Adjust statuses and add specific analyst rationales below)
                    </span>
                  </h4>
                </div>
                <ComponentCoverageTable
                  components={obligation.requirementComponents}
                  assessments={assessments}
                  isEditable={true}
                  onUpdateAssessment={handleUpdateAssessment}
                />
              </div>

              {/* Gaps Warning & Acknowledgment Banner */}
              {hasGaps && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-amber-950">
                  <div className="flex items-center gap-2 font-semibold text-xs mb-1">
                    <ShieldAlert className="w-4 h-4 text-amber-700" />
                    <span>Notice of Incomplete Control Coverage</span>
                  </div>
                  <p className="text-[11px] leading-relaxed mb-2.5">
                    One or more requirement components remain unsupported, partially supported, or unknown. Approval records the candidate relationship only and does not declare the obligation compliant.
                  </p>
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={acknowledgedGaps}
                      onChange={(e) => setAcknowledgedGaps(e.target.checked)}
                      className="mt-0.5 rounded border-amber-400 text-teal-700 focus:ring-teal-600"
                    />
                    <span className="text-xs font-semibold text-amber-900">
                      I explicitly acknowledge that residual gaps and unverified components exist in this mapping.
                    </span>
                  </label>
                </div>
              )}

              {/* Reviewer Rationale & Notes Form */}
              <div className="space-y-3 pt-2">
                <div>
                  <label htmlFor="reviewer-rationale-input" className="block font-semibold text-slate-900 mb-1">
                    Reviewer Decision Rationale <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    id="reviewer-rationale-input"
                    rows={2}
                    value={reviewerRationale}
                    onChange={(e) => setReviewerRationale(e.target.value)}
                    placeholder="Provide compliance analyst justification for this mapping decision (minimum 10 characters required for approval)..."
                    className="w-full p-2.5 text-xs rounded border border-slate-300 focus:ring-2 focus:ring-teal-600 text-slate-900"
                  />
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Mandatory for approval. Will be permanently etched in the audit history register.
                  </div>
                </div>

                <div>
                  <label htmlFor="reviewer-notes-input" className="block font-semibold text-slate-900 mb-1">
                    Internal Analyst Notes (Optional)
                  </label>
                  <input
                    id="reviewer-notes-input"
                    type="text"
                    value={reviewerNotes}
                    onChange={(e) => setReviewerNotes(e.target.value)}
                    placeholder="Operational reminders, cadence observations, or sampling instructions..."
                    className="w-full p-2 text-xs rounded border border-slate-300 focus:ring-2 focus:ring-teal-600 text-slate-900"
                  />
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div
                  role="alert"
                  className="p-3 bg-rose-50 border border-rose-300 rounded text-rose-800 text-xs font-semibold"
                >
                  {errorMessage}
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsRejectOpen(true)}
                  disabled={isSaving}
                  className="px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
                >
                  Reject Mapping
                </button>
                <button
                  type="button"
                  onClick={() => setIsRequestInfoOpen(true)}
                  disabled={isSaving}
                  className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                >
                  Request Info
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Draft'}
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={isSaving || (hasGaps && !acknowledgedGaps)}
                  className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold rounded-lg transition-colors focus:ring-2 focus:ring-teal-600 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isSaving
                      ? 'Processing...'
                      : isAlreadyApproved
                      ? 'Re-Approve Mapping'
                      : 'Approve Mapping'}
                  </span>
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Reject Confirmation Dialog */}
      <RejectMappingDialog
        mapping={mapping}
        control={control}
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        onConfirmReject={async (reason, notes) => {
          await onReject({
            mappingId: mapping.id,
            rejectionReason: reason,
            reviewerNotes: notes,
          });
          onClose();
        }}
      />

      {/* Request Information Dialog */}
      <RequestInfoDialog
        mapping={mapping}
        control={control}
        isOpen={isRequestInfoOpen}
        onClose={() => setIsRequestInfoOpen(false)}
        onConfirmRequest={async (data) => {
          await onRequestInfo({
            mappingId: mapping.id,
            ...data,
          });
          onClose();
        }}
      />
    </>
  );
};
