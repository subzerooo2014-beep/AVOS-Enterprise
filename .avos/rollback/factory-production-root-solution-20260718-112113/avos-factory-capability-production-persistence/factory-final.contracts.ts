export type FactoryFinalPhase =
  | "genesis-factory"
  | "enterprise-factory"
  | "autonomous-factory"
  | "factory-os";

export interface FactoryFinalRequest {
  name: string;
  version?: string;
  approvedBy: string;
  targetEnvironment?: "development" | "staging" | "production";
  enterpriseDomain?: string;
  capabilities?: string[];
  channels?: string[];
  objectives?: string[];
  metadata?: Record<string, unknown>;
}

export interface FactoryPhaseResult {
  phase: FactoryFinalPhase;
  success: boolean;
  score: number;
  assets: string[];
  checks: Record<string, boolean>;
}

export interface FactoryFinalResult {
  success: boolean;
  executionId: string;
  name: string;
  version: string;
  phases: FactoryPhaseResult[];
  score: number;
  releaseReady: boolean;
  humanFinalAuthority: true;
  completedAt: string;
}
