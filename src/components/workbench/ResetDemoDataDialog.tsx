import React from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { RotateCcw, AlertTriangle, X } from 'lucide-react';

interface ResetDemoDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
}

export const ResetDemoDataDialog: React.FC<ResetDemoDataDialogProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
}) => {
  return (
    <AlertDialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 animate-in fade-in-0" />
        <AlertDialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 z-50 p-6 animate-in zoom-in-95 duration-150 focus:outline-none"
          aria-describedby="reset-dialog-desc"
        >
          <div className="flex items-start justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-700">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <AlertDialog.Title className="text-base font-bold text-slate-900">
                Reset Prototype Demo Data
              </AlertDialog.Title>
            </div>
            <AlertDialog.Cancel asChild>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cancel reset"
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </AlertDialog.Cancel>
          </div>

          <div id="reset-dialog-desc" className="py-4 space-y-3 text-xs text-slate-600 leading-relaxed">
            <p>
              This action will reset the local storage adapter to the initial deterministic seed records.
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
              <ul className="list-disc pl-4 space-y-1 text-[11px]">
                <li>Restores 8 default obligations &amp; 10 internal controls.</li>
                <li>Restores baseline seed mapping statuses and scores.</li>
                <li>Preserves a system record of this reset in the audit activity log.</li>
                <li>Any unsaved browser drafts will be cleared.</li>
              </ul>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <AlertDialog.Cancel asChild>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
            </AlertDialog.Cancel>
            <button
              type="button"
              onClick={() => {
                onConfirmReset();
                onClose();
              }}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors focus:ring-2 focus:ring-amber-500 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Confirm &amp; Reset to Seed</span>
            </button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
