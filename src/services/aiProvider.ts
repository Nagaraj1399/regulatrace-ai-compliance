import {
  RegulatoryObligation,
  InternalControl,
  CoverageAssessment,
  MatchRationale,
  CoverageStatus,
} from '../types';

export interface MappingSuggestionResult {
  matchScore: number;
  matchProvider: string;
  matchRationale: MatchRationale;
  coverageAssessments: CoverageAssessment[];
}

export interface AIProvider {
  name: string;
  isRealAI: boolean;
  generateSuggestion(
    obligation: RegulatoryObligation,
    control: InternalControl
  ): Promise<MappingSuggestionResult>;
}

export class DeterministicRuleBasedProvider implements AIProvider {
  public name = 'Rule-based Demo Engine (v1.2)';
  public isRealAI = false;

  public async generateSuggestion(
    obligation: RegulatoryObligation,
    control: InternalControl
  ): Promise<MappingSuggestionResult> {
    const obText = `${obligation.title} ${obligation.normalizedRequirement} ${obligation.sourceExcerpt}`.toLowerCase();
    const ctrlText = `${control.name} ${control.description} ${control.sourceExcerpt}`.toLowerCase();

    // 1. Calculate Component Overlap (up to 50 points)
    const assessments: CoverageAssessment[] = obligation.requirementComponents.map((rc) => {
      const rcWords = rc.statement
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 3);

      let matchedWords = 0;
      for (const w of rcWords) {
        if (ctrlText.includes(w)) matchedWords++;
      }

      const matchRatio = rcWords.length > 0 ? matchedWords / rcWords.length : 0;
      let status: CoverageStatus = 'Unknown';
      let rationale = '';
      let supportingExcerpt = '';

      if (matchRatio >= 0.5) {
        status = 'Supported';
        rationale = `Control text matches key terms from ${rc.statement.slice(0, 35)}...`;
        supportingExcerpt = control.sourceExcerpt || control.description;
      } else if (matchRatio >= 0.25) {
        status = 'Partially supported';
        rationale = `Partial alignment with requirement component terms. Further evidence required.`;
        supportingExcerpt = control.description;
      } else if (
        rc.statement.toLowerCase().includes('escalat') &&
        !ctrlText.includes('escalat') &&
        !ctrlText.includes('triage')
      ) {
        status = 'Not supported';
        rationale = 'Explicit escalation mechanism absent from control description.';
        supportingExcerpt = 'No escalation procedure identified in control baseline.';
      } else {
        status = 'Unknown';
        rationale = 'No conclusive positive or negative evidence in current metadata.';
        supportingExcerpt = 'No specific reference found in documented procedure.';
      }

      return {
        requirementComponentId: rc.id,
        status,
        supportingExcerpt,
        rationale,
        analystReviewed: false,
      };
    });

    const supportedCount = assessments.filter((a) => a.status === 'Supported').length;
    const partialCount = assessments.filter((a) => a.status === 'Partially supported').length;
    const totalComponents = obligation.requirementComponents.length || 1;

    const componentOverlap = Math.min(
      50,
      Math.round(((supportedCount * 1.0 + partialCount * 0.5) / totalComponents) * 50)
    );

    // 2. Operational process alignment (up to 25 points)
    let processAlignment = 0;
    const sameFunction = obligation.businessFunction.toLowerCase() === control.businessFunction.toLowerCase();
    if (sameFunction) {
      processAlignment += 15;
    } else {
      processAlignment += 5;
    }

    if (
      (obText.includes('review') && ctrlText.includes('review')) ||
      (obText.includes('monitor') && ctrlText.includes('monitor')) ||
      (obText.includes('access') && ctrlText.includes('access'))
    ) {
      processAlignment += 10;
    }
    processAlignment = Math.min(25, processAlignment);

    // 3. Frequency & Ownership alignment (up to 15 points)
    let frequencyOwnerAlignment = 0;
    if (control.frequency === 'Quarterly' || control.frequency === 'Daily' || control.frequency === 'Continuous') {
      frequencyOwnerAlignment += 8;
    } else {
      frequencyOwnerAlignment += 4;
    }
    if (control.ownerRole && control.ownerRole.length > 5) {
      frequencyOwnerAlignment += 7;
    }
    frequencyOwnerAlignment = Math.min(15, frequencyOwnerAlignment);

    // 4. Metadata & Evidence alignment (up to 10 points)
    let metadataAlignment = 0;
    if (control.designStatus === 'Design Effective') metadataAlignment += 5;
    else if (control.designStatus === 'Under Evaluation') metadataAlignment += 2;

    if (control.evidenceStatus === 'Evidence Available') metadataAlignment += 5;
    else if (control.evidenceStatus === 'Evidence Pending') metadataAlignment += 2;
    metadataAlignment = Math.min(10, metadataAlignment);

    const totalScore = Math.min(100, componentOverlap + processAlignment + frequencyOwnerAlignment + metadataAlignment);

    const positiveCoverage =
      supportedCount > 0
        ? `The control provides documented operational support for ${supportedCount} of ${totalComponents} obligation components with established ${control.frequency.toLowerCase()} execution.`
        : `Control provides general functional alignment within ${control.businessFunction}.`;

    const potentialGap =
      assessments.some((a) => a.status === 'Not supported' || a.status === 'Unknown')
        ? `Identified ${assessments.filter((a) => a.status === 'Not supported').length} unsupported and ${assessments.filter((a) => a.status === 'Unknown').length} unknown requirement components requiring verification.`
        : 'Minor operational documentation refinement may be required.';

    const suggestedReviewerAction =
      totalScore >= 80
        ? 'Review component evidence and confirm exception handling before formal approval.'
        : totalScore >= 50
        ? 'Examine whether complementary controls should be mapped or request further information from control owner.'
        : 'Carefully assess requirement gaps; this candidate control may only provide peripheral alignment.';

    return {
      matchScore: totalScore,
      matchProvider: this.name,
      matchRationale: {
        positiveCoverage,
        potentialGap,
        suggestedReviewerAction,
        scoreBreakdown: {
          componentOverlap,
          processAlignment,
          frequencyOwnerAlignment,
          metadataAlignment,
        },
      },
      coverageAssessments: assessments,
    };
  }
}

export const defaultAIProvider = new DeterministicRuleBasedProvider();
