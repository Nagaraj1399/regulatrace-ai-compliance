import {
  RegulatoryObligation,
  InternalControl,
  ControlMapping,
  AuditEvent,
} from '../types';

export const ORGANIZATION_NAME = 'Northstar Demo Bank';
export const ORGANIZATION_DISCLAIMER = 'Fictional demo organization — not a real bank.';
export const SYNTHETIC_SOURCE_LABEL = 'Synthetic demo source — not a real regulatory citation.';

export interface DataDictionaryEntry {
  term: string;
  definition: string;
  example: string;
}

export const DATA_DICTIONARY: DataDictionaryEntry[] = [
  {
    term: 'Regulatory Obligation',
    definition: 'A distinct, enforceable mandate synthesized from regulatory statutes, standards, or guidelines.',
    example: 'OBL-001: Customer identity records must be reviewed periodically.',
  },
  {
    term: 'Requirement Component (RC)',
    definition: 'An atomic, verifiable clause decomposed from an obligation to assess granular control coverage.',
    example: 'RC-001: Customer identity records are in scope.',
  },
  {
    term: 'Internal Control',
    definition: 'An operational policy, technical control, or governance mechanism instituted by the bank to mitigate risk.',
    example: 'CTRL-014: Customer Record Review (Quarterly).',
  },
  {
    term: 'Candidate Match Score',
    definition: 'Deterministic heuristic score (0–100) evaluating component overlap (50%), process alignment (25%), frequency/ownership (15%), and metadata (10%). Not proof of compliance.',
    example: '86/100 candidate alignment.',
  },
  {
    term: 'Coverage Assessment Status',
    definition: 'Granular status per requirement component: Supported, Partially supported, Not supported, or Unknown.',
    example: 'Supported: Evidence explicitly corroborates requirement fulfillment.',
  },
  {
    term: 'Mapping Status Lifecycle',
    definition: 'Formal workflow state: Suggested → Draft → Pending Review / Needs Information → Approved / Rejected (or Superseded).',
    example: 'Approved requires analyst rationale and gap acknowledgment.',
  },
];

