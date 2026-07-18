export type GenesisApprovalState =
  | "draft"
  | "awaiting-human-approval"
  | "approved"
  | "rejected";

export type GenesisSessionStage =
  | "created"
  | "blueprint-loaded"
  | "validated"
  | "planned"
  | "awaiting-human-approval"
  | "approved"
  | "executing"
  | "completed"
  | "failed"
  | "rolled-back";

export interface GenesisBlueprint {
  id: string;
  name: string;
  version: string;
  purpose: string;
  requestedCapabilities: string[];
  artifacts: GenesisArtifactDefinition[];
  policies: string[];
  metadata: Record<string, unknown>;
}

export interface GenesisArtifactDefinition {
  id: string;
  type: "module" | "service" | "controller" | "dto" | "test" | "document";
  path: string;
  purpose: string;
  dependencies: string[];
}

export interface GenesisValidationIssue {
  code: string;
  severity: "info" | "warning" | "error";
  message: string;
  artifactId?: string;
}

export interface GenesisValidationResult {
  valid: boolean;
  score: number;
  issues: GenesisValidationIssue[];
  checkedAt: string;
}

export interface GenesisPlanStep {
  id: string;
  sequence: number;
  name: string;
  action: string;
  artifactIds: string[];
  dependsOn: string[];
  reversible: boolean;
}

export interface GenesisGenerationPlan {
  id: string;
  blueprintId: string;
  createdAt: string;
  steps: GenesisPlanStep[];
  requiredCapabilities: string[];
  approvalState: GenesisApprovalState;
  riskScore: number;
  explanation: string[];
}

export interface GenesisArtifactRecord {
  id: string;
  blueprintId: string;
  path: string;
  type: string;
  version: string;
  status: "planned" | "generated" | "validated" | "published" | "rolled-back";
  checksum: string;
  dependencies: string[];
  createdAt: string;
}

export interface GenesisExecutionEvent {
  id: string;
  sessionId: string;
  type: string;
  message: string;
  timestamp: string;
  metadata: Record<string, unknown>;
}

export interface GenesisSession {
  id: string;
  blueprintId: string;
  stage: GenesisSessionStage;
  approvalState: GenesisApprovalState;
  createdAt: string;
  updatedAt: string;
  planId?: string;
  artifactIds: string[];
  events: GenesisExecutionEvent[];
  error?: string;
}

export interface GenesisHumanDecision {
  sessionId: string;
  decision: "approve" | "reject";
  decidedBy: string;
  reason: string;
}

export interface GenesisPlatformStatus {
  status: "healthy" | "degraded";
  version: string;
  classification: string;
  runtimeReady: boolean;
  humanFinalAuthority: boolean;
  autonomousExecutionEnabled: boolean;
  components: Record<string, boolean>;
  metrics: Record<string, number>;
}
