export type ProductionJobStatus =
  | "planned"
  | "awaiting-approval"
  | "running"
  | "validating"
  | "completed"
  | "failed"
  | "rolled-back";

export type ProductionStage =
  | "plan"
  | "resolve-dependencies"
  | "materialize"
  | "assemble"
  | "validate"
  | "quality-gates"
  | "register-artifacts"
  | "report";

export interface ProductionArtifact {
  id: string;
  path: string;
  kind: "source" | "config" | "test" | "documentation" | "manifest" | "other";
  checksum: string;
  size: number;
  createdAt: string;
}

export interface ProductionQualityGate {
  id: string;
  name: string;
  required: boolean;
  passed: boolean;
  details?: string;
}

export interface ProductionTransaction {
  id: string;
  jobId: string;
  startedAt: string;
  completedAt?: string;
  status: "open" | "committed" | "rolled-back";
  touchedFiles: string[];
  rollbackSnapshot?: string;
}

export interface ProductionMetrics {
  jobsTotal: number;
  jobsCompleted: number;
  jobsFailed: number;
  rollbacks: number;
  artifactsProduced: number;
  averageQualityScore: number;
}

export interface ProductionJob {
  id: string;
  blueprintId: string;
  projectName: string;
  targetRoot: string;
  requestedBy: string;
  approvedBy?: string;
  status: ProductionJobStatus;
  currentStage: ProductionStage;
  progress: number;
  createdAt: string;
  updatedAt: string;
  artifacts: ProductionArtifact[];
  qualityGates: ProductionQualityGate[];
  qualityScore: number;
  diagnostics: string[];
  transactionId?: string;
}

export interface CreateProductionJobInput {
  blueprintId: string;
  projectName: string;
  targetRoot: string;
  requestedBy: string;
}

export interface MaterializationInstruction {
  relativePath: string;
  content: string;
  kind?: ProductionArtifact["kind"];
}

export interface ExecuteProductionJobInput {
  approvedBy: string;
  instructions: MaterializationInstruction[];
}

export interface ProductionVerification {
  classification: "enterprise-code-production-engine";
  version: "9.0.0";
  healthy: boolean;
  humanFinalAuthority: true;
  capabilities: string[];
  metrics: ProductionMetrics;
  activeJobs: number;
  registeredArtifacts: number;
}
