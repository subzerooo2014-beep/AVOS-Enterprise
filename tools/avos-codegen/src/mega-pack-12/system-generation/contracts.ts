export type SystemGenerationJsonPrimitive =
  | string
  | number
  | boolean
  | null;

export type SystemGenerationJsonValue =
  | SystemGenerationJsonPrimitive
  | SystemGenerationJsonValue[]
  | {
      [key: string]: SystemGenerationJsonValue;
    };

export enum SystemGenerationStatus {
  CREATED = "created",
  PLANNING = "planning",
  VALIDATING = "validating",
  GENERATING = "generating",
  VERIFYING = "verifying",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum SystemComponentType {
  MODULE = "module",
  SERVICE = "service",
  CONTROLLER = "controller",
  DTO = "dto",
  MODEL = "model",
  REPOSITORY = "repository",
  POLICY = "policy",
  WORKFLOW = "workflow",
  TEST = "test",
  DOCUMENTATION = "documentation",
}

export interface SystemGenerationBlueprintReference {
  key: string;
  version: string;
  required: boolean;
  configuration: Record<
    string,
    SystemGenerationJsonValue
  >;
}

export interface SystemGenerationComponentRequest {
  key: string;
  name: string;
  type: SystemComponentType;
  description: string;
  dependencies: string[];
  tags: string[];
  configuration: Record<
    string,
    SystemGenerationJsonValue
  >;
}

export interface SystemGenerationRequest {
  id: string;
  key: string;
  name: string;
  description: string;
  workspaceRoot: string;
  targetRoot: string;
  blueprints:
    SystemGenerationBlueprintReference[];
  components:
    SystemGenerationComponentRequest[];
  variables: Record<
    string,
    SystemGenerationJsonValue
  >;
  metadata: Record<
    string,
    SystemGenerationJsonValue
  >;
  dryRun: boolean;
  createdAt: string;
}

export interface SystemGenerationDependencyNode {
  key: string;
  dependencies: string[];
  dependents: string[];
  depth: number;
}

export interface SystemGenerationDependencyGraph {
  nodes:
    SystemGenerationDependencyNode[];
  roots: string[];
  leaves: string[];
  hasCycles: boolean;
  cycles: string[][];
}

export interface SystemGenerationValidationIssue {
  code: string;
  message: string;
  componentKey?: string;
  blocking: boolean;
}

export interface SystemGenerationValidationResult {
  valid: boolean;
  issues:
    SystemGenerationValidationIssue[];
  validatedAt: string;
}

export interface SystemGenerationPlanStep {
  id: string;
  key: string;
  name: string;
  order: number;
  componentKey?: string;
  dependencies: string[];
  metadata: Record<
    string,
    SystemGenerationJsonValue
  >;
}

export interface SystemGenerationPlan {
  requestId: string;
  steps:
    SystemGenerationPlanStep[];
  graph:
    SystemGenerationDependencyGraph;
  generatedAt: string;
}

export interface SystemGenerationArtifact {
  id: string;
  key: string;
  componentKey: string;
  relativePath: string;
  content: string;
  checksum: string;
  tags: string[];
  metadata: Record<
    string,
    SystemGenerationJsonValue
  >;
}

export interface SystemGenerationVerificationResult {
  success: boolean;
  artifactCount: number;
  duplicatePaths: string[];
  emptyArtifacts: string[];
  missingComponents: string[];
  verifiedAt: string;
}

export interface SystemGenerationResult {
  success: boolean;
  status: SystemGenerationStatus;
  request: SystemGenerationRequest;
  validation:
    SystemGenerationValidationResult;
  plan?: SystemGenerationPlan;
  artifacts:
    SystemGenerationArtifact[];
  verification?:
    SystemGenerationVerificationResult;
  warnings: string[];
  errors: string[];
  startedAt: string;
  completedAt: string;
  durationMs: number;
}
