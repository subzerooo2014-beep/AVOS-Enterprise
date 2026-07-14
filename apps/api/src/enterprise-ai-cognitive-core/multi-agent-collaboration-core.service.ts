import { Injectable } from '@nestjs/common';
import { AgentContribution } from './enterprise-ai-cognitive-core.types';

@Injectable()
export class MultiAgentCollaborationCoreService {
  aggregate(contributions: AgentContribution[]) {
    const grouped = new Map<string, AgentContribution[]>();

    for (const contribution of contributions) {
      const existing =
        grouped.get(contribution.recommendation) ?? [];
      existing.push(contribution);
      grouped.set(contribution.recommendation, existing);
    }

    const consensus = [...grouped.entries()]
      .map(([recommendation, votes]) => ({
        recommendation,
        agents: votes.map((vote) => vote.agentId),
        roles: [...new Set(votes.map((vote) => vote.role))],
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
      participatingAgents: contributions.length,
    };
  }
}