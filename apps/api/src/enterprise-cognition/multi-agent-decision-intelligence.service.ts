import { Injectable } from '@nestjs/common';
import { AgentDecision } from './enterprise-cognition.types';

@Injectable()
export class MultiAgentDecisionIntelligenceService {
  aggregate(decisions: AgentDecision[]) {
    const recommendationGroups = new Map<string, AgentDecision[]>();

    for (const decision of decisions) {
      const existing = recommendationGroups.get(decision.recommendation) ?? [];
      existing.push(decision);
      recommendationGroups.set(decision.recommendation, existing);
    }

    const consensus = [...recommendationGroups.entries()]
      .map(([recommendation, votes]) => ({
        recommendation,
        agents: votes.map((vote) => vote.agent),
        confidence:
          votes.reduce((sum, vote) => sum + vote.confidence, 0) /
          Math.max(1, votes.length),
        voteCount: votes.length,
      }))
      .sort(
        (left, right) =>
          right.voteCount - left.voteCount ||
          right.confidence - left.confidence,
      );

    return {
      consensus: consensus[0] ?? null,
      alternatives: consensus.slice(1),
      participatingAgents: decisions.length,
    };
  }
}