export type AutonomousTargetFramework =
  | "nestjs"
  | "nextjs"
  | "flutter"
  | "node"
  | "generic";

export type AutonomousRunStatus =
  | "compiling"
  | "resolving"
  | "generating"
  | "quality-checking"
  | "certifying"
  | "completed"
  | "rejected"
  | "failed";

export interface AutonomousCapabilityInput {
  name: string;
  objective: string;
  version?: string;
  dependencies?: string[];
  exposeApi?: boolean;
  persistence?: boolean;
  humanApprovalRequired?: boolean;
  metadata?: Record<string, unknown>;
}

export interface AutonomousApplicationInput {
  name: string;
  framework: AutonomousTargetFramework;
  objective: string;
  capabilities: string[];
  metadata?: Record<string, unknown>;
}

export interface AutonomousFactoryBlueprintInput {
  projectId: string;
  name: string;
  objective: string;
  version?: string;
  capabilities: AutonomousCapabilityInput[];
  applications?: AutonomousApplicationInput[];
  qualityThreshold?: number;
  humanFinalAuthority?: boolean;
  metadata?: Record<string, unknown>;
}

export interface CompiledCapability {
  id: string;
  name: string;
  slug: string;
  className: string;
  objective: string;
  version: string;
  dependencies: string[];
  exposeApi: boolean;
  persistence: boolean;
  humanApprovalRequired: boolean;
  metadata: Record<string, unknown>;
}

export interface CompiledApplication {
  id: string;
  name: string;
  slug: string;
  framework: AutonomousTargetFramework;
  objective: string;
  capabilityIds: string[];
  metadata: Record<string, unknown>;
}

export interface CompiledFactoryBlueprint {
  id: string;
  projectId: string;
  name: string;
  slug: string;
  objective: string;
  version: string;
  capabilities: CompiledCapability[];
  applications: CompiledApplication[];
  qualityThreshold: number;
  humanFinalAuthority: true;
  metadata: Record<string, unknown>;
  compiledAt: string;
}

export interface DependencyResolution {
  id: string;
  blueprintId: string;
  valid: boolean;
  graph: Record<string, string[]>;
  topologicalOrder: string[];
  missingDependencies: string[];
  cyclicDependencies: string[][];
  resolvedAt: string;
}

export interface QualityFinding {
  code: string;
  severity: "info" | "warning" | "error";
  message: string;
  file?: string;
}

export interface QualityReport {
  id: string;
  packageId: string;
  passed: boolean;
  score: number;
  checks: Record<string, boolean>;
  findings: QualityFinding[];
  checkedAt: string;
}

export interface ProductionCertification {
  id: string;
  runId: string;
  blueprintId: string;
  packageIds: string[];
  status: "certified" | "rejected";
  score: number;
  qualityThreshold: number;
  humanFinalAuthority: true;
  requiresHumanApproval: boolean;
  reasons: string[];
  certifiedAt: string;
  metadata: Record<string, unknown>;
}

export interface AutonomousFactoryRun {
  id: string;
  projectId: string;
  status: AutonomousRunStatus;
  blueprint?: CompiledFactoryBlueprint;
  dependencyResolution?: DependencyResolution;
  packageIds: string[];
  qualityReports: QualityReport[];
  certification?: ProductionCertification;
  errors: string[];
  metadata: Record<string, unknown>;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
}
