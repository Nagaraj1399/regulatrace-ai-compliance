import React, { useState } from 'react';
import { AuditEvent } from '../../types';
import { History, ChevronDown, ChevronUp, ShieldCheck, UserCheck, AlertCircle, FileEdit } from 'lucide-react';

interface MappingActivityProps {
  obligationId: string;
  auditEvents: AuditEvent[];
}

export const MappingActivity: React.FC<MappingActivityProps> = ({
  obligationId,
  auditEvents,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Filter events relevant to this obligation or global system reset events
  const relevantEvents = auditEvents
    .filter(
      (e) =>
        e.relatedRecordIds?.includes(obligationId) ||
        e.entityId === obligationId ||
        e.action === 'Demo data reset'
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'Mapping approved':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Mapping rejected':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      case 'Information requested':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'Mapping superseded':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Demo data reset':
        return 'bg-purple-50 text-purple-800 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden mt-4">
      {/* Header toggle */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-slate-600" />
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
            Traceable Mapping Audit Activity
          </h3>
          <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
            {relevantEvents.length} events
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-[11px] text-slate-500">
            {isExpanded ? 'Collapse' : 'Expand'}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 pt-1 border-t border-slate-100">
          <div className="mb-3 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-200 leading-relaxed">
            <strong>Audit Integrity Note:</strong> Application-level append-only timeline. Each transition, approval rationale, and component reassessment is recorded with immutable timestamps and analyst attribution.
          </div>

          {relevantEvents.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 italic">
              No historical activity logged for this obligation yet.
            </div>
          ) : (
            <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {relevantEvents.map((event) => (
                <div key={event.id} className="relative group text-xs">
                  {/* Timeline dot */}
                  <div className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full bg-slate-400 border-2 border-white ring-1 ring-slate-300" />

                  <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-200">
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getActionBadgeColor(
                            event.action
                          )}`}
                        >
                          {event.action}
                        </span>
                        <span className="font-mono text-[11px] text-slate-600 font-semibold">
                          {event.entityId}
                        </span>
                      </div>
                      <time
                        dateTime={event.timestamp}
                        className="text-[11px] font-mono text-slate-400"
                        title={event.timestamp}
                      >
                        {new Date(event.timestamp).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </time>
                    </div>

                    {/* Actor */}
                    <div className="text-[11px] text-slate-600 mb-1 flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-slate-400" />
                      <span>Actor: <strong className="text-slate-800">{event.actorDisplayName}</strong></span>
                    </div>

                    {/* State transition if applicable */}
                    {event.previousState && event.newState && (
                      <div className="text-[11px] text-slate-500 mb-1.5 font-mono">
                        Status Transition: {event.previousState} → <strong className="text-slate-900">{event.newState}</strong>
                      </div>
                    )}

                    {/* Reason / Rationale */}
                    {event.reason && (
                      <div className="text-xs text-slate-800 bg-white p-2 rounded border border-slate-200 leading-relaxed font-sans">
                        "{event.reason}"
                      </div>
                    )}

                    {/* Related record IDs */}
                    {event.relatedRecordIds && event.relatedRecordIds.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1 text-[10px] font-mono text-slate-500">
                        <span>Related:</span>
                        {event.relatedRecordIds.map((recId) => (
                          <span key={recId} className="bg-slate-200/60 px-1 rounded text-slate-700">
                            {recId}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