export const INITIAL_OBLIGATIONS: RegulatoryObligation[] = [
  {
    id: 'OBL-001',
    title: 'Customer Identity Record Periodic Review',
    normalizedRequirement:
      'Customer identity records must be reviewed periodically in accordance with the applicable review schedule, documented, and escalated when discrepancies or expired KYC credentials are identified.',
    regulationName: 'Synthetic Prudential KYC Standard (SPKS-2025)',
    sourceDocumentId: 'DOC-SPKS-REV4',
    sourceDocumentVersion: 'v2.4 (Fictional Demo)',
    sourceSection: 'Section 4.2',
    sourcePage: 48,
    sourceExcerpt:
      'Regulated financial entities shall establish rigorous recurring reviews of existing customer identification documentation. Such reviews must be scheduled according to customer risk tier, thoroughly logged in audit registers, and discrepancies promptly escalated to the Compliance Oversight Unit.',
    jurisdiction: 'Federal / National Banking Authority (Demo)',
    businessFunction: 'Retail Banking & Operations',
    applicabilityStatus: 'Applicable',
    effectiveDate: '2025-01-01',
    sourceVerificationStatus: 'Synthetic Demo',
    requirementComponents: [
      {
        id: 'RC-001-A',
        obligationId: 'OBL-001',
        statement: 'Customer identity and KYC documentation are in scope for periodic review.',
        sourceExcerpt: 'Recurring reviews of existing customer identification documentation...',
        sourceSection: 'Section 4.2(a)',
      },
      {
        id: 'RC-001-B',
        obligationId: 'OBL-001',
        statement: 'Reviews are executed periodically according to assigned risk schedules.',
        sourceExcerpt: 'Scheduled according to customer risk tier...',
        sourceSection: 'Section 4.2(b)',
      },
      {
        id: 'RC-001-C',
        obligationId: 'OBL-001',
        statement: 'Review findings, certifications, and timestamps are formally documented in audit registers.',
        sourceExcerpt: 'Thoroughly logged in audit registers...',
        sourceSection: 'Section 4.2(c)',
      },
      {
        id: 'RC-001-D',
        obligationId: 'OBL-001',
        statement: 'Identified discrepancies or expired credentials are promptly escalated to Compliance Oversight.',
        sourceExcerpt: 'Discrepancies promptly escalated to the Compliance Oversight Unit.',
        sourceSection: 'Section 4.2(d)',
      },
    ],
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-02-10T10:00:00Z',
  },
  {
    id: 'OBL-002',
    title: 'Suspicious Transaction Escalation Timeline',
    normalizedRequirement:
      'Internal surveillance systems must flag anomalous transactions within 24 hours of occurrence and transmit suspicious transaction referrals to internal investigation units within 48 hours.',
    regulationName: 'Synthetic Anti-Financial Crime Guidelines (SAFCG)',
    sourceDocumentId: 'DOC-SAFCG-2024',
    sourceDocumentVersion: 'v3.1 (Fictional Demo)',
    sourceSection: 'Section 8.1(b)',
    sourcePage: 92,
    sourceExcerpt:
      'Automated transaction monitoring alert triaging must be completed within 24 hours of ingest. Confirmed red-flag events must generate an escalation dossier transmitted to Financial Crimes Intelligence within 48 hours.',
    jurisdiction: 'Financial Crime Supervisory Unit (Demo)',
    businessFunction: 'Anti-Money Laundering (AML)',
    applicabilityStatus: 'Applicable',
    effectiveDate: '2024-09-15',
    sourceVerificationStatus: 'Synthetic Demo',
    requirementComponents: [
      {
        id: 'RC-002-A',
        obligationId: 'OBL-002',
        statement: 'Automated monitoring flags anomalous transactions within 24 hours of ingest.',
        sourceExcerpt: 'Alert triaging must be completed within 24 hours of ingest...',
        sourceSection: 'Section 8.1(b)(i)',
      },
      {
        id: 'RC-002-B',
        obligationId: 'OBL-002',
        statement: 'Confirmed suspicious alerts transmit escalation dossiers within 48 hours to intelligence unit.',
        sourceExcerpt: 'Generate an escalation dossier transmitted to Financial Crimes Intelligence within 48 hours.',
        sourceSection: 'Section 8.1(b)(ii)',
      },
    ],
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-02-12T11:00:00Z',
  },
  {
    id: 'OBL-003',
    title: 'Privileged Access Reconciliation & Recertification',
    normalizedRequirement:
      'Access rights for all privileged administrative accounts supporting core ledger systems must be recertified quarterly by independent security supervisors.',
    regulationName: 'Synthetic Cyber Resilience Framework (SCRF-B7)',
    sourceDocumentId: 'DOC-SCRF-2024',
    sourceDocumentVersion: 'v1.0 (Fictional Demo)',
    sourceSection: 'Section 12.4',
    sourcePage: 114,
    sourceExcerpt:
      'Privileged credential reconciliations across tier-1 core banking infrastructure shall occur no less frequently than every 90 calendar days. Department heads cannot self-certify their own administrator accesses.',
    jurisdiction: 'Information Security Office (Demo)',
    businessFunction: 'Information Security & IT Risk',
    applicabilityStatus: 'Applicable',
    effectiveDate: '2024-11-01',
    sourceVerificationStatus: 'Synthetic Demo',
    requirementComponents: [
      {
        id: 'RC-003-A',
        obligationId: 'OBL-003',
        statement: 'Core ledger privileged administrative credentials are in scope for recertification.',
        sourceExcerpt: 'Privileged credential reconciliations across tier-1 core banking infrastructure...',
        sourceSection: 'Section 12.4(a)',
      },
      {
        id: 'RC-003-B',
        obligationId: 'OBL-003',
        statement: 'Recertification frequency occurs no less than every 90 calendar days (quarterly).',
        sourceExcerpt: 'Shall occur no less frequently than every 90 calendar days...',
        sourceSection: 'Section 12.4(b)',
      },
      {
        id: 'RC-003-C',
        obligationId: 'OBL-003',
        statement: 'Recertifications are conducted by independent supervisors with segregation of duties.',
        sourceExcerpt: 'Department heads cannot self-certify their own administrator accesses.',
        sourceSection: 'Section 12.4(c)',
      },
    ],
    createdAt: '2025-01-20T08:00:00Z',
    updatedAt: '2025-02-14T09:30:00Z',
  },
  {
    id: 'OBL-004',
    title: 'Intraday Liquidity Stress Buffer Maintenance',
    normalizedRequirement:
      'Institutions must calculate intraday peak gross settlement outflows and hold a minimum 8% eligible liquid asset buffer over historical maximum peak demand.',
    regulationName: 'Synthetic Liquidity Adequacy Rule (SLAR-Part 5)',
    sourceDocumentId: 'DOC-SLAR-P5',
    sourceDocumentVersion: 'v1.5 (Fictional Demo)',
    sourceSection: 'Section 5.3',
    sourcePage: 34,
    sourceExcerpt:
      'Treasury operations must capture peak intraday payment demands daily, projecting a required unencumbered high-quality liquid asset cushion exceeding peak 1-day gross demands by no less than 8 percent.',
    jurisdiction: 'Prudential Liquidity Commission (Demo)',
    businessFunction: 'Treasury & Liquidity Risk',
    applicabilityStatus: 'Applicable',
    effectiveDate: '2025-03-01',
    sourceVerificationStatus: 'Synthetic Demo',
    requirementComponents: [
      {
        id: 'RC-004-A',
        obligationId: 'OBL-004',
        statement: 'Intraday peak gross settlement outflows are captured and calculated daily.',
        sourceExcerpt: 'Capture peak intraday payment demands daily...',
        sourceSection: 'Section 5.3(a)',
      },
      {
        id: 'RC-004-B',
        obligationId: 'OBL-004',
        statement: 'Maintain an unencumbered liquid buffer equal to at least 8% over peak gross demand.',
        sourceExcerpt: 'Liquid asset cushion exceeding peak 1-day gross demands by no less than 8 percent.',
        sourceSection: 'Section 5.3(b)',
      },
    ],
    createdAt: '2025-01-22T08:00:00Z',
    updatedAt: '2025-02-15T14:00:00Z',
  },
  {
    id: 'OBL-005',
    title: 'Whistleblower Anonymous Reporting Channel Availability',
    normalizedRequirement:
      'Banks must maintain an independently operated, multi-channel anonymous whistleblower hotline accessible 24/7 with anti-retaliation protections guaranteed in written policy.',
    regulationName: 'Synthetic Corporate Governance Mandate (SCGM-2024)',
    sourceDocumentId: 'DOC-SCGM-24',
    sourceDocumentVersion: 'v2.0 (Fictional Demo)',
    sourceSection: 'Section 16.1',
    sourcePage: 63,
    sourceExcerpt:
      'An external or air-gapped intake channel for ethical and fraud disclosures must remain active continuously without identity logging. Whistleblower policy must be distributed to all full-time and contract personnel.',
    jurisdiction: 'Governance & Ethics Directorate (Demo)',
    businessFunction: 'Legal & Ethics Governance',
    applicabilityStatus: 'Applicable',
    effectiveDate: '2024-06-01',
    sourceVerificationStatus: 'Synthetic Demo',
    requirementComponents: [
      {
        id: 'RC-005-A',
        obligationId: 'OBL-005',
        statement: 'Maintain an air-gapped or independently operated intake channel active 24/7.',
        sourceExcerpt: 'Intake channel for ethical and fraud disclosures must remain active continuously...',
        sourceSection: 'Section 16.1(a)',
      },
      {
        id: 'RC-005-B',
        obligationId: 'OBL-005',
        statement: 'Caller and reporter identities are protected with zero mandatory identity logging.',
        sourceExcerpt: 'Without identity logging...',
        sourceSection: 'Section 16.1(b)',
      },
      {
        id: 'RC-005-C',
        obligationId: 'OBL-005',
        statement: 'Written anti-retaliation policy distributed annually to all full-time and contract staff.',
        sourceExcerpt: 'Whistleblower policy must be distributed to all full-time and contract personnel.',
        sourceSection: 'Section 16.1(c)',
      },
    ],
    createdAt: '2025-01-25T08:00:00Z',
    updatedAt: '2025-02-18T16:00:00Z',
  },
  {
    id: 'OBL-006',
    title: 'Model Validation for Automated Credit Underwriting',
    normalizedRequirement:
      'Machine learning and scoring algorithms used for consumer lending underwriting must undergo annual independent algorithmic bias audits and out-of-sample backtesting.',
    regulationName: 'Synthetic Model Risk Management Directive (SMRMD)',
    sourceDocumentId: 'DOC-SMRMD-19',
    sourceDocumentVersion: 'v1.1 (Fictional Demo)',
    sourceSection: 'Section 7.3',
    sourcePage: 55,
    sourceExcerpt:
      'Algorithmic decision engines contributing to credit approval must be subjected to annual conceptual soundness reviews, demographic bias assessments, and out-of-time benchmarking by an independent Model Risk Governance body.',
    jurisdiction: 'Credit Risk Supervisory Board (Demo)',
    businessFunction: 'Credit Risk & Quantitative Analytics',
    applicabilityStatus: 'Conditionally Applicable',
    effectiveDate: '2025-04-01',
    sourceVerificationStatus: 'Synthetic Demo',
    requirementComponents: [
      {
        id: 'RC-006-A',
        obligationId: 'OBL-006',
        statement: 'Underwriting models undergo annual conceptual soundness and bias assessments.',
        sourceExcerpt: 'Annual conceptual soundness reviews, demographic bias assessments...',
        sourceSection: 'Section 7.3(a)',
      },
      {
        id: 'RC-006-B',
        obligationId: 'OBL-006',
        statement: 'Conduct out-of-time benchmark testing performed by independent model risk team.',
        sourceExcerpt: 'Out-of-time benchmarking by an independent Model Risk Governance body.',
        sourceSection: 'Section 7.3(b)',
      },
    ],
    createdAt: '2025-01-26T08:00:00Z',
    updatedAt: '2025-02-19T11:20:00Z',
  },
  {
    id: 'OBL-007',
    title: 'Cross-Border Personal Data Transfer Impact Assessment',
    normalizedRequirement:
      'Prior to transferring customer personal identifiers outside domestic jurisdiction, data protection officers must complete a formal transfer impact assessment (TIA) and document supplementary safeguards.',
    regulationName: 'Synthetic Cross-Border Data Privacy Act (SCBDPA)',
    sourceDocumentId: 'DOC-SCBDPA-3',
    sourceDocumentVersion: 'v4.0 (Fictional Demo)',
    sourceSection: 'Section 19.2',
    sourcePage: 81,
    sourceExcerpt:
      'Cross-border transmittal of identifiable banking client records is prohibited unless an executed transfer impact assessment demonstrates equivalence of recipient privacy regimes and enforceable technical encryption controls.',
    jurisdiction: 'Data Privacy & Consumer Protection Authority (Demo)',
    businessFunction: 'Information Security & IT Risk',
    applicabilityStatus: 'Under Review',
    effectiveDate: '2025-06-30',
    sourceVerificationStatus: 'Synthetic Demo',
    requirementComponents: [
      {
        id: 'RC-007-A',
        obligationId: 'OBL-007',
        statement: 'Formal transfer impact assessment completed before any cross-border transmission.',
        sourceExcerpt: 'Unless an executed transfer impact assessment demonstrates equivalence...',
        sourceSection: 'Section 19.2(a)',
      },
      {
        id: 'RC-007-B',
        obligationId: 'OBL-007',
        statement: 'Enforceable supplementary technical encryption controls documented and audited.',
        sourceExcerpt: 'Enforceable technical encryption controls.',
        sourceSection: 'Section 19.2(b)',
      },
    ],
    createdAt: '2025-01-28T08:00:00Z',
    updatedAt: '2025-02-20T10:15:00Z',
  },
  {
    id: 'OBL-008',
    title: 'Carbon-Intensive Asset Exposure Stress Disclosure',
    normalizedRequirement:
      'Banks exceeding Tier-1 capital threshold must simulate 3-year transition risk scenario impacts on commercial loan portfolios and disclose carbon-concentrated industry balances semi-annually.',
    regulationName: 'Synthetic Climate-Related Financial Disclosures (SCFD-2025)',
    sourceDocumentId: 'DOC-SCFD-25',
    sourceDocumentVersion: 'v1.0 (Fictional Demo)',
    sourceSection: 'Section 3.1',
    sourcePage: 17,
    sourceExcerpt:
      'Commercial credit portfolios must be stress-tested semi-annually against carbon tax and fossil divestment shock pathways, with exposure disclosures published in statutory pillar 3 reports.',
    jurisdiction: 'Macroprudential Stability Board (Demo)',
    businessFunction: 'Enterprise Risk & ESG',
    applicabilityStatus: 'Applicable',
    effectiveDate: '2025-07-01',
    sourceVerificationStatus: 'Synthetic Demo',
    requirementComponents: [
      {
        id: 'RC-008-A',
        obligationId: 'OBL-008',
        statement: 'Simulate 3-year climate transition stress shocks across commercial credit exposures.',
        sourceExcerpt: 'Stress-tested semi-annually against carbon tax and fossil divestment shock pathways...',
        sourceSection: 'Section 3.1(a)',
      },
      {
        id: 'RC-008-B',
        obligationId: 'OBL-008',
        statement: 'Disclose industry-level carbon asset concentration balances semi-annually.',
        sourceExcerpt: 'Exposure disclosures published in statutory pillar 3 reports.',
        sourceSection: 'Section 3.1(b)',
      },
    ],
    createdAt: '2025-01-30T08:00:00Z',
    updatedAt: '2025-02-21T09:45:00Z',
  },
];

