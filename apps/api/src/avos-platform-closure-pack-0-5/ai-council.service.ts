import { Injectable } from '@nestjs/common';
import {
  AICouncilMemberOpinion,
  AICouncilReview,
  GovernanceDecision,
} from './cognitive-governance.types';

@Injectable()
export class AICouncilService {
  review(decision: GovernanceDecision): AICouncilReview {
    const opinions: AICouncilMemberOpinion[] = [
      this.architectureOpinion(decision),
      this.riskOpinion(decision),
      this.visionOpinion(decision),
      this.complianceOpinion(decision),
      this.operationsOpinion(decision),
    ];

    const approveCount = opinions.filter(
      (opinion) => opinion.recommendation === 'approve',
    ).length;
    const rejectCount = opinions.filter(
      (opinion) => opinion.recommendation === 'reject',
    ).length;

    const consensus =
      rejectCount > 0
        ? 'reject'
        : approveCount === opinions.length
          ? 'approve'
          : 'revise';

    const confidence =
      Math.round(
        opinions.reduce((sum, opinion) => sum + opinion.confidence, 0) /
          opinions.length,
      );

    return {
      reviewId: `ai-council-review-${Date.now()}`,
      decisionId: decision.id,
      consensus,
      confidence,
      opinions,
      reviewedAt: new Date().toISOString(),
    };
  }

  private architectureOpinion(decision: GovernanceDecision): AICouncilMemberOpinion {
    const revise = decision.type === 'multi-agent';

    return {
      role: 'Chief Architecture Agent',
      recommendation: revise ? 'revise' : 'approve',
      confidence: revise ? 88 : 94,
      rationale: revise
        ? 'Organization OS readiness must be verified before multi-agent activation.'
        : 'No immediate architecture boundary violation was detected.',
    };
  }

  private riskOpinion(decision: GovernanceDecision): AICouncilMemberOpinion {
    const critical = decision.riskLevel === 'critical';

    return {
      role: 'Chief Risk Agent',
      recommendation: critical ? 'revise' : 'approve',
      confidence: critical ? 96 : 91,
      rationale: critical
        ? 'Critical-risk decisions require additional evidence and explicit human approval.'
        : 'Declared risk remains within reviewable limits.',
    };
  }

  private visionOpinion(decision: GovernanceDecision): AICouncilMemberOpinion {
    const linked = Boolean(decision.livingVisionId);

    return {
      role: 'Living Vision Guardian',
      recommendation: linked ? 'approve' : 'revise',
      confidence: linked ? 95 : 93,
      rationale: linked
        ? 'Decision declares a Living Vision reference.'
        : 'Project-linked decisions must declare a Living Vision reference.',
    };
  }

  private complianceOpinion(decision: GovernanceDecision): AICouncilMemberOpinion {
    return {
      role: 'Global Compliance Agent',
      recommendation: 'approve',
      confidence: 90,
      rationale:
        'No jurisdiction-specific execution is performed by this governance review itself.',
    };
  }

  private operationsOpinion(decision: GovernanceDecision): AICouncilMemberOpinion {
    return {
      role: 'Operations Reliability Agent',
      recommendation:
        decision.technicalSensitivity && decision.riskLevel === 'high'
          ? 'revise'
          : 'approve',
      confidence: 89,
      rationale:
        decision.technicalSensitivity && decision.riskLevel === 'high'
          ? 'Sensitive high-risk technical changes require rollout and rollback evidence.'
          : 'Operational review found no blocking execution request.',
    };
  }
}