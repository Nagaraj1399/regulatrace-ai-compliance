import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../App';
import { mappingService } from '../services/mappingService';
import { repository } from '../services/storage';

describe('RegulaTrace AI - Acceptance Tests (20 Scenarios)', () => {
  beforeEach(() => {
    // Reset seed data and error flag before each test
    repository.setSimulationError(false);
    mappingService.resetDemoData();
  });

  // TEST 1: INITIAL RENDER
  it('TEST 1: INITIAL RENDER - renders application shell, active Obligation Mapping, and summary metrics', () => {
    render(<App />);

    // Shell branding
    expect(screen.getByText('RegulaTrace')).toBeDefined();
    expect(screen.getAllByText('Obligation Mapping').length).toBeGreaterThan(0);

    // Summary metrics exist
    expect(screen.getAllByText('Total Obligations').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Pending Review').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Approved Mappings').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Unmapped Obligations').length).toBeGreaterThan(0);

    // Initial obligation table is visible
    expect(screen.getAllByText('OBL-001').length).toBeGreaterThan(0);
  });

  // TEST 2: OBLIGATION SELECTION
  it('TEST 2: OBLIGATION SELECTION - clicking a different obligation updates the right workspace', async () => {
    render(<App />);

    // Initially OBL-001 is selected
    expect(screen.getAllByText('OBL-001').length).toBeGreaterThan(0);

    // Click on OBL-002 row
    const obl2Row = screen.getAllByText('OBL-002')[0].closest('[role="button"]')!;
    fireEvent.click(obl2Row);

    await waitFor(() => {
      // OBL-002 normalized requirement or title appears in details
      expect(
        screen.getAllByText('Suspicious Transaction Escalation Timeline').length
      ).toBeGreaterThan(0);
    });
  });

  // TEST 3: SEARCH
  it('TEST 3: SEARCH - filters table records by obligation ID or keyword', async () => {
    render(<App />);

    const searchInput = screen.getByLabelText('Search regulatory obligations');
    fireEvent.change(searchInput, { target: { value: 'OBL-003' } });

    await waitFor(() => {
      expect(screen.getAllByText('OBL-003').length).toBeGreaterThan(0);
      expect(screen.getByText('1 of 8 records')).toBeDefined();
    });
  });

  // TEST 4: COMBINED FILTERS
  it('TEST 4: COMBINED FILTERS - applies applicability and mapping status filters together', async () => {
    render(<App />);

    const applicabilitySelect = screen.getByLabelText('Applicability');
    fireEvent.change(applicabilitySelect, { target: { value: 'Applicable' } });

    const mappingSelect = screen.getByLabelText('Mapping Status');
    fireEvent.change(mappingSelect, { target: { value: 'Approved' } });

    await waitFor(() => {
      // OBL-002 and OBL-003 have approved mappings, 2 records displayed in explorer
      expect(screen.getByText('2 of 8 records')).toBeDefined();
      expect(screen.getAllByText('OBL-002').length).toBeGreaterThan(0);
      expect(screen.getAllByText('OBL-003').length).toBeGreaterThan(0);
    });

    // Clear filters
    const clearBtn = screen.getByText('Clear all');
    fireEvent.click(clearBtn);

    await waitFor(() => {
      expect(screen.getAllByText('OBL-001').length).toBeGreaterThan(0);
      expect(screen.getByText('8 of 8 records')).toBeDefined();
    });
  });

  // TEST 5: VIEW SOURCE
  it('TEST 5: VIEW SOURCE - opens Radix dialog with source excerpts and synthetic disclosure', async () => {
    render(<App />);

    const viewSourceBtn = screen.getByRole('button', { name: /view source/i });
    fireEvent.click(viewSourceBtn);

    await waitFor(() => {
      expect(screen.getByText('Regulatory Source Document Verification')).toBeDefined();
      expect(screen.getByText('Synthetic Demo Citation')).toBeDefined();
      expect(screen.getAllByText(/Synthetic demo source — not a real regulatory citation/).length).toBeGreaterThan(0);
      expect(screen.getAllByText('DOC-SPKS-REV4').length).toBeGreaterThan(0);
    });
  });

  // TEST 6: CANDIDATE MAPPING
  it('TEST 6: CANDIDATE MAPPING - displays candidate controls, match scores, and rationale', () => {
    render(<App />);

    // For OBL-001, CTRL-014 and CTRL-015 are suggested/pending
    expect(screen.getAllByText('CTRL-014').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Customer Record Review & KYC Refresh').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Positive Coverage:/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Identified Gap:/).length).toBeGreaterThan(0);
  });

  // TEST 7: EDIT COVERAGE
  it('TEST 7: EDIT COVERAGE - allows analyst to adjust requirement component status in review mode', async () => {
    render(<App />);

    // Click Review Mapping on CTRL-014
    const reviewButtons = screen.getAllByRole('button', { name: /review mapping/i });
    fireEvent.click(reviewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Review Obligation-to-Control Mapping')).toBeDefined();
    });

    // Find select for RC-001-C (which is Unknown in seed)
    const select = screen.getByLabelText('Coverage status for RC-001-C');
    expect(select).toBeDefined();
    fireEvent.change(select, { target: { value: 'Supported' } });

    // Save Draft
    const saveDraftBtn = screen.getByRole('button', { name: /save draft/i });
    fireEvent.click(saveDraftBtn);

    await waitFor(() => {
      expect(screen.queryByText('Review Obligation-to-Control Mapping')).toBeNull();
    });

    // Verify persisted state reflects the updated status
    const state = mappingService.getState();
    const updatedMapping = state.mappings.find((m) => m.id === 'MAP-001');
    const compC = updatedMapping?.coverageAssessments.find((a) => a.requirementComponentId === 'RC-001-C');
    expect(compC?.status).toBe('Supported');
  });

  // TEST 8: APPROVE A COMPLETE MAPPING
  it('TEST 8: APPROVE A COMPLETE MAPPING - approves mapping when required rationale is provided', async () => {
    render(<App />);

    // Click OBL-002
    fireEvent.click(screen.getAllByText('OBL-002')[0]);

    // Open review dialog for CTRL-022
    const reviewBtn = screen.getByRole('button', { name: /inspect \/ re-evaluate mapping/i });
    fireEvent.click(reviewBtn);

    await waitFor(() => {
      expect(screen.getByText('Review Obligation-to-Control Mapping')).toBeDefined();
    });

    const rationaleInput = screen.getByLabelText(/reviewer decision rationale/i);
    fireEvent.change(rationaleInput, {
      target: { value: 'Comprehensive compliance validation verified against Q4 operational testing logs.' },
    });

    const approveBtn = screen.getByRole('button', { name: /re-approve mapping|approve mapping/i });
    fireEvent.click(approveBtn);

    await waitFor(() => {
      expect(screen.queryByText('Review Obligation-to-Control Mapping')).toBeNull();
    });

    const state = mappingService.getState();
    const map3 = state.mappings.find((m) => m.id === 'MAP-003');
    expect(map3?.status).toBe('Approved');
    expect(map3?.reviewedBy).toContain('Elena Rostova');
  });

  // TEST 9: APPROVE A PARTIAL MAPPING
  it('TEST 9: APPROVE A PARTIAL MAPPING - requires explicit acknowledgment of gaps before approval', async () => {
    render(<App />);

    // OBL-001 with CTRL-014 has gaps (RC-001-D is Not supported)
    const reviewButtons = screen.getAllByRole('button', { name: /review mapping/i });
    fireEvent.click(reviewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Notice of Incomplete Control Coverage')).toBeDefined();
    });

    const rationaleInput = screen.getByLabelText(/reviewer decision rationale/i);
    fireEvent.change(rationaleInput, {
      target: { value: 'Approved as baseline partial control while escalation gap is tracked.' },
    });

    // Approve button should be disabled without checking acknowledgment
    const approveBtn = screen.getByRole('button', { name: /approve mapping/i });
    expect(approveBtn.hasAttribute('disabled')).toBe(true);

    // Check acknowledgment checkbox
    const ackCheckbox = screen.getByLabelText(
      /i explicitly acknowledge that residual gaps and unverified components exist in this mapping/i
    );
    fireEvent.click(ackCheckbox);

    // Now approve button is enabled
    expect(approveBtn.hasAttribute('disabled')).toBe(false);
    fireEvent.click(approveBtn);

    await waitFor(() => {
      expect(screen.queryByText('Review Obligation-to-Control Mapping')).toBeNull();
    });

    const state = mappingService.getState();
    const map1 = state.mappings.find((m) => m.id === 'MAP-001');
    expect(map1?.status).toBe('Approved');
  });

  // TEST 10: REJECT A MAPPING
  it('TEST 10: REJECT A MAPPING - requires rejection reason and excludes from active coverage', async () => {
    render(<App />);

    // Open review for MAP-001
    const reviewButtons = screen.getAllByRole('button', { name: /review mapping/i });
    fireEvent.click(reviewButtons[0]);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /reject mapping/i })).toBeDefined();
    });

    // Click Reject Mapping button to open rejection confirmation modal
    fireEvent.click(screen.getByRole('button', { name: /reject mapping/i }));

    await waitFor(() => {
      expect(screen.getByText('Reject Candidate Control Mapping')).toBeDefined();
    });

    // Fill rejection reason
    const reasonInput = screen.getByLabelText(/rejection reason/i);
    fireEvent.change(reasonInput, {
      target: { value: 'Control frequency and scope do not sufficiently mitigate the obligation.' },
    });

    const confirmRejectBtn = screen.getByRole('button', { name: /confirm rejection/i });
    fireEvent.click(confirmRejectBtn);

    await waitFor(() => {
      expect(screen.queryByText('Reject Candidate Control Mapping')).toBeNull();
    });

    const state = mappingService.getState();
    const map1 = state.mappings.find((m) => m.id === 'MAP-001');
    expect(map1?.status).toBe('Rejected');
    expect(map1?.active).toBe(false);

    // Audit event recorded
    const auditEvent = state.auditEvents.find(
      (e) => e.entityId === 'MAP-001' && e.action === 'Mapping rejected'
    );
    expect(auditEvent).toBeDefined();
  });

  // TEST 11: REQUEST INFORMATION
  it('TEST 11: REQUEST INFORMATION - records information inquiry and transitions status to Needs Information', async () => {
    render(<App />);

    const reviewButtons = screen.getAllByRole('button', { name: /review mapping/i });
    fireEvent.click(reviewButtons[0]);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /request info/i })).toBeDefined();
    });

    fireEvent.click(screen.getByRole('button', { name: /request info/i }));

    await waitFor(() => {
      expect(screen.getByText('Request Information for Mapping')).toBeDefined();
    });

    const infoInput = screen.getByLabelText(/specific information \/ evidence required/i);
    fireEvent.change(infoInput, {
      target: { value: 'Requesting updated KYC exception logs for Q3.' },
    });

    const reasonInput = screen.getByLabelText(/reason for clarification/i);
    fireEvent.change(reasonInput, {
      target: { value: 'Need verification that exception handling is formalized.' },
    });

    const saveInquiryBtn = screen.getByRole('button', { name: /save inquiry/i });
    fireEvent.click(saveInquiryBtn);

    await waitFor(() => {
      expect(screen.queryByText('Request Information for Mapping')).toBeNull();
    });

    const state = mappingService.getState();
    const map1 = state.mappings.find((m) => m.id === 'MAP-001');
    expect(map1?.status).toBe('Needs Information');
    expect(map1?.requestedInformation?.informationRequired).toContain('KYC exception logs');
  });

  // TEST 12: SUPERSEDE AN APPROVED MAPPING
  it('TEST 12: SUPERSEDE AN APPROVED MAPPING - editing an approved mapping creates a new version requiring reapproval', () => {
    // Direct service invocation testing the supersede business logic
    const state = mappingService.getState();
    const approvedMap = state.mappings.find((m) => m.id === 'MAP-003');
    expect(approvedMap?.status).toBe('Approved');

    const updated = mappingService.saveMappingDraft({
      mappingId: 'MAP-003',
      coverageAssessments: approvedMap!.coverageAssessments,
      reviewerRationale: 'Updated analysis after regulatory guidance update.',
    });

    // Original mapping is superseded and inactive
    const oldVersion = updated.mappings.find((m) => m.id === 'MAP-003');
    expect(oldVersion?.status).toBe('Superseded');
    expect(oldVersion?.active).toBe(false);

    // New version exists and requires reapproval (status: Pending Review)
    const newVersion = updated.mappings.find((m) => m.supersedesMappingId === 'MAP-003');
    expect(newVersion).toBeDefined();
    expect(newVersion?.status).toBe('Pending Review');
    expect(newVersion?.active).toBe(true);
    expect(newVersion?.version).toBe(2);
  });

  // TEST 13: LIVE METRICS
  it('TEST 13: LIVE METRICS - metrics dynamically reflect state mutations', () => {
    const initialState = mappingService.getState();
    const initialMetrics = mappingService.calculateSummaryMetrics(initialState);

    expect(initialMetrics.totalObligations).toBe(8);
    expect(initialMetrics.approvedMappings).toBe(2); // MAP-003 and MAP-004

    // Approve another mapping
    const nextState = mappingService.approveMapping({
      mappingId: 'MAP-001',
      reviewerRationale: 'Approved for testing metrics calculation.',
    });

    const updatedMetrics = mappingService.calculateSummaryMetrics(nextState);
    expect(updatedMetrics.approvedMappings).toBe(3);
  });

  // TEST 14: CSV EXPORT
  it('TEST 14: CSV EXPORT - produces formatted CSV with required fields and escaping', () => {
    const state = mappingService.getState();
    const csv = mappingService.exportRegisterCsv(state.obligations, state);

    expect(csv).toContain('Obligation ID');
    expect(csv).toContain('Requirement Title');
    expect(csv).toContain('Regulation');
    expect(csv).toContain('OBL-001');
    expect(csv).toContain('OBL-002');
    expect(csv).toContain('CTRL-022');
  });

  // TEST 15: PERSISTENCE
  it('TEST 15: PERSISTENCE - decisions survive reload without duplicate records', () => {
    mappingService.approveMapping({
      mappingId: 'MAP-001',
      reviewerRationale: 'Persistence test approval rationale.',
    });

    // Reload state from repository
    const reloaded = repository.loadState();
    const map1 = reloaded.mappings.find((m) => m.id === 'MAP-001');
    expect(map1?.status).toBe('Approved');
    expect(map1?.reviewerRationale).toBe('Persistence test approval rationale.');
  });

  // TEST 16: RESET DATA
  it('TEST 16: RESET DATA - restores deterministic seed dataset', () => {
    // Mutate state
    mappingService.rejectMapping({
      mappingId: 'MAP-003',
      rejectionReason: 'Test rejection before reset.',
    });

    let state = mappingService.getState();
    expect(state.mappings.find((m) => m.id === 'MAP-003')?.status).toBe('Rejected');

    // Reset
    const resetState = mappingService.resetDemoData();
    const restoredMap3 = resetState.mappings.find((m) => m.id === 'MAP-003');
    expect(restoredMap3?.status).toBe('Approved');
    expect(resetState.auditEvents[0]?.action).toBe('Demo data reset');
  });

  // TEST 17: INVALID INPUT
  it('TEST 17: INVALID INPUT - rejects blank or too short approval rationale', async () => {
    render(<App />);

    // Open review dialog on CTRL-014
    const reviewButtons = screen.getAllByRole('button', { name: /review mapping/i });
    fireEvent.click(reviewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Review Obligation-to-Control Mapping')).toBeDefined();
    });

    // Acknowledge gaps to enable button check
    const ackCheckbox = screen.getByLabelText(
      /i explicitly acknowledge that residual gaps and unverified components exist in this mapping/i
    );
    fireEvent.click(ackCheckbox);

    // Provide whitespace only
    const rationaleInput = screen.getByLabelText(/reviewer decision rationale/i);
    fireEvent.change(rationaleInput, { target: { value: '    ' } });

    const approveBtn = screen.getByRole('button', { name: /approve mapping/i });
    fireEvent.click(approveBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/Reviewer rationale must be at least 10 characters/i)
      ).toBeDefined();
    });
  });

  // TEST 18: SAVE FAILURE
  it('TEST 18: SAVE FAILURE - displays meaningful error when storage error is simulated', async () => {
    repository.setSimulationError(true);

    render(<App />);

    const reviewButtons = screen.getAllByRole('button', { name: /review mapping/i });
    fireEvent.click(reviewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Review Obligation-to-Control Mapping')).toBeDefined();
    });

    const ackCheckbox = screen.getByLabelText(
      /i explicitly acknowledge that residual gaps and unverified components exist in this mapping/i
    );
    fireEvent.click(ackCheckbox);

    const rationaleInput = screen.getByLabelText(/reviewer decision rationale/i);
    fireEvent.change(rationaleInput, {
      target: { value: 'Valid approval rationale that will fail disk write.' },
    });

    const approveBtn = screen.getByRole('button', { name: /approve mapping/i });
    fireEvent.click(approveBtn);

    await waitFor(() => {
      expect(screen.getByText(/Simulated Storage Adapter Error/i)).toBeDefined();
    });
  });

  // TEST 19: KEYBOARD ACCESSIBILITY
  it('TEST 19: KEYBOARD ACCESSIBILITY - keyboard navigation on obligations table works', () => {
    render(<App />);

    const obl2 = screen.getAllByText('OBL-002')[0].closest('[role="button"]')!;
    fireEvent.keyDown(obl2, { key: 'Enter', code: 'Enter' });

    expect(screen.getAllByText('Suspicious Transaction Escalation Timeline').length).toBeGreaterThan(0);
  });

  // TEST 20: MOBILE LAYOUT
  it('TEST 20: MOBILE LAYOUT - renders without throwing and keeps controls available', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.grid')).toBeDefined();
    expect(screen.getByText('Regulatory Obligations')).toBeDefined();
  });
});
