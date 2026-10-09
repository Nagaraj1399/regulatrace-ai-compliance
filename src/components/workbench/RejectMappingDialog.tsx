import React, { useState } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { ControlMapping, InternalControl } from '../../types';
import { AlertCircle, X } from 'lucide-react';
import { RejectionSchema } from '../../types';

interface RejectMappingDialogProps {
  mapping: ControlMapping | null;
  control: InternalControl | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReject: (reason: string, notes?: string) => Promise<void>;
}

export const RejectMappingDialog: React.FC<RejectMappingDialogProps> = ({
  mapping,
  control,
  isOpen,
  onClose,
  onConfirmReject,
}) => {
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!mapping || !control) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = RejectionSchema.safeParse({
      rejectionReason: reason,
      reviewerNotes: notes,
    });

    if (!validation.success) {
      setError(validation.error.issues?.[0]?.message || 'Please provide a valid rejection reason.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirmReject(reason.trim(), notes.trim() || undefined);
      setReason('');
      setNotes('');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to record rejection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 animate-in fade-in-0" />
        <AlertDialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 z-50 p-6 animate-in zoom-in-95 duration-150 focus:outline-none"
          aria-describedby="reject-dialog-desc"
        >
          <div className="flex items-start justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-700">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <AlertDialog.Title className="text-base font-bold text-slate-900">
                  Reject Candidate Control Mapping
                </AlertDialog.Title>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  Mapping: {mapping.id} • Control: {control.id} ({control.name})
                </div>
              </div>
            </div>
            <AlertDialog.Cancel asChild>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cancel rejection"
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </AlertDialog.Cancel>
          </div>

          <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
            <div id="reject-dialog-desc" className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 leading-relaxed">
              <strong>Notice:</strong> Rejecting this candidate mapping will exclude it from active approved compliance coverage calculations. The rejected record and your rationale will be permanently preserved in the audit log.
            </div>

            {error && (
              <div
                role="alert"
                className="p-3 bg-red-50 border border-red-300 rounded text-red-800 text-xs font-medium"
              >
                {error}
              </div>
            )}

            <div>
              <label htmlFor="rejection-reason" className="block font-semibold text-slate-800 mb-1">
                Rejection Reason <span className="text-rose-600">*</span>
              </label>
              <textarea
                id="rejection-reason"
                rows={3}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="State why this control does not satisfy the obligation (e.g., mismatched cadence, lack of escalation, insufficient population scope)..."
                className="w-full p-2.5 text-xs rounded border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-900"
              />
              <span className="text-[11px] text-slate-500">
                Minimum 10 characters required for audit trail validation.
              </span>
            </div>

            <div>
              <label htmlFor="rejection-notes" className="block font-semibold text-slate-800 mb-1">
                Additional Analyst Notes (Optional)
              </label>
              <input
                id="rejection-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Alternative control recommendations or follow-up notes..."
                className="w-full p-2 text-xs rounded border border-slate-300 focus:ring-2 focus:ring-teal-600 text-slate-900"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <AlertDialog.Cancel asChild>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors focus:ring-2 focus:ring-rose-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Recording Rejection...' : 'Confirm Rejection'}
              </button>
            </div>
          </form>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
