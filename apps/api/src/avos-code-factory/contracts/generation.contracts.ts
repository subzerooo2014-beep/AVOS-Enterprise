import { FactoryArtifactType } from "./workspace.contracts";

export interface FactoryBlueprintFile {
  path: string;
  type: FactoryArtifactType;
  templateId?: string;
  content?: string;
  variables?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface FactoryBlueprintIR {
  id: string;
  projectId: string;
  name: string;
  objective: string;
  language: string;
  framework?: string;
  files: FactoryBlueprintFile[];
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface FactoryFilePlanItem {
  id: string;
  projectId: string;
  relativePath: string;
  artifactType: FactoryArtifactType;
  templateId?: string;
  inlineContent?: string;
  variables: Record<string, unknown>;
  metadata: Record<string, unknown>;
  order: number;
}

export interface FactoryFilePlan {
  id: string;
  blueprintId: string;
  projectId: string;
  items: FactoryFilePlanItem[];
  createdAt: string;
}

export interface FactoryValidationIssue {
  code: string;
  severity: "info" | "warning" | "error";
  message: string;
  file?: string;
}

export interface FactoryValidationReport {
  valid: boolean;
  score: number;
  issues: FactoryValidationIssue[];
  checkedAt: string;
}

export interface FactoryGeneratedFile {
  planItemId: string;
  relativePath: string;
  artifactType: FactoryArtifactType;
  content: string;
  checksum: string;
  artifactId?: string;
}

export interface FactoryGenerationPackage {
  id: string;
  projectId: string;
  blueprintId: string;
  jobId: string;
  files: FactoryGeneratedFile[];
  validation: FactoryValidationReport;
  manifest: Record<string, unknown>;
  createdAt: string;
}

export type FactoryGenerationJobStatus =
  | "queued"
  | "planning"
  | "rendering"
  | "persisting"
  | "validating"
  | "packaging"
  | "completed"
  | "failed";

export interface FactoryGenerationJob {
  id: string;
  projectId: string;
  blueprintId?: string;
  planId?: string;
  status: FactoryGenerationJobStatus;
  objective: string;
  filesPlanned: number;
  filesGenerated: number;
  errors: string[];
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  packageId?: string;
  metadata: Record<string, unknown>;
}
