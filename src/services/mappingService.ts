import {
  RegulatoryObligation,
  InternalControl,
  ControlMapping,
  AuditEvent,
  SummaryMetricsData,
  CoverageAssessment,
  CoverageStatus,
  MappingStatus,
} from '../types';
import { repository, AppState } from './storage';

export const CURRENT_ANALYST = {
  id: 'usr-erostova',
  name: 'Elena Rostova',
  role: 'Compliance Analyst',
  displayName: 'Elena Rostova (Compliance Analyst)',
};

export class MappingService {
  public getState(): AppState {
    return repository.loadState();
  }

  public resetDemoData(): AppState {
    return repository.resetToSeed();
  }

  public setSimulationError(enabled: boolean): void {
    repository.setSimulationError(enabled);
  }

  public calculateSummaryMetrics(state: AppState): SummaryMetricsData {
    const { obligations, mappings } = state;
    const totalObligations = obligations.length;

    // Active approved mappings count
    const approvedMappings = mappings.filter(
      (m) => m.active && m.status === 'Approved'
    ).length;

    // Obligations with at least one approved active mapping
    const obligationsWithApprovedMapping = new Set(
      mappings
        .filter((m) => m.active && m.status === 'Approved')
        .map((m) => m.obligationId)
    );

    // Pending Review: obligations that have at least one proposed mapping awaiting review (Suggested, Draft, Pending Review, Needs Information)
    // or unapproved active mappings
    const obligationsPendingReview = new Set(
      mappings
        .filter(
          (m) =>
            m.active &&
            ['Pending Review', 'Draft', 'Suggested', 'Needs Information'].includes(
              m.status
            )
        )
        .map((m) => m.obligationId)
    );

    // Unmapped: Applicable obligations with NO approved active mapping
    const unmappedObligations = obligations.filter(
      (obl) =>
        obl.applicabilityStatus === 'Applicable' &&
        !obligationsWithApprovedMapping.has(obl.id)
    ).length;

    return {
      totalObligations,
      pendingReview: obligationsPendingReview.size,
      approvedMappings,
      unmappedObligations,
    };
  }

  public getObligationCoverageSummary(
    obligation: RegulatoryObligation,
    mappings: ControlMapping[]
  ): {
    stateLabel: string;
    proposedCount: number;
    approvedCount: number;
    uncoveredComponentsCount: number;
    isProvisional: boolean;
  } {
    const obMappings = mappings.filter((m) => m.obligationId === obligation.id && m.active);
    const approved = obMappings.filter((m) => m.status === 'Approved');
    const proposedCount = obMappings.length;
    const approvedCount = approved.length;

    // Track which components are supported
    const supportedComponentIds = new Set<string>();
    const effectiveMappings = approved.length > 0 ? approved : obMappings;

    for (const m of effectiveMappings) {
      for (const ca of m.coverageAssessments) {
        if (ca.status === 'Supported') {
          supportedComponentIds.add(ca.requirementComponentId);
        }
      }
    }

    const totalComponents = obligation.requirementComponents.length;
    const uncoveredComponentsCount = Math.max(
      0,
      totalComponents - supportedComponentIds.size
    );

    let stateLabel = 'No control identified';
    let isProvisional = approvedCount === 0 && proposedCount > 0;

    if (obligation.applicabilityStatus === 'Under Review' || obligation.applicabilityStatus === 'Conditionally Applicable') {
      stateLabel = 'Applicability requires review';
    } else if (proposedCount === 0) {
      stateLabel = 'No control identified';
    } else if (approvedCount > 0) {
      if (uncoveredComponentsCount === 0) {
        stateLabel = 'Approved mapping';
      } else {
        stateLabel = 'Partial coverage (Approved)';
      }
      isProvisional = false;
    } else if (obMappings.every((m) => m.status === 'Rejected')) {
      stateLabel = 'Mapping rejected';
      isProvisional = false;
    } else if (uncoveredComponentsCount === 0) {
      stateLabel = 'Fully mapped, pending approval';
    } else if (supportedComponentIds.size > 0) {
      stateLabel = 'Partial coverage';
    } else {
      stateLabel = 'Mapping suggested';
    }

    return {
      stateLabel,
      proposedCount,
      approvedCount,
      uncoveredComponentsCount,
      isProvisional,
    };
  }

