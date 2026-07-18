import {
  AvosBlueprint,
  BlueprintStepType
} from "./blueprint.contracts";
import {
  GenerationExecutionResult
} from "./code-generation.contracts";

export type AiGenerationIntent =
  | "create-service"
  | "create-controller"
  | "create-module"
  | "create-typescript"
  | "create-feature"
  | "unknown";

export type AiGeneratorRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AiGenerationStatus =
  | "analyzed"
  | "planned"
  | "awaiting-approval"
  | "approved"
  | "executing"
  | "completed"
  | "failed"
  | "rejected";

export interface AiGenerationRequest {
  id?: string;
  prompt: string;
  projectContext?: string;
  requestedBy: string;
  approvedBy?: string;
  humanApproved?: boolean;
  dryRun?: boolean;
  overwrite?: boolean;
  outputPath?: string;
  preferredProviderId?: string;
  preferredTarget?: string;
  variables?: Record<string, unknown>;
  correlationId?: string;
}

export interface AiPromptAnalysis {
  intent: AiGenerationIntent;
  confidence: number;
  requestedName: string;
  target: string;
  providerId: string;
  requestedArtifacts: string[];
  keywords: string[];
  requiresHumanApproval: boolean;
  riskLevel: AiGeneratorRiskLevel;
  reasons: string[];
}

export interface AiGenerationPlanStep {
  id: string;
  name: string;
  type: BlueprintStepType;
  target: string;
  providerId: string;
  outputPath?: string;
  input: Record<string, unknown>;
  dependsOn: string[];
  requiresApproval: boolean;
}

export interface AiGenerationPlan {
  id: string;
  requestId: string;
  status: AiGenerationStatus;
  createdAt: string;
  requestedBy: string;
  analysis: AiPromptAnalysis;
  blueprint: AvosBlueprint;
  steps: AiGenerationPlanStep[];
  requiresHumanApproval: boolean;
  approved: boolean;
  approvedBy?: string;
  warnings: string[];
}

export interface AiGenerationPolicyDecision {
  allowed: boolean;
  requiresHumanApproval: boolean;
  riskLevel: AiGeneratorRiskLevel;
  reasons: string[];
  blockedPatterns: string[];
}

export interface AiGenerationExecutionResult {
  success: boolean;
  requestId: string;
  planId: string;
  status: AiGenerationStatus;
  analysis: AiPromptAnalysis;
  blueprint: AvosBlueprint;
  executions: GenerationExecutionResult[];
  warnings: string[];
  startedAt: string;
  completedAt: string;
  durationMs: number;
  error?: string;
}

export interface AiGeneratorHistoryRecord {
  id: string;
  requestId: string;
  planId?: string;
  action:
    | "analyzed"
    | "planned"
    | "approved"
    | "rejected"
    | "executed"
    | "failed";
  status: AiGenerationStatus;
  success: boolean;
  timestamp: string;
  requestedBy: string;
  approvedBy?: string;
  details?: Record<string, unknown>;
}

export interface AiGeneratorMetricsSnapshot {
  totalRequests: number;
  analyzedRequests: number;
  plannedRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  successfulExecutions: number;
  failedExecutions: number;
  generatedArtifacts: number;
  approvalRequiredRequests: number;
  averageConfidence: number;
  averageDurationMs: number;
  historyRecords: number;
  calculatedAt: string;
}
