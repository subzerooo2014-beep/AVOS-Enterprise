export type EvolutionStatus = "PROPOSED" | "APPROVED" | "EXECUTING" | "COMPLETED" | "REJECTED";

export interface EvolutionProposal {
  id: string;
  title: string;
  objective: string;
  rationale: string;
  expectedImpact: number;
  riskScore: number;
  status: EvolutionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ReleaseReadinessResult {
  score: number;
  decision: "BLOCK" | "REVIEW" | "APPROVE";
  reasons: string[];
}
