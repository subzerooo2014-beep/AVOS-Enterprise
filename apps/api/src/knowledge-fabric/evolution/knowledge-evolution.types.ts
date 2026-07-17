export type KnowledgeEvolutionStage = "OBSERVED" | "PROPOSED" | "VALIDATING" | "APPROVED" | "APPLIED" | "ROLLED_BACK" | "RETIRED";
export type KnowledgeChangeType = "CREATE" | "ENRICH" | "CORRECT" | "MERGE" | "SPLIT" | "MIGRATE" | "DEPRECATE" | "RETIRE";

export interface KnowledgeEvolutionCandidate {
  id: string;
  knowledgeId: string;
  namespace: string;
  changeType: KnowledgeChangeType;
  reason: string;
  sourceVersion: number;
  targetVersion: number;
  proposedBy: string;
  confidence: number;
  impactScore: number;
  payload?: Record<string, unknown>;
  createdAt: string;
}

export interface KnowledgeEvolutionAssessment {
  candidateId: string;
  compatible: boolean;
  qualityDelta: number;
  trustDelta: number;
  riskScore: number;
  affectedKnowledgeIds: string[];
  findings: string[];
  assessedAt: string;
}

export interface KnowledgeEvolutionPlan {
  id: string;
  candidateId: string;
  stage: KnowledgeEvolutionStage;
  steps: string[];
  rollbackSteps: string[];
  requiresApproval: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeVersionRecord {
  knowledgeId: string;
  version: number;
  previousVersion?: number;
  checksum: string;
  changeType: KnowledgeChangeType;
  changedBy: string;
  changedAt: string;
  metadata?: Record<string, unknown>;
}

export interface KnowledgeEvolutionResult {
  candidate: KnowledgeEvolutionCandidate;
  assessment: KnowledgeEvolutionAssessment;
  plan: KnowledgeEvolutionPlan;
  applied: boolean;
  version?: KnowledgeVersionRecord;
}