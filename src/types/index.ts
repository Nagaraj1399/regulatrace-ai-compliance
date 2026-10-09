import { z } from 'zod';

export type ApplicabilityStatus =
  | 'Applicable'
  | 'Conditionally Applicable'
  | 'Not Applicable'
  | 'Under Review';

export type SourceVerificationStatus =
  | 'Synthetic Demo'
  | 'Verified Document'
  | 'Pending Verification';

export type DesignStatus =
  | 'Design Effective'
  | 'Deficiency Identified'
  | 'Under Evaluation'
  | 'Draft';

export type EvidenceStatus =
  | 'Evidence Available'
  | 'Evidence Pending'
  | 'Insufficient Evidence';

export type CoverageStatus =
  | 'Supported'
  | 'Partially supported'
  | 'Not supported'
  | 'Unknown';

export type MappingStatus =
  | 'Suggested'
  | 'Draft'
  | 'Pending Review'
  | 'Needs Information'
  | 'Approved'
  | 'Rejected'
  | 'Superseded';

export type AuditAction =
  | 'Mapping suggestion created'
  | 'Mapping draft saved'
  | 'Coverage updated'
  | 'Mapping submitted for review'
  | 'Mapping approved'
  | 'Mapping rejected'
  | 'Information requested'
  | 'Mapping superseded'
  | 'Demo data reset';

export interface RequirementComponent {
  id: string;
  obligationId: string;
  statement: string;
  sourceExcerpt: string;
  sourceSection: string;
}

export interface RegulatoryObligation {
  id: string;
  title: string;
  normalizedRequirement: string;
  regulationName: string;
  sourceDocumentId: string;
  sourceDocumentVersion: string;
  sourceSection: string;
  sourcePage?: number | string;
  sourceExcerpt: string;
  jurisdiction: string;
  businessFunction: string;
  applicabilityStatus: ApplicabilityStatus;
  effectiveDate: string;
  sourceVerificationStatus: SourceVerificationStatus;
  requirementComponents: RequirementComponent[];
  createdAt: string;
  updatedAt: string;
}

export interface InternalControl {
  id: string;
  name: string;
  description: string;
  ownerRole: string;
  frequency: string;
  businessFunction: string;
  designStatus: DesignStatus;
  evidenceStatus: EvidenceStatus;
  sourceDocumentId: string;
  sourceDocumentVersion: string;
  sourceSection: string;
  sourcePage?: number | string;
  sourceExcerpt: string;
  requirementComponentsAddressed: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CoverageAssessment {
  requirementComponentId: string;
  status: CoverageStatus;
  supportingExcerpt: string;
  rationale: string;
  analystReviewed: boolean;
  reviewerNote?: string;
}

export interface MatchRationale {
  positiveCoverage: string;
  potentialGap: string;
  suggestedReviewerAction: string;
  scoreBreakdown?: {
    componentOverlap: number;
    processAlignment: number;
    frequencyOwnerAlignment: number;
    metadataAlignment: number;
  };
}

export interface RequestedInformation {
  informationRequired: string;
  reason: string;
  requestedResponsibleFunction: string;
  dueDate?: string;
  requestedAt: string;
  requestedBy: string;
}

export interface ControlMapping {
  id: string;
  obligationId: string;
  controlId: string;
  status: MappingStatus;
  matchScore: number;
  matchProvider: string;
  matchRationale: MatchRationale;
  coverageAssessments: CoverageAssessment[];
  reviewerRationale?: string;
  reviewerNotes?: string;
  rejectionReason?: string;
  requestedInformation?: RequestedInformation;
  createdAt: string;
  updatedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  version: number;
  supersedesMappingId?: string;
  active: boolean;
}

export interface AuditEvent {
  id: string;
  entityType: 'Mapping' | 'Obligation' | 'System';
  entityId: string;
  action: AuditAction;
  actorId: string;
  actorDisplayName: string;
  timestamp: string;
  previousState?: string;
  newState?: string;
  reason?: string;
  relatedRecordIds?: string[];
}

export interface SummaryMetricsData {
  totalObligations: number;
  pendingReview: number;
  approvedMappings: number;
  unmappedObligations: number;
}

export interface MappingFilterState {
  searchQuery: string;
  regulation: string;
  applicability: string;
  mappingStatus: string;
  reviewStatus: string;
  businessFunction: string;
}

export interface ControlFilterState {
  searchQuery: string;
  ownerRole: string;
  businessFunction: string;
  designStatus: string;
  coverageStatus: string;
}

// Zod validation schemas
export const ApprovalSchema = z.object({
  reviewerRationale: z
    .string()
    .trim()
    .min(10, 'Reviewer rationale must be at least 10 characters explaining the mapping decision.'),
  reviewerNotes: z.string().optional(),
  acknowledgedGaps: z.boolean(),
});

export const RejectionSchema = z.object({
  rejectionReason: z
    .string()
    .trim()
    .min(10, 'Rejection reason must be at least 10 characters.'),
  reviewerNotes: z.string().optional(),
});

export const RequestInformationSchema = z.object({
  informationRequired: z
    .string()
    .trim()
    .min(5, 'Information required must be at least 5 characters.'),
  reason: z
    .string()
    .trim()
    .min(5, 'Reason for inquiry must be at least 5 characters.'),
  requestedResponsibleFunction: z
    .string()
    .trim()
    .min(2, 'Responsible function is required.'),
  dueDate: z.string().optional(),
});
