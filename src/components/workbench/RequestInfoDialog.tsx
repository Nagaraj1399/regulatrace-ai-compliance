import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ControlMapping, InternalControl, RequestInformationSchema } from '../../types';
import { HelpCircle, X } from 'lucide-react';

interface RequestInfoDialogProps {
  mapping: ControlMapping | null;
  control: InternalControl | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmRequest: (data: {
    informationRequired: string;
    reason: string;
    requestedResponsibleFunction: string;
    dueDate?: string;
  }) => Promise<void>;
}

export const RequestInfoDialog: React.FC<RequestInfoDialogProps> = ({
  mapping,
  control,
  isOpen,
  onClose,
  onConfirmRequest,
}) => {
  const [informationRequired, setInformationRequired] = useState('');
  const [reason, setReason] = useState('');
  const [responsibleFunction, setResponsibleFunction] = useState(
    control?.businessFunction || 'First Line Operations'
  );
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!mapping || !control) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = RequestInformationSchema.safeParse({
      informationRequired,
      reason,
      requestedResponsibleFunction: responsibleFunction,
      dueDate: dueDate || undefined,
    });

    if (!validation.success) {
      setError(validation.error.issues?.[0]?.message || 'Please fill in all required fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirmRequest({
        informationRequired: informationRequired.trim(),
        reason: reason.trim(),
        requestedResponsibleFunction: responsibleFunction.trim(),
        dueDate: dueDate || undefined,
      });
      setInformationRequired('');
      setReason('');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to submit request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 animate-in fade-in-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 z-50 p-6 animate-in zoom-in-95 duration-150 focus:outline-none"
          aria-describedby="request-info-desc"
        >
          <div className="flex items-start justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <Dialog.Title className="text-base font-bold text-slate-900">
                  Request Information for Mapping
                </Dialog.Title>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  Mapping ID: {mapping.id} • Control: {control.id}
                </div>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
            <div id="request-info-desc" className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 leading-relaxed">
              Recording an inquiry changes the mapping status to <strong>Needs Information</strong> and registers an audit inquiry for the responsible operational department.
            </div>

            {error && (
              <div
                role="alert"
                className="p-3 bg-rose-50 border border-rose-300 rounded text-rose-800 text-xs font-medium"
              >
                {error}
              </div>
            )}

            <div>
              <label htmlFor="info-required" className="block font-semibold text-slate-800 mb-1">
                Specific Information / Evidence Required <span className="text-rose-600">*</span>
              </label>
              <textarea
                id="info-required"
                rows={2}
                required
                value={informationRequired}
                onChange={(e) => setInformationRequired(e.target.value)}
                placeholder="Specify missing operational documentation, threshold clarifications, or test sample packs..."
                className="w-full p-2 text-xs rounded border border-slate-300 focus:ring-2 focus:ring-teal-600 text-slate-900"
              />
            </div>

            <div>
              <label htmlFor="info-reason" className="block font-semibold text-slate-800 mb-1">
                Reason for Clarification <span className="text-rose-600">*</span>
              </label>
              <input
                id="info-reason"
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why current control description is ambiguous or insufficient..."
                className="w-full p-2 text-xs rounded border border-slate-300 focus:ring-2 focus:ring-teal-600 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="info-function" className="block font-semibold text-slate-800 mb-1">
                  Responsible Business Unit <span className="text-rose-600">*</span>
                </label>
                <input
                  id="info-function"
                  type="text"
                  required
                  value={responsibleFunction}
                  onChange={(e) => setResponsibleFunction(e.target.value)}
                  className="w-full p-2 text-xs rounded border border-slate-300 focus:ring-2 focus:ring-teal-600 text-slate-900"
                />
              </div>

              <div>
                <label htmlFor="info-due" className="block font-semibold text-slate-800 mb-1">
                  Target Response Due Date (Optional)
                </label>
                <input
                  id="info-due"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-1.5 text-xs rounded border border-slate-300 focus:ring-2 focus:ring-teal-600 text-slate-900"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Save Inquiry'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
