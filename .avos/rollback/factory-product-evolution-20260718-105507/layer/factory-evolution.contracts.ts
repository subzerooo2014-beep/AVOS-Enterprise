export type FactoryEvolutionStage =
  | "blueprint-compilation"
  | "pipeline-planning"
  | "policy-evaluation"
  | "architecture-validation"
  | "dependency-planning"
  | "quality-gates"
  | "test-strategy"
  | "documentation"
  | "release-manifest"
  | "deployment-readiness"
  | "rollback-strategy"
  | "human-approval"
  | "completed";

export interface FactoryEvolutionRequest {
  capabilityName: string;
  version?: string;
  description?: string;
  blueprint?: Record<string, unknown>;
  dependencies?: string[];
  targetEnvironment?: "development" | "staging" | "production";
  approvedBy: string;
  metadata?: Record<string, unknown>;
}

export interface FactoryEvolutionStageResult {
  stage: FactoryEvolutionStage;
  status: "completed" | "blocked";
  score: number;
  details: Record<string, unknown>;
}

export interface FactoryEvolutionResult {
  success: boolean;
  id: string;
  capabilityName: string;
  version: string;
  targetEnvironment: string;
  stages: FactoryEvolutionStageResult[];
  overallScore: number;
  humanFinalAuthority: true;
  completedAt: string;
}
