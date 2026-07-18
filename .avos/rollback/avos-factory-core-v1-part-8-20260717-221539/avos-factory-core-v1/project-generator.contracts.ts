export type ProjectGeneratorStatus =
  | "draft" | "validated" | "planned" | "awaiting-approval"
  | "approved" | "generating" | "completed" | "failed"
  | "rolled-back" | "archived";

export type ProjectKind =
  | "nestjs-api" | "nestjs-module" | "typescript-library"
  | "worker" | "service" | "custom";

export type ProjectArtifactKind =
  | "directory" | "source" | "configuration"
  | "documentation" | "test" | "manifest";

export interface ProjectGeneratorRequest {
  id?: string;
  name: string;
  kind: ProjectKind;
  description?: string;
  namespace?: string;
  outputPath?: string;
  requestedBy: string;
  approvedBy?: string;
  humanApproved?: boolean;
  dryRun?: boolean;
  overwrite?: boolean;
  variables?: Record<string, unknown>;
  features?: string[];
  tags?: string[];
  correlationId?: string;
}

export interface ProjectStructureNode {
  id: string;
  kind: ProjectArtifactKind;
  relativePath: string;
  templateId?: string;
  target?: string;
  providerId?: string;
  content?: string;
  variables?: Record<string, unknown>;
  dependsOn?: string[];
  requiresApproval?: boolean;
}

export interface ProjectGenerationPlan {
  id: string;
  requestId: string;
  name: string;
  projectId: string;
  kind: ProjectKind;
  status: ProjectGeneratorStatus;
  outputPath: string;
  requestedBy: string;
  approvedBy?: string;
  humanApproved: boolean;
  requiresHumanApproval: boolean;
  createdAt: string;
  structure: ProjectStructureNode[];
  variables: Record<string, unknown>;
  warnings: string[];
}

export interface ProjectValidationIssue {
  code: string;
  message: string;
  path?: string;
  severity: "error" | "warning";
}

export interface ProjectValidationResult {
  valid: boolean;
  errors: ProjectValidationIssue[];
  warnings: ProjectValidationIssue[];
}

export interface ProjectGeneratorPolicyDecision {
  allowed: boolean;
  requiresHumanApproval: boolean;
  reasons: string[];
  blockedFeatures: string[];
}

export interface ProjectGeneratorHistoryRecord {
  id: string;
  requestId: string;
  planId?: string;
  projectId?: string;
  action: "validated" | "planned" | "approved" | "rejected" |
    "generated" | "failed" | "rolled-back" | "archived";
  status: ProjectGeneratorStatus;
  success: boolean;
  requestedBy: string;
  approvedBy?: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export interface ProjectGeneratorMetricsSnapshot {
  totalRequests: number;
  validRequests: number;
  invalidRequests: number;
  plannedProjects: number;
  approvalRequiredProjects: number;
  approvedProjects: number;
  rejectedProjects: number;
  historyRecords: number;
  registeredProjectKinds: number;
  calculatedAt: string;
}

export interface ProjectKindDefinition {
  kind: ProjectKind;
  name: string;
  description: string;
  defaultFeatures: string[];
  supportedFeatures: string[];
  requiresHumanApproval: boolean;
  structureFactory: (
    request: ProjectGeneratorRequest,
    variables: Record<string, unknown>
  ) => ProjectStructureNode[];
}
