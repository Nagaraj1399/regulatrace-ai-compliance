import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  RegulatoryObligation,
  InternalControl,
  ControlMapping,
  AuditEvent,
  MappingFilterState,
  CoverageAssessment,
} from '../../types';
import { mappingService, CURRENT_ANALYST } from '../../services/mappingService';
import { repository, AppState } from '../../services/storage';
import { SummaryMetrics } from './SummaryMetrics';
import { ObligationExplorer } from './ObligationExplorer';
import { ObligationDetails } from './ObligationDetails';
import { CoverageSummary } from './CoverageSummary';
import { CandidateControlList } from './CandidateControlList';
import { MappingActivity } from './MappingActivity';
import { useToast } from '../common/Toast';
import { ShieldCheck, Sliders, AlertCircle, Sparkles } from 'lucide-react';

interface MappingWorkbenchProps {
  initialState?: AppState;
}

export const MappingWorkbench: React.FC<MappingWorkbenchProps> = ({ initialState }) => {
  const { showToast } = useToast();

  const [state, setState] = useState<AppState>(() => {
    return initialState || mappingService.getState();
  });

  const [selectedObligationId, setSelectedObligationId] = useState<string>(
    state.obligations[0]?.id || ''
  );

  const [filterState, setFilterState] = useState<MappingFilterState>({
    searchQuery: '',
    regulation: '',
    applicability: '',
    mappingStatus: '',
    reviewStatus: '',
    businessFunction: '',
  });

  const [activeMetricFilter, setActiveMetricFilter] = useState<string | null>(null);

  // Sync state if initial state changes in testing
  useEffect(() => {
    if (initialState) {
      setState(initialState);
      if (initialState.obligations[0]) {
        setSelectedObligationId(initialState.obligations[0].id);
      }
    }
  }, [initialState]);

  // Derived metrics
  const summaryMetrics = useMemo(() => {
    return mappingService.calculateSummaryMetrics(state);
  }, [state]);

  // Selected obligation record
  const selectedObligation = useMemo(() => {
    return state.obligations.find((o) => o.id === selectedObligationId) || null;
  }, [state.obligations, selectedObligationId]);

  // Handle metric click filter
  const handleSelectMetricFilter = (key: 'all' | 'pending' | 'approved' | 'unmapped') => {
    if (activeMetricFilter === key) {
      // Toggle off
      setActiveMetricFilter(null);
      setFilterState((prev) => ({
        ...prev,
        mappingStatus: '',
        reviewStatus: '',
        applicability: '',
      }));
      return;
    }

    setActiveMetricFilter(key);
    switch (key) {
      case 'all':
        setFilterState((prev) => ({
          ...prev,
          mappingStatus: '',
          reviewStatus: '',
          applicability: '',
        }));
        break;
      case 'pending':
        setFilterState((prev) => ({
          ...prev,
          reviewStatus: 'Pending',
          mappingStatus: '',
          applicability: '',
        }));
        break;
      case 'approved':
        setFilterState((prev) => ({
          ...prev,
          mappingStatus: 'Approved',
          reviewStatus: '',
          applicability: '',
        }));
        break;
      case 'unmapped':
        setFilterState((prev) => ({
          ...prev,
          mappingStatus: 'Unmapped',
          applicability: 'Applicable',
          reviewStatus: '',
        }));
        break;
    }
  };

  const handleFilterChange = (updates: Partial<MappingFilterState>) => {
    setActiveMetricFilter(null);
    setFilterState((prev) => ({ ...prev, ...updates }));
  };

  const handleClearFilters = () => {
    setActiveMetricFilter(null);
    setFilterState({
      searchQuery: '',
      regulation: '',
      applicability: '',
      mappingStatus: '',
      reviewStatus: '',
      businessFunction: '',
    });
  };

  // Actions
  const handleApproveMapping = async (data: {
    mappingId: string;
    reviewerRationale: string;
    reviewerNotes?: string;
    coverageAssessments: CoverageAssessment[];
  }) => {
    try {
      const next = mappingService.approveMapping(data);
      setState(next);
      showToast({
        type: 'success',
        title: 'Mapping Decision Approved',
        message: `Control mapping relationship for ${data.mappingId} has been successfully recorded and approved.`,
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Approval Failed',
        message: err?.message || 'Storage error while saving approval.',
      });
      throw err;
    }
  };

  const handleRejectMapping = async (data: {
    mappingId: string;
    rejectionReason: string;
    reviewerNotes?: string;
  }) => {
    try {
      const next = mappingService.rejectMapping(data);
      setState(next);
      showToast({
        type: 'warning',
        title: 'Mapping Rejected',
        message: `Candidate mapping ${data.mappingId} has been marked as Rejected and excluded from active coverage.`,
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Rejection Failed',
        message: err?.message || 'Storage error while recording rejection.',
      });
      throw err;
    }
  };

  const handleRequestInfo = async (data: {
    mappingId: string;
    informationRequired: string;
    reason: string;
    requestedResponsibleFunction: string;
    dueDate?: string;
  }) => {
    try {
      const next = mappingService.requestMoreInformation(data);
      setState(next);
      showToast({
        type: 'info',
        title: 'Inquiry Registered',
        message: `Inquiry ticket created for ${data.requestedResponsibleFunction}. Status moved to Needs Information.`,
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Request Failed',
        message: err?.message || 'Storage error while saving inquiry.',
      });
      throw err;
    }
  };

  const handleSaveDraft = async (data: {
    mappingId: string;
    coverageAssessments: CoverageAssessment[];
    reviewerRationale?: string;
    reviewerNotes?: string;
  }) => {
    try {
      const next = mappingService.saveMappingDraft(data);
      setState(next);
      showToast({
        type: 'success',
        title: 'Mapping Draft Saved',
        message: `Draft changes and updated component coverage assessments recorded.`,
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: err?.message || 'Storage error while saving draft.',
      });
      throw err;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Title & Mission */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Obligation Mapping
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>AI Decision Support System</span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          Review regulatory obligations against internal controls, assess coverage, and record traceable compliance decisions.
        </p>
      </div>

      {/* Summary Metrics */}
      <SummaryMetrics
        metrics={summaryMetrics}
        activeFilter={activeMetricFilter}
        onSelectMetricFilter={handleSelectMetricFilter}
      />

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Obligation Explorer (40% / 5 cols) */}
        <div className="lg:col-span-5 h-[760px]">
          <ObligationExplorer
            obligations={state.obligations}
            mappings={state.mappings}
            selectedObligationId={selectedObligationId}
            onSelectObligation={setSelectedObligationId}
            filterState={filterState}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Right Column: Mapping Detail Workspace (60% / 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedObligation ? (
            <>
              {/* Section A: Obligation Details */}
              <ObligationDetails obligation={selectedObligation} />

              {/* Section B: Coverage Summary */}
              <CoverageSummary
                obligation={selectedObligation}
                mappings={state.mappings}
              />

              {/* Section C: Candidate Internal Controls */}
              <CandidateControlList
                obligation={selectedObligation}
                controls={state.controls}
                mappings={state.mappings}
                onApproveMapping={handleApproveMapping}
                onRejectMapping={handleRejectMapping}
                onRequestInfo={handleRequestInfo}
                onSaveDraft={handleSaveDraft}
              />

              {/* Collapsible Mapping Activity / Audit Timeline */}
              <MappingActivity
                obligationId={selectedObligation.id}
                auditEvents={state.auditEvents}
              />
            </>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center text-slate-500">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-800 text-sm mb-1">
                No Obligation Selected
              </h3>
              <p className="text-xs text-slate-500">
                Choose a regulatory obligation from the left explorer table to review its candidate internal controls and assess component coverage.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
