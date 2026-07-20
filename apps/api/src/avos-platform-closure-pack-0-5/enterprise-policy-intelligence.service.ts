import { Injectable } from '@nestjs/common';
import {
  GovernanceDecisionInput,
  GovernancePolicyCheck,
} from './cognitive-governance.types';
import { LivingVisionGovernanceService } from './living-vision-governance.service';
import { OrganizationReadinessService } from './organization-readiness.service';
import { ThinkingConstitutionService } from './thinking-constitution.service';

@Injectable()
export class EnterprisePolicyIntelligenceService {
  constructor(
    private readonly constitution: ThinkingConstitutionService,
    private readonly livingVision: LivingVisionGovernanceService,
    private readonly organizationReadiness: OrganizationReadinessService,
  ) {}

  evaluate(input: GovernanceDecisionInput): GovernancePolicyCheck[] {
    const constitutionValidation = this.constitution.validate();
    const organizationStatus = this.organizationReadiness.status();
    const livingVisionRequired = Boolean(input.projectId);
    const livingVisionPassed =
      !livingVisionRequired ||
      this.livingVision.isLinked(input.projectId, input.livingVisionId);

    const checks: GovernancePolicyCheck[] = [
      {
        policyId: 'policy-thinking-constitution',
        name: 'Thinking Constitution Valid',
        passed: constitutionValidation.valid,
        blocking: true,
        reason: constitutionValidation.valid
          ? 'All mandatory Thinking Constitution rules are active.'
          : `Inactive mandatory rules: ${constitutionValidation.failures.join(', ')}`,
      },
      {
        policyId: 'policy-living-vision',
        name: 'Living Vision Link',
        passed: livingVisionPassed,
        blocking: true,
        reason: livingVisionPassed
          ? 'Project is linked to the declared Living Vision.'
          : 'Project decisions require an active Living Vision link.',
      },
      {
        policyId: 'policy-learning-governance',
        name: 'Governance Before Learning',
        passed: input.type !== 'learning',
        blocking: input.type === 'learning',
        reason:
          input.type === 'learning'
            ? 'Learning execution remains blocked until Pack 1 is activated after Pack 0.5 certification.'
            : 'Decision does not activate autonomous learning.',
      },
      {
        policyId: 'policy-multi-agent-readiness',
        name: 'Organization OS and AI Council Readiness',
        passed:
          input.type !== 'multi-agent' ||
          organizationStatus.multiAgentAllowed,
        blocking: input.type === 'multi-agent',
        reason:
          input.type !== 'multi-agent'
            ? 'Decision does not activate multi-agent execution.'
            : organizationStatus.multiAgentAllowed
              ? 'Organization OS and AI Council are ready.'
              : 'Multi-agent execution requires Organization OS and AI Council readiness.',
      },
    ];

    return checks;
  }
}