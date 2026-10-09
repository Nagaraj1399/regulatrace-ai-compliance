import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  Sliders,
  History,
  BookOpen,
  Database,
  Building2,
  Download,
  RotateCcw,
  HelpCircle,
  Bug,
  CheckCircle,
  User,
  ExternalLink,
} from 'lucide-react';
import { ORGANIZATION_NAME, ORGANIZATION_DISCLAIMER } from '../../data/seedData';
import { CURRENT_ANALYST } from '../../services/mappingService';
import { ResetDemoDataDialog } from '../workbench/ResetDemoDataDialog';
import { DataDictionaryDialog } from '../workbench/DataDictionaryDialog';

interface AppShellProps {
  children: React.ReactNode;
  onExportCsv: () => void;
  onResetSeedData: () => void;
  isSimulatingError: boolean;
  onToggleSimulateError: (enabled: boolean) => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  onExportCsv,
  onResetSeedData,
  isSimulatingError,
  onToggleSimulateError,
}) => {
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isDictDialogOpen, setIsDictDialogOpen] = useState(false);

  const navItems = [
    { name: 'Overview', icon: Building2, available: false },
    { name: 'Regulatory Library', icon: BookOpen, available: false },
    { name: 'Obligation Mapping', icon: Sliders, available: true, active: true },
    { name: 'Control Framework', icon: Database, available: false },
    { name: 'Audit History', icon: History, available: false },
  ];

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-[#17263C] flex flex-col lg:flex-row antialiased">
      {/* Fixed Sidebar */}
      <aside className="w-full lg:w-[248px] bg-[#122238] text-white shrink-0 flex flex-col justify-between p-4 border-r border-slate-800 lg:min-h-screen">
        <div>
          {/* Logo & Product Brand */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
            <div className="p-2 bg-teal-600/30 border border-teal-500/50 rounded-lg text-teal-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                <span>RegulaTrace</span>
                <span className="text-teal-400 font-mono text-xs font-semibold px-1 py-0.5 rounded bg-teal-950/80 border border-teal-800">
                  AI
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Regulatory Intelligence
              </div>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="mt-6">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              Compliance Workspace
            </div>
            <nav className="space-y-1" aria-label="Sidebar Navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                if (!item.available) {
                  return (
                    <div
                      key={item.name}
                      className="flex items-center justify-between px-3 py-2 rounded text-xs font-medium text-slate-500 cursor-not-allowed select-none opacity-60"
                      title="Module not in MVP feature scope"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-slate-600" />
                        <span>{item.name}</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 uppercase bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        Prototype
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={item.name}
                    aria-current="page"
                    className="flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold bg-teal-800/80 text-white border border-teal-600/60 shadow-xs"
                  >
                    <Icon className="w-4 h-4 text-teal-300" />
                    <span>{item.name}</span>
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Sidebar Info */}
        <div className="pt-6 border-t border-slate-800 space-y-3 mt-6 lg:mt-0 text-xs">
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
            <div className="text-[10px] font-semibold text-teal-400 uppercase tracking-wider mb-0.5">
              Current Demo User
            </div>
            <div className="font-medium text-slate-200 text-xs flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>{CURRENT_ANALYST.displayName}</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 leading-tight">
            <span className="font-semibold text-slate-300">{ORGANIZATION_NAME}</span>
            <div className="text-slate-400 mt-0.5">{ORGANIZATION_DISCLAIMER}</div>
          </div>
        </div>
      </aside>

      {/* Main Body Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 shrink-0 flex flex-wrap items-center justify-between gap-4">
          {/* Breadcrumbs & Organization */}
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500 font-medium">Compliance Workspace</span>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-900">Obligation Mapping</span>
            <span className="text-slate-300">•</span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{ORGANIZATION_NAME}</span>
            </div>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-2">
            {/* Simulation error toggle for Test 18 */}
            <button
              type="button"
              onClick={() => onToggleSimulateError(!isSimulatingError)}
              title="Toggle simulated storage write failures for testing error resilience"
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium border transition-colors ${
                isSimulatingError
                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Bug className="w-3.5 h-3.5" />
              <span>{isSimulatingError ? 'Storage Error Active' : 'Simulate Error'}</span>
            </button>

            {/* Data Dictionary / Documentation */}
            <button
              type="button"
              onClick={() => setIsDictDialogOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Data Dictionary</span>
            </button>

            {/* Reset Demo Data */}
            <button
              type="button"
              onClick={() => setIsResetDialogOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>

            {/* Export Register CSV */}
            <button
              type="button"
              onClick={onExportCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 transition-colors shadow-xs focus:ring-2 focus:ring-teal-600"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Register</span>
            </button>
          </div>
        </header>

        {/* Page Main Content with padding */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Reset Confirmation Dialog */}
      <ResetDemoDataDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirmReset={onResetSeedData}
      />

      {/* Data Dictionary Dialog */}
      <DataDictionaryDialog
        isOpen={isDictDialogOpen}
        onClose={() => setIsDictDialogOpen(false)}
      />
    </div>
  );
};
