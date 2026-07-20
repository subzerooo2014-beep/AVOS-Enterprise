import { Injectable, NotFoundException } from '@nestjs/common';
import { AICouncilService } from './ai-council.service';
import {
  CognitiveGovernanceStatus,
  GovernanceDecision,
  GovernanceDecisionInput,
} from './cognitive-governance.types';
import { EnterprisePolicyIntelligenceService } from './enterprise-policy-intelligence.service';
import { HumanApprovalGateService } from './human-approval-gate.service';
import { LivingVisionGovernanceService } from './living-vision-governance.service';
import { ThinkingConstitutionService } from './thinking-constitution.service';

@Injectable()
export class CognitiveGovernanceService {
  private readonly decisions = new Map<string, GovernanceDecision>();

  constructor(
    private readonly policyIntelligence: EnterprisePolicyIntelligenceService,
    private readonly aiCouncil: AICouncilService,
    private readonly humanApprovalGate: HumanApprovalGateService,
    private readonly thinkingConstitution: ThinkingConstitutionService,
    private readonly livingVision: LivingVisionGovernanceService,
  ) {}

  status(): CognitiveGovernanceStatus {
    const decisions = [...this.decisions.values()];

    return {
      name: 'AVOS Enterprise Cognitive Governance Layer',
      version: 'PC-P0.5-1.0.0',
      status: 'operational',
      layer: 'Enterprise Cognitive Governance Layer',
      metrics: {
        decisions: decisions.length,
        pendingHumanApproval: decisions.filter(
          (decision) =>
            decision.requiresHumanApproval &&
            decision.status === 'under-review',
        ).length,
        approved: decisions.filter((decision) => decision.status === 'approved').length,
        rejected: decisions.filter((decision) => decision.status === 'rejected').length,
        blocked: decisions.filter((decision) => decision.status === 'blocked').length,
        livingVisionLinks: this.livingVision.list().length,
        activeConstitutionRules: this.thinkingConstitution.activeRules().length,
      },
      controls: {
        noLearningBeforeGovernance: true,
        noMultiAgentBeforeOrganizationOSAndAICouncil: true,
        humanFinalAuthority: true,
        humanApprovalGate: true,
        aiCouncilRequired: true,
        thinkingConstitutionRequired: true,
        livingVisionRequired: true,
        projectRetrospectiveRequired: true,
      },
    };
  }

  submit(input: GovernanceDecisionInput): GovernanceDecision {
    const riskLevel = input.riskLevel ?? 'medium';
    const strategicImpact = input.strategicImpact ?? input.type === 'strategic';
    const technicalSensitivity =
      input.technicalSensitivity ?? input.type === 'technical-sensitive';

    const policyChecks = this.policyIntelligence.evaluate({
      ...input,
      riskLevel,
      strategicImpact,
      technicalSensitivity,
    });

    const blocked = policyChecks.some(
      (check) => check.blocking && !check.passed,
    );

    const requiresHumanApproval =
      strategicImpact ||
      technicalSensitivity ||
      riskLevel === 'high' ||
      riskLevel === 'critical' ||
      input.type === 'architecture' ||
      input.type === 'learning' ||
      input.type === 'multi-agent';

    const decision: GovernanceDecision = {
      id: `governance-decision-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      title: input.title,
      description: input.description,
      type: input.type,
      projectId: input.projectId,
      livingVisionId: input.livingVisionId,
      requestedBy: input.requestedBy,
      riskLevel,
      strategicImpact,
      technicalSensitivity,
      status: blocked ? 'blocked' : 'under-review',
      requiresHumanApproval,
      aiCouncilReviewRequired: true,
      policyChecks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    decision.councilReview = this.aiCouncil.review(decision);

    if (decision.councilReview.consensus === 'reject') {
      decision.status = 'blocked';
    }

    this.decisions.set(decision.id, decision);

    return this.clone(decision);
  }

  humanDecision(
    decisionId: string,
    input: {
      approvedBy: string;
      action: 'approved' | 'rejected';
      reason?: string;
    },
  ): GovernanceDecision {
    const decision = this.decisions.get(decisionId);

    if (!decision) {
      throw new NotFoundException(`Decision ${decisionId} was not found.`);
    }

    if (decision.status === 'blocked' && input.action === 'approved') {
      throw new Error(
        'Blocked decisions must be revised and resubmitted before human approval.',
      );
    }

    decision.approval = this.humanApprovalGate.approve(decision, input);
    decision.status = input.action === 'approved' ? 'approved' : 'rejected';
    decision.updatedAt = new Date().toISOString();

    return this.clone(decision);
  }

  get(decisionId: string): GovernanceDecision {
    const decision = this.decisions.get(decisionId);

    if (!decision) {
      throw new NotFoundException(`Decision ${decisionId} was not found.`);
    }

    return this.clone(decision);
  }

  list(): GovernanceDecision[] {
    return [...this.decisions.values()].map((decision) => this.clone(decision));
  }

  private clone(decision: GovernanceDecision): GovernanceDecision {
    return JSON.parse(JSON.stringify(decision)) as GovernanceDecision;
  }
}