import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { DATA_DICTIONARY, SYNTHETIC_SOURCE_LABEL } from '../../data/seedData';
import { BookOpen, X, Info, ShieldAlert, Cpu } from 'lucide-react';

interface DataDictionaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataDictionaryDialog: React.FC<DataDictionaryDialogProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 animate-in fade-in-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 z-50 p-6 max-h-[88vh] overflow-y-auto animate-in zoom-in-95 duration-150 focus:outline-none"
          aria-describedby="dict-dialog-desc"
        >
          <div className="flex items-start justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-teal-50 border border-teal-200 rounded-lg text-teal-800">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <Dialog.Title className="text-base font-bold text-slate-900">
                  Compliance Data Dictionary &amp; Logic Specification
                </Dialog.Title>
                <div className="text-xs text-slate-500 mt-0.5">
                  RegulaTrace AI Architectural Definitions &amp; Scoring Heuristics
                </div>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close data dictionary dialog"
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <div id="dict-dialog-desc" className="py-4 space-y-4 text-xs">
            {/* Synthetic notice */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Notice of Synthetic Regulatory Corpus:</strong> {SYNTHETIC_SOURCE_LABEL}
              </div>
            </div>

            {/* Heuristic Formula */}
            <div className="p-3.5 bg-slate-900 text-slate-100 rounded-lg">
              <div className="flex items-center gap-2 font-semibold text-teal-300 mb-1.5">
                <Cpu className="w-4 h-4" />
                <span>Candidate Match Scoring Formula (0–100 Scale)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed mb-2">
                Candidate alignments are calculated deterministically across four objective criteria:
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-200">
                <div className="bg-slate-800/80 p-2 rounded">
                  <span className="text-teal-400 font-bold">1. Component Overlap (50 pts):</span> Granular evaluation of obligation requirement components.
                </div>
                <div className="bg-slate-800/80 p-2 rounded">
                  <span className="text-teal-400 font-bold">2. Process Alignment (25 pts):</span> Functional domain &amp; supervisory scope similarity.
                </div>
                <div className="bg-slate-800/80 p-2 rounded">
                  <span className="text-teal-400 font-bold">3. Frequency &amp; Cadence (15 pts):</span> Cadence compatibility (e.g. quarterly vs annual).
                </div>
                <div className="bg-slate-800/80 p-2 rounded">
                  <span className="text-teal-400 font-bold">4. Supporting Metadata (10 pts):</span> Design effectiveness &amp; evidence readiness.
                </div>
              </div>
            </div>

            {/* Dictionary Table */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Core Domain Terminology</h4>
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden">
                {DATA_DICTIONARY.map((entry) => (
                  <div key={entry.term} className="p-3 bg-white">
                    <div className="font-semibold text-slate-900 text-xs mb-1">
                      {entry.term}
                    </div>
                    <div className="text-slate-600 text-xs leading-relaxed mb-1.5">
                      {entry.definition}
                    </div>
                    <div className="text-[11px] text-teal-800 font-mono bg-teal-50/60 p-1.5 rounded border border-teal-100">
                      <strong>Seed Example:</strong> {entry.example}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
