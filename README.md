# RegulaTrace AI — Regulatory Obligation-to-Control Mapping Workbench

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg?style=flat-square&logo=react)](https://react.dev/)
[![Radix UI](https://img.shields.io/badge/Radix%20UI-Primitives-black.svg?style=flat-square)](https://www.radix-ui.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Acceptance%20Tests-20%2F20%20Passing-emerald.svg?style=flat-square&logo=vitest)](https://vitest.dev/)
[![Compliance](https://img.shields.io/badge/Standard-Banking%20GRC-0F766E.svg?style=flat-square)](#)

> **RegulaTrace AI** is an enterprise decision-support workbench engineered for financial institutions. It establishes traceable linkages between complex statutory banking obligations and internal operational controls, decomposing mandates into verifiable requirement components, computing explainable match scores, and preserving immutable audit registers.

---

## Architecture Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                        REGULATORY INGESTION                            │
│  Prudential Statutes • Supervisory Circulars • Cyber Standards (SCRF)  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  OBLIGATION DECOMPOSITION ENGINE                       │
│  Normalized Requirement ──► Requirement Components [RC-001, RC-002...] │
│  Document IDs • Section Citations • Verbatim Statutory Excerpts        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│             CANDIDATE INTERNAL CONTROLS MATCH ENGINE                   │
│                                                                        │
│   Component Overlap    Process Alignment    Cadence & Ownership        │
│       (Max 50 pts)        (Max 25 pts)          (Max 15 pts)           │
│                                                                        │
│            Supporting Metadata (Design + Evidence Readiness)           │
│                              (Max 10 pts)                              │
│                                                                        │
│                 ►► DETERMINISTIC SCORE (0–100) ◄◄                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     ANALYST DECISION WORKSPACE                         │
│                                                                        │
│  [Supported]       [Partially Supported]     [Not Supported] [Unknown] │
│                                                                        │
│      ├── Approve: Mandatory Rationale + Explicit Gap Acknowledgment   │
│      ├── Reject: Mandatory Rejection Reason (Excludes Active Scope)   │
│      ├── Needs Info: Dispatch Inquiry to First-Line Control Owners     │
│      └── Supersede: Preserves Approved Baseline & Issues Re-review    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       AUDIT & GOVERNANCE STORE                         │
│  Append-Only Audit Log • RFC 4180 CSV Register • Versioned Repository │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Key Features

### 1. Executive Control Portfolio Metrics
* Real-time calculation of **Total Obligations**, **Pending Review**, **Approved Mappings**, and **Unmapped Obligations**.
* Interactive metric cards trigger immediate table filtering.
* Clear tooltips define counting logic and residual risk.

### 2. Regulatory Obligation Explorer
* Multi-attribute filtering across **Regulation**, **Applicability**, **Mapping Status**, and **Business Function**.
* High-performance case-insensitive search across IDs, statutory titles, and clause numbers.
* Keyboard-accessible (`Enter` / `Space`) selection navigation.

### 3. Statutory Source Verification Modal
* Powered by accessible **Radix Dialog** primitives.
* Displays normalized requirements alongside verbatim source excerpts, document version, section, and page citations.
* Prominently flags synthetic training/demo corpora with zero false claims of legal verification.

### 4. Explainable Candidate Control Scoring
Deterministic heuristic model (0–100 scale) breaking down:
* **Requirement Overlap (50%)**: Granular mapping against individual requirement components.
* **Process Alignment (25%)**: Departmental scope and supervisory procedure alignment.
* **Frequency & Cadence (15%)**: Alignment of control cycles (quarterly, daily, event-driven) with statutory timing.
* **Metadata & Evidence (10%)**: Verification of design effectiveness and test evidence readiness.

### 5. Granular Component-Level Coverage Matrix
Every obligation is broken into verifiable atomic components evaluated across four states:
* `Supported`: Corroborated with specific control evidence and operational worksheets.
* `Partially Supported`: Control addresses requirement partially but lacks population scope or cadence.
* `Not Supported`: Requirement component explicitly absent from control baseline.
* `Unknown`: Insufficient metadata found in control descriptions; requires operational inquiry.

### 6. Defensible Analyst Workflow & Audit Trail
* **Approval Gate**: Requires minimum 10-character compliance rationale and mandatory acknowledgment of residual gaps.
* **Rejection Ledger**: Disqualifies controls from active coverage while etching reasons into history.
* **Information Inquiries**: Dispatches structured requests to business units with target SLAs.
* **Supersede Versioning**: Re-evaluating approved mappings creates version increments requiring re-approval.
* **Immutable Audit Trail**: Append-only log tracking actors, timestamps, state transitions, and justification rationale.
* **RFC 4180 CSV Export**: One-click download of the complete mapping register respecting active filters.

---

## Data Model

```typescript
// Core Entities
interface RegulatoryObligation {
  id: string;                      // e.g. "OBL-001"
  title: string;
  normalizedRequirement: string;
  regulationName: string;
  sourceDocumentId: string;
  sourceSection: string;
  sourcePage?: number | string;
  sourceExcerpt: string;
  jurisdiction: string;
  businessFunction: string;
  applicabilityStatus: 'Applicable' | 'Conditionally Applicable' | 'Not Applicable' | 'Under Review';
  sourceVerificationStatus: 'Synthetic Demo' | 'Verified Document' | 'Pending Verification';
  requirementComponents: RequirementComponent[];
}

interface RequirementComponent {
  id: string;                      // e.g. "RC-001-A"
  obligationId: string;
  statement: string;
  sourceExcerpt: string;
  sourceSection: string;
}

interface InternalControl {
  id: string;                      // e.g. "CTRL-014"
  name: string;
  description: string;
  ownerRole: string;
  frequency: string;
  businessFunction: string;
  designStatus: 'Design Effective' | 'Deficiency Identified' | 'Under Evaluation' | 'Draft';
  evidenceStatus: 'Evidence Available' | 'Evidence Pending' | 'Insufficient Evidence';
}

interface ControlMapping {
  id: string;                      // e.g. "MAP-001"
  obligationId: string;
  controlId: string;
  status: 'Suggested' | 'Draft' | 'Pending Review' | 'Needs Information' | 'Approved' | 'Rejected' | 'Superseded';
  matchScore: number;              // 0-100
  coverageAssessments: CoverageAssessment[];
  reviewerRationale?: string;
  version: number;
  active: boolean;
}
```

---

## Acceptance Test Suite (20/20 Passing)

The test suite validates compliance workflows, accessibility, error resilience, and persistence:

| Test ID | Test Scenario | Verified Behavior |
| :---: | :--- | :--- |
| **TEST 1** | Initial Shell Render | Shell renders with active Obligation Mapping, branding, and seed metrics. |
| **TEST 2** | Obligation Selection | Selecting table rows updates obligation details, candidate controls, and timeline. |
| **TEST 3** | Text & ID Search | Case-insensitive search filters records and synchronizes counts. |
| **TEST 4** | Combined Multi-Filters | Multi-filter conjunction correctly isolates applicable approved mappings. |
| **TEST 5** | Source Inspection | Radix modal displays verbatim text with synthetic disclosure badge. |
| **TEST 6** | Candidate Discovery | Controls display scores, positive coverage, gaps, and suggested actions. |
| **TEST 7** | Coverage Editing | Analyst updates component statuses; draft persists and logs audit event. |
| **TEST 8** | Complete Approval | Approving complete mapping requires rationale and updates active coverage. |
| **TEST 9** | Partial Approval | Residual gaps enforce mandatory acknowledgment checkbox before approval. |
| **TEST 10** | Rejection Workflow | Rejections require reason, transition to Rejected, and exclude from coverage. |
| **TEST 11** | Information Inquiries | Requests move mapping to Needs Information with inquiry ticket metadata. |
| **TEST 12** | Supersede Lifecycle | Editing approved controls creates version increments and requires re-approval. |
| **TEST 13** | Dynamic Metrics | Portfolio totals dynamically recalculate upon all mutations. |
| **TEST 14** | CSV Register Export | Downloads RFC 4180-compliant CSV with properly quoted and escaped cells. |
| **TEST 15** | Persistence Integrity | Decisions survive page reloads through repository adapter without duplicates. |
| **TEST 16** | Deterministic Reset | Confirmation dialog cleanly restores baseline seed state with audit entry. |
| **TEST 17** | Input Validation | Zod schema rejects empty, whitespace, or insufficient approval rationales. |
| **TEST 18** | Storage Error Resilience | Simulated storage disk write failures display user-facing recovery banners. |
| **TEST 19** | Keyboard Accessibility | Table items respond to `Enter` and `Space` keyboard navigation. |
| **TEST 20** | Responsive Viewport | Two-column layout stacks seamlessly on compact displays without horizontal overflow. |

---

## Quickstart

### Prerequisites
* **Node.js** 18+ or 20+
* **npm** 9+

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/your-username/regulatrace-ai.git
cd regulatrace-ai

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Run automated test suite
npm test

# 5. Typecheck & lint codebase
npm run lint

# 6. Production build
npm run build
```

---

## Decision-Support Notice

> **Decision-Support Boundary:** RegulaTrace AI assists compliance officers and risk managers in investigating relationships between regulatory obligations and internal control baselines. It provides traceable, defensible documentation of analyst decisions. Approval of an obligation-to-control mapping verifies relationship alignment and does not independently certify legal compliance or operational control effectiveness.

---

## License

Apache-2.0
