import React, { useMemo } from 'react';
import {
  RegulatoryObligation,
  ControlMapping,
  MappingFilterState,
} from '../../types';
import { Search, Filter, RotateCcw, Check, ChevronRight } from 'lucide-react';

interface ObligationExplorerProps {
  obligations: RegulatoryObligation[];
  mappings: ControlMapping[];
  selectedObligationId: string | null;
  onSelectObligation: (id: string) => void;
  filterState: MappingFilterState;
  onFilterChange: (updates: Partial<MappingFilterState>) => void;
  onClearFilters: () => void;
}

export const ObligationExplorer: React.FC<ObligationExplorerProps> = ({
  obligations,
  mappings,
  selectedObligationId,
  onSelectObligation,
  filterState,
  onFilterChange,
  onClearFilters,
}) => {
  // Extract distinct filter values
  const regulations = useMemo(
    () => Array.from(new Set(obligations.map((o) => o.regulationName))).sort(),
    [obligations]
  );
  const businessFunctions = useMemo(
    () => Array.from(new Set(obligations.map((o) => o.businessFunction))).sort(),
    [obligations]
  );

  // Compute status helpers per obligation
  const getObligationStatus = (oblId: string) => {
    const obMappings = mappings.filter((m) => m.obligationId === oblId && m.active);
    const approved = obMappings.filter((m) => m.status === 'Approved');
    const hasPending = obMappings.some((m) =>
      ['Pending Review', 'Draft', 'Suggested', 'Needs Information'].includes(m.status)
    );

    let mappingStatus = 'Unmapped';
    if (approved.length > 0) {
      mappingStatus = 'Approved Mapping';
    } else if (obMappings.some((m) => m.status === 'Suggested' || m.status === 'Draft')) {
      mappingStatus = 'Partial Coverage';
    } else if (obMappings.length > 0) {
      mappingStatus = 'Mapped';
    }

    let reviewStatus = 'Not Started';
    if (approved.length > 0) {
      reviewStatus = 'Approved';
    } else if (obMappings.some((m) => m.status === 'Pending Review')) {
      reviewStatus = 'Pending Review';
    } else if (obMappings.some((m) => m.status === 'Needs Information')) {
      reviewStatus = 'Needs Info';
    } else if (obMappings.some((m) => m.status === 'Draft')) {
      reviewStatus = 'In Draft';
    } else if (obMappings.some((m) => m.status === 'Suggested')) {
      reviewStatus = 'Suggested';
    }

    return { mappingStatus, reviewStatus, hasApproved: approved.length > 0, hasPending };
  };

  // Filtered list
  const filteredObligations = useMemo(() => {
    const q = filterState.searchQuery.trim().toLowerCase();

    return obligations.filter((obl) => {
      // Search text
      if (q) {
        const matchId = obl.id.toLowerCase().includes(q);
        const matchTitle = obl.title.toLowerCase().includes(q);
        const matchReq = obl.normalizedRequirement.toLowerCase().includes(q);
        const matchReg = obl.regulationName.toLowerCase().includes(q);
        const matchSec = obl.sourceSection.toLowerCase().includes(q);
        if (!matchId && !matchTitle && !matchReq && !matchReg && !matchSec) {
          return false;
        }
      }

      // Regulation filter
      if (filterState.regulation && obl.regulationName !== filterState.regulation) {
        return false;
      }

      // Applicability filter
      if (filterState.applicability && obl.applicabilityStatus !== filterState.applicability) {
        return false;
      }

      // Business function filter
      if (filterState.businessFunction && obl.businessFunction !== filterState.businessFunction) {
        return false;
      }

      const status = getObligationStatus(obl.id);

      // Mapping status filter
      if (filterState.mappingStatus) {
        if (filterState.mappingStatus === 'Unmapped' && status.mappingStatus !== 'Unmapped') return false;
        if (filterState.mappingStatus === 'Approved' && !status.hasApproved) return false;
        if (filterState.mappingStatus === 'Partial' && status.mappingStatus !== 'Partial Coverage') return false;
      }

      // Review status filter
      if (filterState.reviewStatus) {
        if (filterState.reviewStatus === 'Pending' && !status.hasPending) return false;
        if (filterState.reviewStatus === 'Approved' && !status.hasApproved) return false;
        if (filterState.reviewStatus === 'NeedsInfo' && status.reviewStatus !== 'Needs Info') return false;
      }

      return true;
    });
  }, [obligations, mappings, filterState]);

  const hasActiveFilters =
    filterState.searchQuery.trim() !== '' ||
    filterState.regulation !== '' ||
    filterState.applicability !== '' ||
    filterState.mappingStatus !== '' ||
    filterState.reviewStatus !== '' ||
    filterState.businessFunction !== '';

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-semibold text-slate-900">
            Regulatory Obligations
          </h2>
          <span className="text-xs font-medium text-slate-500">
            {filteredObligations.length} of {obligations.length} records
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          Select a requirement to review its control coverage.
        </p>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterState.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Search ID, obligation, regulation, or clause..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 text-slate-900 placeholder:text-slate-400"
            aria-label="Search regulatory obligations"
          />
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label htmlFor="filter-regulation" className="block text-[11px] font-medium text-slate-600 mb-0.5">
              Regulation
            </label>
            <select
              id="filter-regulation"
              value={filterState.regulation}
              onChange={(e) => onFilterChange({ regulation: e.target.value })}
              className="w-full py-1 px-2 rounded border border-slate-200 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-teal-600"
            >
              <option value="">All Regulations</option>
              {regulations.map((reg) => (
                <option key={reg} value={reg}>
                  {reg}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-applicability" className="block text-[11px] font-medium text-slate-600 mb-0.5">
              Applicability
            </label>
            <select
              id="filter-applicability"
              value={filterState.applicability}
              onChange={(e) => onFilterChange({ applicability: e.target.value })}
              className="w-full py-1 px-2 rounded border border-slate-200 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-teal-600"
            >
              <option value="">All Statuses</option>
              <option value="Applicable">Applicable</option>
              <option value="Conditionally Applicable">Conditionally Applicable</option>
              <option value="Not Applicable">Not Applicable</option>
              <option value="Under Review">Under Review</option>
            </select>
          </div>

          <div>
            <label htmlFor="filter-mapping" className="block text-[11px] font-medium text-slate-600 mb-0.5">
              Mapping Status
            </label>
            <select
              id="filter-mapping"
              value={filterState.mappingStatus}
              onChange={(e) => onFilterChange({ mappingStatus: e.target.value })}
              className="w-full py-1 px-2 rounded border border-slate-200 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-teal-600"
            >
              <option value="">All Mappings</option>
              <option value="Approved">Approved Mapping</option>
              <option value="Partial">Partial Coverage</option>
              <option value="Unmapped">Unmapped</option>
            </select>
          </div>

          <div>
            <label htmlFor="filter-function" className="block text-[11px] font-medium text-slate-600 mb-0.5">
              Business Function
            </label>
            <select
              id="filter-function"
              value={filterState.businessFunction}
              onChange={(e) => onFilterChange({ businessFunction: e.target.value })}
              className="w-full py-1 px-2 rounded border border-slate-200 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-teal-600"
            >
              <option value="">All Functions</option>
              {businessFunctions.map((fn) => (
                <option key={fn} value={fn}>
                  {fn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-teal-700 font-medium text-[11px] flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filters active
            </span>
            <button
              type="button"
              onClick={onClearFilters}
              className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded hover:bg-slate-200/60 focus:outline-none"
            >
              <RotateCcw className="w-3 h-3" /> Clear all
            </button>
          </div>
        )}
      </div>

      {/* Table list */}
      <div className="overflow-y-auto flex-1 divide-y divide-slate-100 max-h-[580px]">
        {filteredObligations.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            <p className="font-semibold text-slate-700 mb-1">No obligations match current filters</p>
            <p className="mb-3 text-slate-500">Try broadening your search keywords or resetting filters.</p>
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
            </button>
          </div>
        ) : (
          filteredObligations.map((obl) => {
            const isSelected = selectedObligationId === obl.id;
            const status = getObligationStatus(obl.id);

            return (
              <div
                key={obl.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectObligation(obl.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectObligation(obl.id);
                  }
                }}
                className={`p-3.5 transition-colors cursor-pointer text-left relative focus:outline-none focus:bg-teal-50/40 ${
                  isSelected
                    ? 'bg-teal-50/70 border-l-4 border-l-teal-700'
                    : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                }`}
                aria-selected={isSelected}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      {obl.id}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 truncate max-w-[150px]">
                      {obl.sourceSection}
                    </span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isSelected ? 'text-teal-700 translate-x-0.5' : ''
                    }`}
                  />
                </div>

                <div className="font-medium text-xs text-slate-900 line-clamp-2 mb-1.5 leading-snug">
                  {obl.title}
                </div>

                <div className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                  {obl.regulationName}
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                  {/* Applicability */}
                  <span
                    className={`px-1.5 py-0.5 rounded font-medium ${
                      obl.applicabilityStatus === 'Applicable'
                        ? 'bg-slate-100 text-slate-700 border border-slate-200'
                        : obl.applicabilityStatus === 'Conditionally Applicable'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {obl.applicabilityStatus}
                  </span>

                  {/* Mapping status */}
                  <span
                    className={`px-1.5 py-0.5 rounded font-medium ${
                      status.mappingStatus === 'Approved Mapping'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : status.mappingStatus === 'Partial Coverage'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {status.mappingStatus}
                  </span>

                  {/* Review state */}
                  <span className="px-1.5 py-0.5 rounded font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    {status.reviewStatus}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