  public approveMapping(params: {
    mappingId: string;
    reviewerRationale: string;
    reviewerNotes?: string;
    coverageAssessments?: CoverageAssessment[];
  }): AppState {
    const state = this.getState();
    const mapping = state.mappings.find((m) => m.id === params.mappingId);
    if (!mapping) throw new Error(`Mapping record ${params.mappingId} not found.`);

    const obligation = state.obligations.find((o) => o.id === mapping.obligationId);
    const control = state.controls.find((c) => c.id === mapping.controlId);
    if (!obligation || !control) {
      throw new Error('Associated obligation or control record not found.');
    }

    const updatedAssessments = params.coverageAssessments || mapping.coverageAssessments;
    const hasGaps = updatedAssessments.some(
      (a) => a.status === 'Not supported' || a.status === 'Unknown' || a.status === 'Partially supported'
    );

    const prevStatus = mapping.status;
    const now = new Date().toISOString();

    const updatedMapping: ControlMapping = {
      ...mapping,
      status: 'Approved',
      active: true,
      reviewerRationale: params.reviewerRationale,
      reviewerNotes: params.reviewerNotes,
      coverageAssessments: updatedAssessments,
      reviewedBy: CURRENT_ANALYST.displayName,
      reviewedAt: now,
      updatedAt: now,
    };

    const auditEvent: AuditEvent = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      entityType: 'Mapping',
      entityId: mapping.id,
      action: 'Mapping approved',
      actorId: CURRENT_ANALYST.id,
      actorDisplayName: CURRENT_ANALYST.displayName,
      timestamp: now,
      previousState: prevStatus,
      newState: 'Approved',
      reason: params.reviewerRationale,
      relatedRecordIds: [mapping.obligationId, mapping.controlId],
    };

    const nextState: AppState = {
      ...state,
      mappings: state.mappings.map((m) => (m.id === mapping.id ? updatedMapping : m)),
      auditEvents: [auditEvent, ...state.auditEvents],
    };

