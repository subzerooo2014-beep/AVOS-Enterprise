export type FactoryBuildStatus =
  | "queued"
  | "materializing"
  | "building"
  | "verifying"
  | "packaging"
  | "completed"
  | "failed"
  | "rolled-back";

export interface FactoryMaterializedFile {
  artifactId: string;
  relativePath: string;
  absolutePath: string;
  checksum: string;
  bytes: number;
}

export interface FactoryMaterializationResult {
  id: string;
  projectId: string;
  packageId: string;
  workspacePath: string;
  files: FactoryMaterializedFile[];
  createdAt: string;
}

export interface FactoryCommandResult {
  command: string;
  cwd: string;
  exitCode: number;
  stdout: string;
  stderr: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
}

export interface FactoryBuildReport {
  id: string;
  projectId: string;
  packageId: string;
  status: FactoryBuildStatus;
  workspacePath: string;
  materializationId?: string;
  commands: FactoryCommandResult[];
  verification: {
    passed: boolean;
    checks: Record<string, boolean>;
    notes: string[];
  };
  outputPackagePath?: string;
  rollbackPath?: string;
  errors: string[];
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  metadata: Record<string, unknown>;
}

export interface FactoryScaffoldDefinition {
  id: string;
  name: string;
  framework: "nestjs" | "nextjs" | "node" | "generic";
  files: Array<{
    path: string;
    content: string;
    type:
      | "source"
      | "configuration"
      | "schema"
      | "documentation"
      | "test"
      | "build"
      | "package"
      | "metadata";
  }>;
}

export interface FactoryCapabilityBlueprint {
  projectId: string;
  capabilityName: string;
  capabilitySlug: string;
  objective: string;
  version: string;
  includeController: boolean;
  includeTests: boolean;
  metadata: Record<string, unknown>;
}
