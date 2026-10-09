import React from 'react';
import {
  RequirementComponent,
  CoverageAssessment,
  CoverageStatus,
} from '../../types';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, FileText } from 'lucide-react';

interface ComponentCoverageTableProps {
  components: RequirementComponent[];
  assessments: CoverageAssessment[];
  isEditable?: boolean;
  onUpdateAssessment?: (
    componentId: string,
    updates: Partial<CoverageAssessment>
  ) => void;
}

export const ComponentCoverageTable: React.FC<ComponentCoverageTableProps> = ({
  components,
  assessments,
  isEditable = false,
  onUpdateAssessment,
}) => {
  const getStatusBadge = (status: CoverageStatus) => {
    switch (status) {
      case 'Supported':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          icon: CheckCircle2,
          label: 'Supported',
        };
      case 'Partially supported':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          icon: AlertTriangle,
          label: 'Partially Supported',
        };
      case 'Not supported':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-300',
          icon: XCircle,
          label: 'Not Supported',
        };
      case 'Unknown':
      default:
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          icon: HelpCircle,
          label: 'Unknown / Unverified',
        };
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-xs">
        <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
          <tr>
            <th scope="col" className="px-3.5 py-2.5 text-left w-1/4">
              Requirement Component
            </th>
            <th scope="col" className="px-3.5 py-2.5 text-left w-1/4">
              Control Evidence / Excerpt
            </th>
            <th scope="col" className="px-3.5 py-2.5 text-left w-1/6">
              Coverage Status
            </th>
            <th scope="col" className="px-3.5 py-2.5 text-left w-1/3">
              Assessment Rationale & Notes
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {components.map((rc) => {
            const assessment = assessments.find(
              (a) => a.requirementComponentId === rc.id
            ) || {
              requirementComponentId: rc.id,
              status: 'Unknown' as CoverageStatus,
              supportingExcerpt: 'No documented assessment found.',
              rationale: 'Pending analyst evaluation.',
              analystReviewed: false,
            };

            const badge = getStatusBadge(assessment.status);
            const Icon = badge.icon;

            return (
              <tr key={rc.id} className="hover:bg-slate-50/60 transition-colors">
                {/* Requirement Component */}
                <td className="px-3.5 py-3 align-top">
                  <div className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                    <span className="font-mono text-[10px] bg-slate-100 px-1 py-0.5 rounded border border-slate-200">
                      {rc.id}
                    </span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      {rc.sourceSection}
                    </span>
                  </div>
                  <div className="text-slate-800 leading-snug">{rc.statement}</div>
                  <div className="mt-1.5 text-[10px] text-slate-500 italic bg-slate-50 p-1.5 rounded border border-slate-100">
                    "{rc.sourceExcerpt}"
                  </div>
                </td>

                {/* Control Evidence / Excerpt */}
                <td className="px-3.5 py-3 align-top">
                  <div className="bg-slate-50/80 p-2 rounded border border-slate-200 text-slate-700 leading-relaxed font-mono text-[11px]">
                    {assessment.supportingExcerpt || (
                      <span className="text-slate-400 italic">No specific excerpt cited</span>
                    )}
                  </div>
                </td>

                {/* Coverage Status */}
                <td className="px-3.5 py-3 align-top">
                  {isEditable && onUpdateAssessment ? (
                    <div>
                      <select
                        aria-label={`Coverage status for ${rc.id}`}
                        value={assessment.status}
                        onChange={(e) =>
                          onUpdateAssessment(rc.id, {
                            status: e.target.value as CoverageStatus,
                            analystReviewed: true,
                          })
                        }
                        className={`w-full py-1.5 px-2 rounded font-semibold text-xs border focus:ring-2 focus:ring-teal-600 focus:outline-none ${badge.bg}`}
                      >
                        <option value="Supported">Supported</option>
                        <option value="Partially supported">Partially supported</option>
                        <option value="Not supported">Not supported</option>
                        <option value="Unknown">Unknown</option>
                      </select>
                      <div className="text-[10px] text-slate-500 mt-1">
                        {assessment.status === 'Supported' && 'Explicit evidence confirmed'}
                        {assessment.status === 'Partially supported' && 'Incomplete operational scope'}
                        {assessment.status === 'Not supported' && 'Explicitly absent from control'}
                        {assessment.status === 'Unknown' && 'Insufficient metadata found'}
                      </div>
                    </div>
                  ) : (
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold border ${badge.bg}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{badge.label}</span>
                    </span>
                  )}
                </td>

                {/* Rationale & Notes */}
                <td className="px-3.5 py-3 align-top">
                  {isEditable && onUpdateAssessment ? (
                    <div className="space-y-1.5">
                      <textarea
                        rows={2}
                        value={assessment.rationale}
                        onChange={(e) =>
                          onUpdateAssessment(rc.id, {
                            rationale: e.target.value,
                            analystReviewed: true,
                          })
                        }
                        placeholder="Provide rationale for coverage status..."
                        aria-label={`Rationale for ${rc.id}`}
                        className="w-full p-1.5 text-xs rounded border border-slate-300 text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                      />
                      {assessment.status !== 'Supported' && (
                        <div className="text-[10px] text-amber-700 font-medium">
                          Note required: explain specific gap, uncertainty, or missing documentation.
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="text-slate-800 leading-relaxed">
                        {assessment.rationale}
                      </div>
                      {assessment.reviewerNote && (
                        <div className="mt-1.5 text-[11px] text-teal-800 bg-teal-50/70 p-1.5 rounded border border-teal-200">
                          <strong className="font-semibold">Reviewer Note: </strong>
                          {assessment.reviewerNote}
                        </div>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
