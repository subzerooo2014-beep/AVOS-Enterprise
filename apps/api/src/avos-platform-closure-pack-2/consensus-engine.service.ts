import { Injectable } from '@nestjs/common';
import {
  ConsensusInput,
  ConsensusResult,
} from './digital-organization.types';
import { TeamRuntimeService } from './team-runtime.service';

@Injectable()
export class ConsensusEngineService {
  private readonly results: ConsensusResult[] = [];

  constructor(private readonly teams: TeamRuntimeService) {}

  evaluate(input: ConsensusInput): ConsensusResult {
    const team = this.teams.require(input.teamId);

    if (team.status !== 'active') {
      throw new Error('Consensus requires an active team.');
    }

    const allowedAgentIds = new Set(team.agentIds);

    for (const vote of input.votes) {
      if (!allowedAgentIds.has(vote.agentId)) {
        throw new Error(`Agent ${vote.agentId} is not a member of the team.`);
      }

      if (!input.options.includes(vote.option)) {
        throw new Error(`Vote option ${vote.option} is invalid.`);
      }
    }

    const weighted = new Map<string, number>();

    for (const vote of input.votes) {
      weighted.set(
        vote.option,
        (weighted.get(vote.option) ?? 0) + vote.confidence,
      );
    }

    const ranked = [...weighted.entries()].sort((a, b) => b[1] - a[1]);
    const top = ranked[0];
    const second = ranked[1];

    const conflict =
      !top ||
      (second && Math.abs(top[1] - second[1]) < 10);

    const totalConfidence = input.votes.length
      ? Math.round(
          input.votes.reduce((sum, vote) => sum + vote.confidence, 0) /
            input.votes.length,
        )
      : 0;

    const result: ConsensusResult = {
      id: `consensus-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      teamId: input.teamId,
      subject: input.subject,
      selectedOption: conflict ? undefined : top[0],
      status: conflict ? 'human-escalation' : 'consensus',
      confidence: totalConfidence,
      rationale: conflict
        ? 'Weighted votes are too close; Human Final Authority is required.'
        : `Weighted consensus selected ${top[0]}.`,
      createdAt: new Date().toISOString(),
    };

    this.results.push(result);
    return JSON.parse(JSON.stringify(result)) as ConsensusResult;
  }

  list(): ConsensusResult[] {
    return this.results.map((result) =>
      JSON.parse(JSON.stringify(result)),
    );
  }
}