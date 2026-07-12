import { UltraHValue } from "./contracts";

export interface StrategicAgentVote {
  agentKey: string;
  expertise: string[];
  recommendation: "approve" | "approve_with_controls" | "review" | "reject";
  confidence: number;
  rationale: string;
  controls: string[];
  metadata: Record<string, UltraHValue>;
}

export interface StrategicCouncilDecision {
  decision: StrategicAgentVote["recommendation"];
  consensusScore: number;
  controls: string[];
  dissentingAgents: string[];
  decidedAt: string;
}

export class StrategicAgentCouncil {
  decide(votes: readonly StrategicAgentVote[]): StrategicCouncilDecision {
    if (votes.length === 0) {
      return {
        decision: "review",
        consensusScore: 0,
        controls: ["human-review"],
        dissentingAgents: [],
        decidedAt: new Date().toISOString(),
      };
    }

    const weights = {
      approve: 4,
      approve_with_controls: 3,
      review: 2,
      reject: 1,
    } as const;

    const weighted = votes.map((vote) => ({
      ...vote,
      weightedScore: weights[vote.recommendation] * vote.confidence,
    }));

    const totals = new Map<string, number>();
    for (const vote of weighted) {
      totals.set(
        vote.recommendation,
        (totals.get(vote.recommendation) ?? 0) + vote.weightedScore,
      );
    }

    const ranked = Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);
    const decision = (ranked[0]?.[0] ?? "review") as StrategicAgentVote["recommendation"];
    const totalScore = ranked.reduce((sum, entry) => sum + entry[1], 0);
    const consensusScore =
      totalScore === 0
        ? 0
        : Math.round(((ranked[0]?.[1] ?? 0) / totalScore) * 100);

    const controls = Array.from(
      new Set(votes.flatMap((vote) => vote.controls)),
    );

    return {
      decision,
      consensusScore,
      controls,
      dissentingAgents: votes
        .filter((vote) => vote.recommendation !== decision)
        .map((vote) => vote.agentKey),
      decidedAt: new Date().toISOString(),
    };
  }
}