export const INITIAL_CONTROLS: InternalControl[] = [
  {
    id: 'CTRL-014',
    name: 'Customer Record Review & KYC Refresh',
    description:
      'Operations staff review selected customer records according to an established quarterly schedule. KYC analysts check identity data against sanction lists and flag missing documents.',
    ownerRole: 'Customer Operations Manager',
    frequency: 'Quarterly',
    businessFunction: 'Retail Banking & Operations',
    designStatus: 'Design Effective',
    evidenceStatus: 'Evidence Available',
    sourceDocumentId: 'INT-POL-KYC-002',
    sourceDocumentVersion: 'v3.2',
    sourceSection: 'Procedure 4.1',
    sourcePage: 12,
    sourceExcerpt:
      'Quarterly sampling of accounts across branch and digital channels for validity of identity files. Completed worksheets archived in Documentum repository.',
    requirementComponentsAddressed: ['RC-001-A', 'RC-001-B'],
    createdAt: '2024-05-10T08:00:00Z',
    updatedAt: '2024-12-01T09:00:00Z',
  },
  {
    id: 'CTRL-015',
    name: 'KYC Discrepancy Escalation Workflow',
    description:
      'Automated case management system transmits KYC deficiencies and expired identity records to Senior Compliance Officers with mandatory SLA of 3 business days.',
    ownerRole: 'Compliance Operations Lead',
    frequency: 'Event-driven',
    businessFunction: 'Retail Banking & Operations',
    designStatus: 'Design Effective',
    evidenceStatus: 'Evidence Available',
    sourceDocumentId: 'INT-SOP-KYC-ESC',
    sourceDocumentVersion: 'v1.4',
    sourceSection: 'Workflow Spec 2.0',
    sourcePage: 6,
    sourceExcerpt:
      'Any discrepancy identified during onboarding or batch refresh triggers an automated JIRA Compliance ticket routed directly to the MLRO triage desk.',
    requirementComponentsAddressed: ['RC-001-C', 'RC-001-D'],
    createdAt: '2024-06-12T08:00:00Z',
    updatedAt: '2024-12-10T14:00:00Z',
  },
  {
    id: 'CTRL-022',
    name: 'Real-time Anti-Money Laundering Alert Triage',
    description:
      'Tier-1 surveillance engine evaluates cross-border wires and cash deposits against typology rules. Alerts are queued for human analysis within 24 hours of generation.',
    ownerRole: 'AML Surveillance Lead',
    frequency: 'Daily',
    businessFunction: 'Anti-Money Laundering (AML)',
    designStatus: 'Design Effective',
    evidenceStatus: 'Evidence Available',
    sourceDocumentId: 'INT-POL-AML-08',
    sourceDocumentVersion: 'v4.1',
    sourceSection: 'Standard 3.2',
    sourcePage: 28,
    sourceExcerpt:
      'Surveillance Operations runs automated ingestion nightly at 00:00 GMT. Investigators must review and dispose of amber alerts within 24 hours of batch completion.',
    requirementComponentsAddressed: ['RC-002-A', 'RC-002-B'],
    createdAt: '2024-04-15T08:00:00Z',
    updatedAt: '2025-01-05T10:00:00Z',
  },
  {
    id: 'CTRL-031',
    name: 'Quarterly Privileged Access Entitlement Review (PAER)',
    description:
      'Information Security Governance conducts quarterly recertification of Active Directory and database administrative roles. Line managers and identity admins review role memberships.',
    ownerRole: 'Identity & Access Management (IAM) Lead',
    frequency: 'Quarterly',
    businessFunction: 'Information Security & IT Risk',
    designStatus: 'Design Effective',
    evidenceStatus: 'Evidence Available',
    sourceDocumentId: 'INT-IAM-STD-05',
    sourceDocumentVersion: 'v2.8',
    sourceSection: 'Procedure 7.1',
    sourcePage: 19,
    sourceExcerpt:
      'Every 90 days, SailPoint campaigns trigger mandatory sign-off for all Domain Admins and Core Banking DBAs. Segregation rules block manager self-certification.',
    requirementComponentsAddressed: ['RC-003-A', 'RC-003-B', 'RC-003-C'],
    createdAt: '2024-03-01T08:00:00Z',
    updatedAt: '2024-11-20T16:30:00Z',
  },
  {
    id: 'CTRL-040',
    name: 'Daily Treasury Intraday Liquidity Forecasting',
    description:
      'Treasury front office monitors real-time RTGS net settlement positions against central bank account balances and calculates liquidity buffer reserves.',
    ownerRole: 'Head of Treasury Operations',
    frequency: 'Daily',
    businessFunction: 'Treasury & Liquidity Risk',
    designStatus: 'Under Evaluation',
    evidenceStatus: 'Evidence Pending',
    sourceDocumentId: 'INT-TRS-MAN-01',
    sourceDocumentVersion: 'v1.2',
    sourceSection: 'Section 4.3',
    sourcePage: 15,
    sourceExcerpt:
      'Treasury tracks opening and midday net clearings. A liquidity buffer buffer of 5% is maintained at central bank clearing depot.',
    requirementComponentsAddressed: ['RC-004-A'],
    createdAt: '2024-07-01T08:00:00Z',
    updatedAt: '2025-01-10T11:00:00Z',
  },
  {
    id: 'CTRL-055',
    name: 'Ethics Helpline & Whistleblower Intake Channel',
    description:
      'Third-party hosted hotline (EthicsPoint) provides confidential 24/7 telephonic and web-based reporting with caller anonymity protections.',
    ownerRole: 'Chief Ethics & Compliance Officer',
    frequency: 'Continuous',
    businessFunction: 'Legal & Ethics Governance',
    designStatus: 'Design Effective',
    evidenceStatus: 'Evidence Available',
    sourceDocumentId: 'INT-POL-ETH-11',
    sourceDocumentVersion: 'v5.0',
    sourceSection: 'Policy Section 2',
    sourcePage: 8,
    sourceExcerpt:
      'Managed by external vendor with no IP logging or caller ID capture. Reports dispatched to Audit Committee and General Counsel.',
    requirementComponentsAddressed: ['RC-005-A', 'RC-005-B', 'RC-005-C'],
    createdAt: '2023-11-01T08:00:00Z',
    updatedAt: '2024-09-15T09:00:00Z',
  },
  {
    id: 'CTRL-062',
    name: 'Annual Model Risk Governance Bias & Backtesting Review',
    description:
      'Quantitative Risk Group evaluates production credit models for adverse demographic impact, stability indices, and annual backtest predictive performance.',
    ownerRole: 'Head of Model Risk Governance',
    frequency: 'Annual',
    businessFunction: 'Credit Risk & Quantitative Analytics',
    designStatus: 'Design Effective',
    evidenceStatus: 'Evidence Available',
    sourceDocumentId: 'INT-MRG-FRM-03',
    sourceDocumentVersion: 'v2.1',
    sourceSection: 'Review Protocol B',
    sourcePage: 33,
    sourceExcerpt:
      'Formal validation packs completed each Q4 examining feature drift, disparate impact ratio, and Gini coefficient degradation.',
    requirementComponentsAddressed: ['RC-006-A', 'RC-006-B'],
    createdAt: '2024-02-15T08:00:00Z',
    updatedAt: '2024-10-30T15:00:00Z',
  },
  {
    id: 'CTRL-073',
    name: 'Data Privacy Impact Assessment (DPIA) Pre-Clearance',
    description:
      'Enterprise Architecture review board requires Data Privacy Officer sign-off on any system integration involving customer PII transmission.',
    ownerRole: 'Data Protection Officer',
    frequency: 'Event-driven',
    businessFunction: 'Information Security & IT Risk',
    designStatus: 'Deficiency Identified',
    evidenceStatus: 'Insufficient Evidence',
    sourceDocumentId: 'INT-DPO-GUIDE-04',
    sourceDocumentVersion: 'v1.0',
    sourceSection: 'Article 8',
    sourcePage: 11,
    sourceExcerpt:
      'Internal project intake checklist checks if data leaves onshore servers. Formal TIA procedure is currently drafted in interim guidance.',
    requirementComponentsAddressed: ['RC-007-A'],
    createdAt: '2024-08-01T08:00:00Z',
    updatedAt: '2025-01-20T10:00:00Z',
  },
  {
    id: 'CTRL-084',
    name: 'Commercial Portfolio Environmental Sensitivity Tagging',
    description:
      'Credit underwriting officers assign sector-level climate risk codes to commercial borrowing facilities exceeding $5M.',
    ownerRole: 'Commercial Credit Risk Officer',
    frequency: 'At Loan Inception',
    businessFunction: 'Enterprise Risk & ESG',
    designStatus: 'Under Evaluation',
    evidenceStatus: 'Evidence Pending',
    sourceDocumentId: 'INT-ESG-CREDIT-01',
    sourceDocumentVersion: 'v0.9',
    sourceSection: 'Guidance Note 2',
    sourcePage: 7,
    sourceExcerpt:
      'Credit officers tag NAICS codes with high carbon footprint in the loan origination terminal. Scenario stress calculation engine is under procurement.',
    requirementComponentsAddressed: ['RC-008-B'],
    createdAt: '2024-10-01T08:00:00Z',
    updatedAt: '2025-01-18T13:00:00Z',
  },
  {
    id: 'CTRL-099',
    name: 'Generic Information Security Policy Distribution',
    description:
      'Annual employee acknowledgement of employee handbook and basic computing security guidelines via LMS portal.',
    ownerRole: 'Human Resources & IT Training',
    frequency: 'Annual',
    businessFunction: 'Information Security & IT Risk',
    designStatus: 'Draft',
    evidenceStatus: 'Evidence Available',
    sourceDocumentId: 'INT-HR-HANDBOOK',
    sourceDocumentVersion: 'v6.0',
    sourceSection: 'Chapter 9',
    sourcePage: 45,
    sourceExcerpt:
      'Employees complete standard 30-minute click-through cyber safety module upon hiring and annually.',
    requirementComponentsAddressed: [],
    createdAt: '2023-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
];

export const INITIAL_MAPPINGS: ControlMapping[] = [
  // 1. OBL-001 -> CTRL-014 (Partial coverage, suggested, unknown component)
  {
    id: 'MAP-001',
    obligationId: 'OBL-001',
    controlId: 'CTRL-014',
    status: 'Suggested',
    matchScore: 86,
    matchProvider: 'Rule-based Demo Engine (v1.2)',
    matchRationale: {
      positiveCoverage:
        'The control describes periodic quarterly reviews of customer identity records and KYC sampling across channels.',
      potentialGap:
        'The control does not specify escalation SLAs for expired credentials, and audit register documentation procedure is unknown.',
      suggestedReviewerAction:
        'Review whether supplementary control CTRL-015 should be paired to cover discrepancy escalation.',
      scoreBreakdown: {
        componentOverlap: 38,
        processAlignment: 24,
        frequencyOwnerAlignment: 14,
        metadataAlignment: 10,
      },
    },
    coverageAssessments: [
      {
        requirementComponentId: 'RC-001-A',
        status: 'Supported',
        supportingExcerpt:
          'Sampling of accounts across branch and digital channels for validity of identity files.',
        rationale: 'Customer identity documents explicitly targeted in sampling routine.',
        analystReviewed: false,
      },
      {
        requirementComponentId: 'RC-001-B',
        status: 'Supported',
        supportingExcerpt: 'Quarterly sampling of accounts according to established schedule.',
        rationale: 'Quarterly frequency matches periodic review schedule expectations.',
        analystReviewed: false,
      },
      {
        requirementComponentId: 'RC-001-C',
        status: 'Unknown',
        supportingExcerpt: 'Completed worksheets archived in Documentum repository.',
        rationale: 'Archival occurs, but it is unknown if audit log registers meet regulatory logging criteria.',
        analystReviewed: false,
      },
      {
        requirementComponentId: 'RC-001-D',
        status: 'Not supported',
        supportingExcerpt: 'No escalation procedure detailed in Procedure 4.1.',
        rationale: 'Escalation to Compliance Oversight Unit is missing from this specific procedure.',
        analystReviewed: false,
      },
    ],
    createdAt: '2025-02-01T09:00:00Z',
    updatedAt: '2025-02-01T09:00:00Z',
    version: 1,
    active: true,
  },

  // 2. OBL-001 -> CTRL-015 (Pending Review, complementary escalation)
  {
    id: 'MAP-002',
    obligationId: 'OBL-001',
    controlId: 'CTRL-015',
    status: 'Pending Review',
    matchScore: 78,
    matchProvider: 'Rule-based Demo Engine (v1.2)',
    matchRationale: {
      positiveCoverage:
        'Provides automated ticketing and escalation to MLRO triage desk within 3 days.',
      potentialGap:
        'Does not perform the underlying identity review itself; functions strictly as an escalation mechanism.',
      suggestedReviewerAction:
        'Verify SLA alignment and confirm linkage with discovery review controls.',
      scoreBreakdown: {
        componentOverlap: 30,
        processAlignment: 23,
        frequencyOwnerAlignment: 15,
        metadataAlignment: 10,
      },
    },
    coverageAssessments: [
      {
        requirementComponentId: 'RC-001-A',
        status: 'Partially supported',
        supportingExcerpt: 'Deficiencies in onboarding or batch refresh trigger ticketing.',
        rationale: 'Focuses on deficiency records rather than baseline identity verification.',
        analystReviewed: true,
      },
      {
        requirementComponentId: 'RC-001-B',
        status: 'Not supported',
        supportingExcerpt: 'Event-driven on defect detection.',
        rationale: 'Not a scheduled periodic review mechanism.',
        analystReviewed: true,
      },
      {
        requirementComponentId: 'RC-001-C',
        status: 'Supported',
        supportingExcerpt: 'JIRA Compliance tickets maintain immutable audit timestamps.',
        rationale: 'Meets formal audit register criteria.',
        analystReviewed: true,
      },
      {
        requirementComponentId: 'RC-001-D',
        status: 'Supported',
        supportingExcerpt: 'Routed directly to the MLRO triage desk within 3 business days.',
        rationale: 'Prompt escalation requirement is fully corroborated.',
        analystReviewed: true,
      },
    ],
    reviewerRationale:
      'Proposed as a secondary control to satisfy escalation and audit trail requirements.',
    reviewedBy: 'Elena Rostova (Compliance Analyst)',
    reviewedAt: '2025-02-05T14:30:00Z',
    createdAt: '2025-02-01T09:00:00Z',
    updatedAt: '2025-02-05T14:30:00Z',
    version: 1,
    active: true,
  },

  // 3. OBL-002 -> CTRL-022 (Approved mapping, complete component coverage)
  {
    id: 'MAP-003',
    obligationId: 'OBL-002',
    controlId: 'CTRL-022',
    status: 'Approved',
    matchScore: 94,
    matchProvider: 'Rule-based Demo Engine (v1.2)',
    matchRationale: {
      positiveCoverage:
        'Daily automated batch processing flags alerts within 24 hours and investigator protocol mandates 48-hour referral transmission.',
      potentialGap: 'Minor dependence on manual triage team capacity during surge volume periods.',
      suggestedReviewerAction: 'Approved baseline mapping based on operational procedure test.',
      scoreBreakdown: {
        componentOverlap: 48,
        processAlignment: 24,
        frequencyOwnerAlignment: 14,
        metadataAlignment: 8,
      },
    },
    coverageAssessments: [
      {
        requirementComponentId: 'RC-002-A',
        status: 'Supported',
        supportingExcerpt: 'Nightly automated ingest at 00:00 GMT triaged within 24 hours.',
        rationale: 'Operational runtimes strictly enforce 24-hour alerting SLA.',
        analystReviewed: true,
        reviewerNote: 'Corroborated against Q4 SOC-1 operational test metrics.',
      },
      {
        requirementComponentId: 'RC-002-B',
        status: 'Supported',
        supportingExcerpt: 'Confirmed amber alerts generate referrals to Financial Crimes Intelligence within 48h.',
        rationale: 'Clear procedure and evidence records substantiate 48h handover.',
        analystReviewed: true,
        reviewerNote: 'Surveillance policy Section 3.2 verifies referral handover.',
      },
    ],
    reviewerRationale:
      'Control CTRL-022 thoroughly addresses both 24-hour detection and 48-hour referral dispatch components. Tested operational metrics show 99.4% SLA adherence.',
    reviewerNotes: 'Quarterly spot-check sample recommended for surge volume periods.',
    reviewedBy: 'Marcus Vance (Senior Compliance Officer)',
    reviewedAt: '2025-02-08T16:00:00Z',
    createdAt: '2025-02-02T10:00:00Z',
    updatedAt: '2025-02-08T16:00:00Z',
    version: 1,
    active: true,
  },

  // 4. OBL-003 -> CTRL-031 (Approved mapping, complete coverage)
  {
    id: 'MAP-004',
    obligationId: 'OBL-003',
    controlId: 'CTRL-031',
    status: 'Approved',
    matchScore: 96,
    matchProvider: 'Rule-based Demo Engine (v1.2)',
    matchRationale: {
      positiveCoverage:
        'Automated SailPoint quarterly certification directly covers privileged Active Directory and core banking ledger DBAs with anti-self-approval enforcement.',
      potentialGap: 'None identified for core systems. Cloud infrastructure covered under separate policy.',
      suggestedReviewerAction: 'Maintain current mapping; re-evaluate if ledger migrated to SaaS.',
      scoreBreakdown: {
        componentOverlap: 50,
        processAlignment: 23,
        frequencyOwnerAlignment: 15,
        metadataAlignment: 8,
      },
    },
    coverageAssessments: [
      {
        requirementComponentId: 'RC-003-A',
        status: 'Supported',
        supportingExcerpt: 'Domain Admins and Core Banking DBAs included in SailPoint campaigns.',
        rationale: 'Explicitly covers core ledger infrastructure credentials.',
        analystReviewed: true,
      },
      {
        requirementComponentId: 'RC-003-B',
        status: 'Supported',
        supportingExcerpt: 'SailPoint campaigns trigger every 90 days.',
        rationale: '90-day cadence meets statutory quarterly frequency.',
        analystReviewed: true,
      },
      {
        requirementComponentId: 'RC-003-C',
        status: 'Supported',
        supportingExcerpt: 'Segregation rules block manager self-certification.',
        rationale: 'Independent supervisor verification enforced via system logic.',
        analystReviewed: true,
      },
    ],
    reviewerRationale:
      'Control CTRL-031 provides end-to-end technical enforcement for quarterly privileged ledger credential recertification with strict segregation of duties.',
    reviewerNotes: 'IAM team provided automated report sample verifying zero self-approvals.',
    reviewedBy: 'Sarah Jenkins (IT Risk Director)',
    reviewedAt: '2025-02-10T11:15:00Z',
    createdAt: '2025-02-03T11:00:00Z',
    updatedAt: '2025-02-10T11:15:00Z',
    version: 1,
    active: true,
  },

  // 5. OBL-003 -> CTRL-099 (Rejected mapping demo example)
  {
    id: 'MAP-005',
    obligationId: 'OBL-003',
    controlId: 'CTRL-099',
    status: 'Rejected',
    matchScore: 32,
    matchProvider: 'Rule-based Demo Engine (v1.2)',
    matchRationale: {
      positiveCoverage: 'Mentions annual employee computing security awareness.',
      potentialGap:
        'Fails on all critical points: annual frequency does not satisfy quarterly rule, no privileged account scope, no supervisory reconciliation.',
      suggestedReviewerAction: 'Reject candidate mapping. Lacks substantive operational controls.',
      scoreBreakdown: {
        componentOverlap: 10,
        processAlignment: 10,
        frequencyOwnerAlignment: 8,
        metadataAlignment: 4,
      },
    },
    coverageAssessments: [
      {
        requirementComponentId: 'RC-003-A',
        status: 'Not supported',
        supportingExcerpt: 'General LMS training module for all staff.',
        rationale: 'Does not target privileged ledger credentials.',
        analystReviewed: true,
      },
      {
        requirementComponentId: 'RC-003-B',
        status: 'Not supported',
        supportingExcerpt: 'Completed annually.',
        rationale: 'Fails 90-day quarterly recertification requirement.',
        analystReviewed: true,
      },
      {
        requirementComponentId: 'RC-003-C',
        status: 'Not supported',
        supportingExcerpt: 'Self-attestation in LMS.',
        rationale: 'No independent supervisory reconciliation.',
        analystReviewed: true,
      },
    ],
    rejectionReason:
      'Generic training policy CTRL-099 does not constitute an operational technical control for privileged credential recertification.',
    reviewerNotes: 'Rejected candidate suggested by broad keyword matching.',
    reviewedBy: 'Sarah Jenkins (IT Risk Director)',
    reviewedAt: '2025-02-09T09:20:00Z',
    createdAt: '2025-02-03T11:00:00Z',
    updatedAt: '2025-02-09T09:20:00Z',
    version: 1,
    active: false,
  },

  // 6. OBL-004 -> CTRL-040 (Needs Information example)
  {
    id: 'MAP-004-A',
    obligationId: 'OBL-004',
    controlId: 'CTRL-040',
    status: 'Needs Information',
    matchScore: 68,
    matchProvider: 'Rule-based Demo Engine (v1.2)',
    matchRationale: {
      positiveCoverage: 'Captures daily net settlement positions and maintains liquidity reserves at central bank.',
      potentialGap:
        'Control policy mentions 5% buffer, whereas regulatory requirement mandates at least 8% over peak 1-day demand.',
      suggestedReviewerAction:
        'Request confirmation from Treasury Operations regarding whether buffer threshold has been elevated to 8%.',
      scoreBreakdown: {
        componentOverlap: 28,
        processAlignment: 20,
        frequencyOwnerAlignment: 12,
        metadataAlignment: 8,
      },
    },
    coverageAssessments: [
      {
        requirementComponentId: 'RC-004-A',
        status: 'Supported',
        supportingExcerpt: 'Tracks opening and midday net clearings daily.',
        rationale: 'Daily calculation of intraday settlement outflows is documented.',
        analystReviewed: true,
      },
      {
        requirementComponentId: 'RC-004-B',
        status: 'Partially supported',
        supportingExcerpt: 'Liquidity buffer of 5% is maintained at central bank clearing depot.',
        rationale: '5% buffer falls below required 8% statutory threshold.',
        analystReviewed: true,
      },
    ],
    requestedInformation: {
      informationRequired:
        'Treasury policy addendum demonstrating current operational liquid buffer is calibrated to at least 8% rather than historical 5%.',
      reason:
        'Current written manual reflects 5% cushion which creates an immediate compliance gap against SLAR-Part 5 Section 5.3.',
      requestedResponsibleFunction: 'Treasury Operations',
      dueDate: '2025-03-15',
      requestedAt: '2025-02-11T13:40:00Z',
      requestedBy: 'Elena Rostova (Compliance Analyst)',
    },
    reviewedBy: 'Elena Rostova (Compliance Analyst)',
    reviewedAt: '2025-02-11T13:40:00Z',
    createdAt: '2025-02-04T12:00:00Z',
    updatedAt: '2025-02-11T13:40:00Z',
    version: 1,
    active: true,
  },

  // 7. OBL-005 -> CTRL-055 (Draft mapping)
  {
    id: 'MAP-005-A',
    obligationId: 'OBL-005',
    controlId: 'CTRL-055',
    status: 'Draft',
    matchScore: 91,
    matchProvider: 'Rule-based Demo Engine (v1.2)',
    matchRationale: {
      positiveCoverage:
        'External EthicsPoint hotline ensures 24/7 availability with zero IP or caller identity capture.',
      potentialGap:
        'Verification needed that annual distribution of written anti-retaliation policy covers contractors in addition to permanent staff.',
      suggestedReviewerAction: 'Inspect HR contractor onboarding packets before final sign-off.',
      scoreBreakdown: {
        componentOverlap: 46,
        processAlignment: 22,
        frequencyOwnerAlignment: 14,
        metadataAlignment: 9,
      },
    },
    coverageAssessments: [
      {
        requirementComponentId: 'RC-005-A',
        status: 'Supported',
        supportingExcerpt: 'External vendor with 24/7 telephonic and web-based reporting.',
        rationale: 'Fully meets air-gapped intake channel mandate.',
        analystReviewed: true,
      },
      {
        requirementComponentId: 'RC-005-B',
        status: 'Supported',
        supportingExcerpt: 'No IP logging or caller ID capture.',
        rationale: 'Guarantees complete technical anonymity.',
        analystReviewed: true,
      },
      {
        requirementComponentId: 'RC-005-C',
        status: 'Partially supported',
        supportingExcerpt: 'Policy distributed to employees; contractor distribution pending HR review.',
        rationale: 'Contractor onboarding attestation requires cross-check.',
        analystReviewed: true,
      },
    ],
    reviewerRationale:
      'Preliminary evaluation demonstrates excellent technical hotline coverage. Final approval pending contractor distribution confirmation.',
    reviewedBy: 'Marcus Vance (Senior Compliance Officer)',
    reviewedAt: '2025-02-12T15:00:00Z',
    createdAt: '2025-02-05T09:00:00Z',
    updatedAt: '2025-02-12T15:00:00Z',
    version: 1,
    active: true,
  },

  // 8. OBL-006 -> CTRL-062 (Suggested mapping)
  {
    id: 'MAP-006-A',
    obligationId: 'OBL-006',
    controlId: 'CTRL-062',
    status: 'Suggested',
    matchScore: 88,
    matchProvider: 'Rule-based Demo Engine (v1.2)',
    matchRationale: {
      positiveCoverage:
        'Model Risk validation packs inspect disparate impact ratios and conduct annual backtesting on underwriting models.',
      potentialGap:
        'Independence of Model Risk Governance body from credit origination hierarchy must be documented.',
      suggestedReviewerAction: 'Review Model Risk committee charter to verify reporting lines.',
      scoreBreakdown: {
        componentOverlap: 44,
        processAlignment: 22,
        frequencyOwnerAlignment: 13,
        metadataAlignment: 9,
      },
    },
    coverageAssessments: [
      {
        requirementComponentId: 'RC-006-A',
        status: 'Supported',
        supportingExcerpt: 'Examines disparate impact ratio and feature drift annually.',
        rationale: 'Directly addresses algorithmic bias review requirements.',
        analystReviewed: false,
      },
      {
        requirementComponentId: 'RC-006-B',
        status: 'Supported',
        supportingExcerpt: 'Gini coefficient degradation and out-of-time benchmarking conducted in Q4.',
        rationale: 'Backtesting requirement supported by formal Q4 pack protocol.',
        analystReviewed: false,
      },
    ],
    createdAt: '2025-02-06T10:00:00Z',
    updatedAt: '2025-02-06T10:00:00Z',
    version: 1,
    active: true,
  },

  // 9. OBL-007 -> CTRL-073 (Suggested mapping with severe deficiency)
  {
    id: 'MAP-007-A',
    obligationId: 'OBL-007',
    controlId: 'CTRL-073',
    status: 'Suggested',
    matchScore: 54,
    matchProvider: 'Rule-based Demo Engine (v1.2)',
    matchRationale: {
      positiveCoverage: 'Project intake checklist flags offshore server transmittals.',
      potentialGap:
        'Control has known design deficiency: formal TIA procedure is only drafted, and technical encryption controls are not audited.',
      suggestedReviewerAction:
        'Reject or request information on remediation timeline for DPO guidance finalization.',
      scoreBreakdown: {
        componentOverlap: 22,
        processAlignment: 14,
        frequencyOwnerAlignment: 10,
        metadataAlignment: 8,
      },
    },
    coverageAssessments: [
      {
        requirementComponentId: 'RC-007-A',
        status: 'Partially supported',
        supportingExcerpt: 'Checklist checks if data leaves onshore servers; formal TIA in draft.',
        rationale: 'Intake exists but formal TIA execution is not yet operationalized.',
        analystReviewed: false,
      },
      {
        requirementComponentId: 'RC-007-B',
        status: 'Not supported',
        supportingExcerpt: 'No technical encryption audit procedures specified in Guide 04.',
        rationale: 'Lacks documented encryption verification controls.',
        analystReviewed: false,
      },
    ],
    createdAt: '2025-02-07T11:00:00Z',
    updatedAt: '2025-02-07T11:00:00Z',
    version: 1,
    active: true,
  },

  // 10. OBL-008 -> CTRL-084 (Suggested mapping with major gaps)
  {
    id: 'MAP-008-A',
    obligationId: 'OBL-008',
    controlId: 'CTRL-084',
    status: 'Suggested',
    matchScore: 48,
    matchProvider: 'Rule-based Demo Engine (v1.2)',
    matchRationale: {
      positiveCoverage: 'Underwriters tag commercial loans with high carbon footprint NAICS codes.',
      potentialGap:
        'Scenario stress simulation engine is not yet procured; semi-annual reporting is not institutionalized.',
      suggestedReviewerAction:
        'Mark as partial coverage only. Obligation remains substantially unmitigated until simulation tooling is live.',
      scoreBreakdown: {
        componentOverlap: 20,
        processAlignment: 12,
        frequencyOwnerAlignment: 10,
        metadataAlignment: 6,
      },
    },
    coverageAssessments: [
      {
        requirementComponentId: 'RC-008-A',
        status: 'Not supported',
        supportingExcerpt: 'Scenario stress calculation engine is under procurement.',
        rationale: 'Simulation tool does not exist in production.',
        analystReviewed: false,
      },
      {
        requirementComponentId: 'RC-008-B',
        status: 'Partially supported',
        supportingExcerpt: 'Credit officers tag NAICS codes with high carbon footprint.',
        rationale: 'Tagging enables disclosure data collection, but statutory Pillar 3 reporting workflow is absent.',
        analystReviewed: false,
      },
    ],
    createdAt: '2025-02-08T12:00:00Z',
    updatedAt: '2025-02-08T12:00:00Z',
    version: 1,
    active: true,
  },

  // 11. OBL-001 -> CTRL-031 (Low relevance candidate mapping)
  {
    id: 'MAP-001-C',
    obligationId: 'OBL-001',
    controlId: 'CTRL-031',
    status: 'Suggested',
    matchScore: 24,
    matchProvider: 'Rule-based Demo Engine (v1.2)',
    matchRationale: {
      positiveCoverage: 'Both obligations involve recurring reviews and schedule enforcement.',
      potentialGap:
        'CTRL-031 reviews internal employee IT access credentials, which does not address customer identity / KYC obligations.',
      suggestedReviewerAction: 'Reject suggestion. False semantic match on generic review terminology.',
      scoreBreakdown: {
        componentOverlap: 8,
        processAlignment: 6,
        frequencyOwnerAlignment: 6,
        metadataAlignment: 4,
      },
    },
    coverageAssessments: [
      {
        requirementComponentId: 'RC-001-A',
        status: 'Not supported',
        supportingExcerpt: 'Focuses strictly on Active Directory & DB admin roles.',
        rationale: 'Customer records are entirely out of scope for IT access reviews.',
        analystReviewed: false,
      },
      {
        requirementComponentId: 'RC-001-B',
        status: 'Partially supported',
        supportingExcerpt: 'Conducted every 90 days.',
        rationale: 'Frequency is periodic, but scope is incorrect.',
        analystReviewed: false,
      },
      {
        requirementComponentId: 'RC-001-C',
        status: 'Unknown',
        supportingExcerpt: 'SailPoint audit logs.',
        rationale: 'IT audit log not equivalent to banking KYC register.',
        analystReviewed: false,
      },
      {
        requirementComponentId: 'RC-001-D',
        status: 'Not supported',
        supportingExcerpt: 'No customer discrepancy handling.',
        rationale: 'Not an applicable escalation mechanism for customer records.',
        analystReviewed: false,
      },
    ],
    createdAt: '2025-02-09T08:00:00Z',
    updatedAt: '2025-02-09T08:00:00Z',
    version: 1,
    active: true,
  },

  // 12. OBL-002 -> CTRL-015 (Secondary candidate for OBL-002)
  {
    id: 'MAP-002-B',
    obligationId: 'OBL-002',
    controlId: 'CTRL-015',
    status: 'Suggested',
    matchScore: 58,
    matchProvider: 'Rule-based Demo Engine (v1.2)',
    matchRationale: {
      positiveCoverage: 'Automated ticketing routes deficiencies to compliance desk with SLA.',
      potentialGap:
        'Ticketing system does not ingest high-frequency transaction stream alerts or generate FINCEN SAR referrals.',
      suggestedReviewerAction: 'Do not use as primary control; CTRL-022 is the authoritative control.',
      scoreBreakdown: {
        componentOverlap: 24,
        processAlignment: 16,
        frequencyOwnerAlignment: 10,
        metadataAlignment: 8,
      },
    },
    coverageAssessments: [
      {
        requirementComponentId: 'RC-002-A',
        status: 'Not supported',
        supportingExcerpt: 'Ticketing triggered by customer record discrepancies.',
        rationale: 'Does not monitor anomalous transaction volume.',
        analystReviewed: false,
      },
      {
        requirementComponentId: 'RC-002-B',
        status: 'Partially supported',
        supportingExcerpt: 'Directly routes to MLRO within 3 days.',
        rationale: '3 days exceeds the 48-hour requirement for transaction escalation.',
        analystReviewed: false,
      },
    ],
    createdAt: '2025-02-09T10:00:00Z',
    updatedAt: '2025-02-09T10:00:00Z',
    version: 1,
    active: true,
  },
];

export const INITIAL_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'AUD-001',
    entityType: 'Mapping',
    entityId: 'MAP-003',
    action: 'Mapping approved',
    actorId: 'usr-mvance',
    actorDisplayName: 'Marcus Vance (Senior Compliance Officer)',
    timestamp: '2025-02-08T16:00:00Z',
    previousState: 'Pending Review',
    newState: 'Approved',
    reason:
      'Control CTRL-022 thoroughly addresses both 24-hour detection and 48-hour referral dispatch components. Tested operational metrics show 99.4% SLA adherence.',
    relatedRecordIds: ['OBL-002', 'CTRL-022'],
  },
  {
    id: 'AUD-002',
    entityType: 'Mapping',
    entityId: 'MAP-004',
    action: 'Mapping approved',
    actorId: 'usr-sjenkins',
    actorDisplayName: 'Sarah Jenkins (IT Risk Director)',
    timestamp: '2025-02-10T11:15:00Z',
    previousState: 'Pending Review',
    newState: 'Approved',
    reason:
      'Control CTRL-031 provides end-to-end technical enforcement for quarterly privileged ledger credential recertification with strict segregation of duties.',
    relatedRecordIds: ['OBL-003', 'CTRL-031'],
  },
  {
    id: 'AUD-003',
    entityType: 'Mapping',
    entityId: 'MAP-005',
    action: 'Mapping rejected',
    actorId: 'usr-sjenkins',
    actorDisplayName: 'Sarah Jenkins (IT Risk Director)',
    timestamp: '2025-02-09T09:20:00Z',
    previousState: 'Suggested',
    newState: 'Rejected',
    reason:
      'Generic training policy CTRL-099 does not constitute an operational technical control for privileged credential recertification.',
    relatedRecordIds: ['OBL-003', 'CTRL-099'],
  },
  {
    id: 'AUD-004',
    entityType: 'Mapping',
    entityId: 'MAP-004-A',
    action: 'Information requested',
    actorId: 'usr-erostova',
    actorDisplayName: 'Elena Rostova (Compliance Analyst)',
    timestamp: '2025-02-11T13:40:00Z',
    previousState: 'Suggested',
    newState: 'Needs Information',
    reason:
      'Treasury policy addendum demonstrating current operational liquid buffer is calibrated to at least 8% rather than historical 5%.',
    relatedRecordIds: ['OBL-004', 'CTRL-040'],
  },
  {
    id: 'AUD-005',
    entityType: 'Mapping',
    entityId: 'MAP-002',
    action: 'Mapping submitted for review',
    actorId: 'usr-erostova',
    actorDisplayName: 'Elena Rostova (Compliance Analyst)',
    timestamp: '2025-02-05T14:30:00Z',
    previousState: 'Suggested',
    newState: 'Pending Review',
    reason: 'Proposed as secondary escalation control for customer identity reviews.',
    relatedRecordIds: ['OBL-001', 'CTRL-015'],
  },
  {
    id: 'AUD-006',
    entityType: 'Mapping',
    entityId: 'MAP-005-A',
    action: 'Mapping draft saved',
    actorId: 'usr-mvance',
    actorDisplayName: 'Marcus Vance (Senior Compliance Officer)',
    timestamp: '2025-02-12T15:00:00Z',
    previousState: 'Suggested',
    newState: 'Draft',
    reason: 'Analyst inspected hotline specifications; awaiting contractor onboarding validation.',
    relatedRecordIds: ['OBL-005', 'CTRL-055'],
  },
];