    repository.saveState(nextState);
    return nextState;
  }

  public rejectMapping(params: {
    mappingId: string;
    rejectionReason: string;
    reviewerNotes?: string;
  }): AppState {
    const state = this.getState();
    const mapping = state.mappings.find((m) => m.id === params.mappingId);
    if (!mapping) throw new Error(`Mapping record ${params.mappingId} not found.`);

    const prevStatus = mapping.status;
    const now = new Date().toISOString();

    const updatedMapping: ControlMapping = {
      ...mapping,
      status: 'Rejected',
      active: false,
      rejectionReason: params.rejectionReason,
      reviewerNotes: params.reviewerNotes,
      reviewedBy: CURRENT_ANALYST.displayName,
      reviewedAt: now,
      updatedAt: now,
    };

    const auditEvent: AuditEvent = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      entityType: 'Mapping',
      entityId: mapping.id,
      action: 'Mapping rejected',
      actorId: CURRENT_ANALYST.id,
      actorDisplayName: CURRENT_ANALYST.displayName,
      timestamp: now,
      previousState: prevStatus,
      newState: 'Rejected',
      reason: params.rejectionReason,
      relatedRecordIds: [mapping.obligationId, mapping.controlId],
    };

    const nextState: AppState = {
      ...state,
      mappings: state.mappings.map((m) => (m.id === mapping.id ? updatedMapping : m)),
      auditEvents: [auditEvent, ...state.auditEvents],
    };

    repository.saveState(nextState);
    return nextState;
  }

  public requestMoreInformation(params: {
    mappingId: string;
    informationRequired: string;
    reason: string;
    requestedResponsibleFunction: string;
    dueDate?: string;
  }): AppState {
    const state = this.getState();
    const mapping = state.mappings.find((m) => m.id === params.mappingId);
    if (!mapping) throw new Error(`Mapping record ${params.mappingId} not found.`);

    const prevStatus = mapping.status;
    const now = new Date().toISOString();

    const updatedMapping: ControlMapping = {
      ...mapping,
      status: 'Needs Information',
      requestedInformation: {
        informationRequired: params.informationRequired,
        reason: params.reason,
        requestedResponsibleFunction: params.requestedResponsibleFunction,
        dueDate: params.dueDate,
        requestedAt: now,
        requestedBy: CURRENT_ANALYST.displayName,
      },
      reviewedBy: CURRENT_ANALYST.displayName,
      reviewedAt: now,
      updatedAt: now,
    };

    const auditEvent: AuditEvent = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      entityType: 'Mapping',
      entityId: mapping.id,
      action: 'Information requested',
      actorId: CURRENT_ANALYST.id,
      actorDisplayName: CURRENT_ANALYST.displayName,
      timestamp: now,
      previousState: prevStatus,
      newState: 'Needs Information',
      reason: params.informationRequired,
      relatedRecordIds: [mapping.obligationId, mapping.controlId],
    };

    const nextState: AppState = {
      ...state,
      mappings: state.mappings.map((m) => (m.id === mapping.id ? updatedMapping : m)),
      auditEvents: [auditEvent, ...state.auditEvents],
    };

    repository.saveState(nextState);
    return nextState;
  }

  public saveMappingDraft(params: {
    mappingId: string;
    coverageAssessments: CoverageAssessment[];
    reviewerRationale?: string;
    reviewerNotes?: string;
  }): AppState {
    const state = this.getState();
    const mapping = state.mappings.find((m) => m.id === params.mappingId);
    if (!mapping) throw new Error(`Mapping record ${params.mappingId} not found.`);

    const now = new Date().toISOString();

    // If already approved, editing supersedes the approval and requires re-approval!
    if (mapping.status === 'Approved') {
      return this.supersedeApprovedMapping({
        mappingId: params.mappingId,
        coverageAssessments: params.coverageAssessments,
        reviewerRationale: params.reviewerRationale,
        reviewerNotes: params.reviewerNotes,
      });
    }

    const prevStatus = mapping.status;
    const updatedMapping: ControlMapping = {
      ...mapping,
      status: 'Draft',
      coverageAssessments: params.coverageAssessments,
      reviewerRationale: params.reviewerRationale,
      reviewerNotes: params.reviewerNotes,
      updatedAt: now,
    };

    const auditEvent: AuditEvent = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      entityType: 'Mapping',
      entityId: mapping.id,
      action: 'Mapping draft saved',
      actorId: CURRENT_ANALYST.id,
      actorDisplayName: CURRENT_ANALYST.displayName,
      timestamp: now,
      previousState: prevStatus,
      newState: 'Draft',
      reason: 'Analyst saved in-progress draft adjustments.',
      relatedRecordIds: [mapping.obligationId, mapping.controlId],
    };

    const nextState: AppState = {
      ...state,
      mappings: state.mappings.map((m) => (m.id === mapping.id ? updatedMapping : m)),
      auditEvents: [auditEvent, ...state.auditEvents],
    };

    repository.saveState(nextState);
    return nextState;
  }

  public supersedeApprovedMapping(params: {
    mappingId: string;
    coverageAssessments: CoverageAssessment[];
    reviewerRationale?: string;
    reviewerNotes?: string;
  }): AppState {
    const state = this.getState();
    const originalMapping = state.mappings.find((m) => m.id === params.mappingId);
    if (!originalMapping) throw new Error(`Mapping record ${params.mappingId} not found.`);

    const now = new Date().toISOString();

    // 1. Mark existing mapping as Superseded and inactive
    const supersededMapping: ControlMapping = {
      ...originalMapping,
      status: 'Superseded',
      active: false,
      updatedAt: now,
    };

    // 2. Create updated revision requiring re-approval (Status: Pending Review / Draft)
    const newMappingId = `MAP-${Date.now().toString().slice(-4)}`;
    const newVersionMapping: ControlMapping = {
      ...originalMapping,
      id: newMappingId,
      version: originalMapping.version + 1,
      supersedesMappingId: originalMapping.id,
      status: 'Pending Review',
      active: true,
      coverageAssessments: params.coverageAssessments,
      reviewerRationale: params.reviewerRationale || originalMapping.reviewerRationale,
      reviewerNotes: params.reviewerNotes || originalMapping.reviewerNotes,
      reviewedBy: undefined,
      reviewedAt: undefined,
      createdAt: now,
      updatedAt: now,
    };

    const auditEvent: AuditEvent = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      entityType: 'Mapping',
      entityId: newMappingId,
      action: 'Mapping superseded',
      actorId: CURRENT_ANALYST.id,
      actorDisplayName: CURRENT_ANALYST.displayName,
      timestamp: now,
      previousState: 'Approved',
      newState: 'Pending Review',
      reason: `Approved mapping ${originalMapping.id} (v${originalMapping.version}) superseded by v${newVersionMapping.version}. Reapproval required.`,
      relatedRecordIds: [originalMapping.obligationId, originalMapping.controlId, originalMapping.id],
    };

    const nextState: AppState = {
      ...state,
      mappings: state.mappings.map((m) => (m.id === originalMapping.id ? supersededMapping : m)).concat(newVersionMapping),
      auditEvents: [auditEvent, ...state.auditEvents],
    };

    repository.saveState(nextState);
    return nextState;
  }

  public exportRegisterCsv(filteredObligations: RegulatoryObligation[], state: AppState): string {
    const headers = [
      'Obligation ID',
      'Requirement Title',
      'Regulation',
      'Source Reference',
      'Applicability',
      'Control ID',
      'Control Name',
      'Mapping Status',
      'Coverage Summary',
      'Match Score',
      'Reviewer',
      'Review Timestamp',
    ];

    const rows: string[][] = [];

    for (const obl of filteredObligations) {
      const activeMappings = state.mappings.filter(
        (m) => m.obligationId === obl.id && m.active
      );

      if (activeMappings.length === 0) {
        rows.push([
          obl.id,
          obl.title,
          obl.regulationName,
          `${obl.sourceDocumentId} (${obl.sourceSection}, p.${obl.sourcePage || 'N/A'})`,
          obl.applicabilityStatus,
          'NONE',
          'No candidate control mapped',
          'Unmapped',
          'Uncovered (0 controls)',
          'N/A',
          'N/A',
          'N/A',
        ]);
      } else {
        for (const m of activeMappings) {
          const ctrl = state.controls.find((c) => c.id === m.controlId);
          const supportedCount = m.coverageAssessments.filter(
            (c) => c.status === 'Supported'
          ).length;
          const totalComp = obl.requirementComponents.length;
          const covSummary = `${supportedCount}/${totalComp} components supported`;

          rows.push([
            obl.id,
            obl.title,
            obl.regulationName,
            `${obl.sourceDocumentId} (${obl.sourceSection}, p.${obl.sourcePage || 'N/A'})`,
            obl.applicabilityStatus,
            ctrl?.id || m.controlId,
            ctrl?.name || 'Unknown Control',
            m.status,
            covSummary,
            `${m.matchScore}/100`,
            m.reviewedBy || 'Unassigned',
            m.reviewedAt ? new Date(m.reviewedAt).toISOString() : 'Pending Review',
          ]);
        }
      }
    }

    const escapeCsvCell = (val: string | number | undefined | null): string => {
      if (val === null || val === undefined) return '""';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return `"${str}"`;
    };

    const csvContent = [
      headers.map(escapeCsvCell).join(','),
      ...rows.map((row) => row.map(escapeCsvCell).join(',')),
    ].join('\r\n');

    return csvContent;
  }
}

export const mappingService = new MappingService();
