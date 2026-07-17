import { KnowledgeEvolutionAssessment, KnowledgeEvolutionCandidate, KnowledgeEvolutionPlan, KnowledgeEvolutionResult, KnowledgeVersionRecord } from "./knowledge-evolution.types";

export interface KnowledgeEvolutionEngineContract {
  propose(input: Omit<KnowledgeEvolutionCandidate, "id" | "createdAt">): KnowledgeEvolutionCandidate;
  assess(candidateId: string): KnowledgeEvolutionAssessment;
  plan(candidateId: string): KnowledgeEvolutionPlan;
  apply(candidateId: string, actorId: string): KnowledgeEvolutionResult;
  rollback(candidateId: string, actorId: string): KnowledgeEvolutionResult;
}

export interface KnowledgeVersioningContract {
  record(input: Omit<KnowledgeVersionRecord, "changedAt">): KnowledgeVersionRecord;
  latest(knowledgeId: string): KnowledgeVersionRecord | undefined;
  history(knowledgeId: string): KnowledgeVersionRecord[];
}