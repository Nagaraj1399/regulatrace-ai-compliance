import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { RegulatoryObligation } from '../../types';
import { X, BookOpen, AlertCircle, FileCheck, ShieldAlert } from 'lucide-react';
import { SYNTHETIC_SOURCE_LABEL } from '../../data/seedData';

interface SourceViewDialogProps {
  obligation: RegulatoryObligation | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SourceViewDialog: React.FC<SourceViewDialogProps> = ({
  obligation,
  isOpen,
  onClose,
}) => {
  if (!obligation) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 animate-in fade-in-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 z-50 p-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150 focus:outline-none"
          aria-describedby="source-dialog-desc"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-50 border border-teal-200 rounded-lg text-teal-800">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <Dialog.Title className="text-base font-bold text-slate-900">
                  Regulatory Source Document Verification
                </Dialog.Title>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  Obligation ID: {obligation.id} • Ref: {obligation.sourceDocumentId}
                </div>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <div id="source-dialog-desc" className="py-4 space-y-4 text-xs">
            {/* Synthetic Citation Notice */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Synthetic Demo Citation</span>
                <span className="text-[11px] text-amber-800 leading-relaxed">
                  {SYNTHETIC_SOURCE_LABEL} This text was generated for mock compliance validation testing and must not be treated as genuine statute or regulatory enforcement precedent.
                </span>
              </div>
            </div>

            {/* Document Citation Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <div>
                <div className="text-[11px] text-slate-500 font-medium">Document ID</div>
                <div className="font-mono font-semibold text-slate-800 mt-0.5">
                  {obligation.sourceDocumentId}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 font-medium">Version</div>
                <div className="font-semibold text-slate-800 mt-0.5">
                  {obligation.sourceDocumentVersion}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 font-medium">Clause / Section</div>
                <div className="font-semibold text-slate-800 mt-0.5">
                  {obligation.sourceSection}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 font-medium">Page Number</div>
                <div className="font-semibold text-slate-800 mt-0.5">
                  {obligation.sourcePage ? `p. ${obligation.sourcePage}` : 'N/A'}
                </div>
              </div>
            </div>

            {/* Regulation Name & Jurisdiction */}
            <div>
              <div className="text-[11px] font-semibold text-slate-700 mb-1">
                Regulation & Jurisdiction
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-slate-800">
                <div className="font-semibold">{obligation.regulationName}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Jurisdiction: {obligation.jurisdiction}
                </div>
              </div>
            </div>

            {/* Original Source Excerpt */}
            <div>
              <div className="text-[11px] font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Original Statutory / Regulatory Excerpt</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Verbatim Store
                </span>
              </div>
              <div className="p-3.5 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs leading-relaxed border border-slate-800 selection:bg-teal-700">
                "{obligation.sourceExcerpt}"
              </div>
            </div>

            {/* Normalized Requirement */}
            <div>
              <div className="text-[11px] font-semibold text-slate-700 mb-1">
                Normalized Compliance Requirement
              </div>
              <div className="p-3 bg-teal-50/60 border border-teal-200 rounded-lg text-slate-800 leading-relaxed">
                {obligation.normalizedRequirement}
              </div>
            </div>

            {/* Source Verification Status */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-slate-500">Source Verification Status</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                {obligation.sourceVerificationStatus}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-700"
            >
              Close Source View
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
