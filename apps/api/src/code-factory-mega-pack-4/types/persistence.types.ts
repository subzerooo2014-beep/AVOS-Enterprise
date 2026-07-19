export type WorkspaceStatus =
  | "created"
  | "initializing"
  | "active"
  | "saving"
  | "persisted"
  | "materializing"
  | "synchronized"
  | "checkpointed"
  | "recovering"
  | "restored"
  | "degraded"
  | "conflicted"
  | "failed"
  | "archived";

export type RunStatus =
  | "created"
  | "running"
  | "completed"
  | "failed"
  | "recovered";

export interface WorkspaceMetadata {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  status: WorkspaceStatus;
  rootPath: string;
  version: number;
  activeSnapshotId?: string;
  latestCheckpointId?: string;
  createdAt: string;
  updatedAt: string;
  lastPersistedAt?: string;
  lastMaterializedAt?: string;
  lastRecoveredAt?: string;
  metadata: Record<string, unknown>;
}

export interface WorkspaceFileInput {
  relativePath: string;
  content: string;
  encoding?: BufferEncoding;
  executable?: boolean;
}

export interface MaterializedArtifact {
  id: string;
  workspaceId: string;
  relativePath: string;
  absolutePath: string;
  sha256: string;
  size: number;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceSnapshot {
  id: string;
  workspaceId: string;
  version: number;
  sourcePath: string;
  snapshotPath: string;
  manifestHash: string;
  createdAt: string;
  reason: string;
}

export interface WorkspaceCheckpoint {
  id: string;
  workspaceId: string;
  snapshotId: string;
  version: number;
  label: string;
  createdAt: string;
  createdBy: string;
  safe: boolean;
}

export interface AutonomousRunRecord {
  id: string;
  workspaceId: string;
  objective: string;
  status: RunStatus;
  startedAt: string;
  completedAt?: string;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  recoveryCheckpointId?: string;
}

export interface FactoryCertification {
  id: string;
  workspaceId?: string;
  status: "certified" | "not-certified" | "failed";
  score: number;
  checks: Record<string, boolean>;
  evidence: Record<string, unknown>;
  certifiedAt?: string;
  approvedBy?: string;
  humanFinalAuthority: boolean;
}

export interface AuditRecord {
  id: string;
  workspaceId?: string;
  action: string;
  actor: string;
  traceId: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface WorkspaceHealth {
  workspaceId: string;
  status: "healthy" | "degraded" | "critical";
  score: number;
  checks: Record<string, boolean>;
  reasons: string[];
  checkedAt: string;
}

export interface RepositoryState {
  workspaces: WorkspaceMetadata[];
  artifacts: MaterializedArtifact[];
  snapshots: WorkspaceSnapshot[];
  checkpoints: WorkspaceCheckpoint[];
  runs: AutonomousRunRecord[];
  certifications: FactoryCertification[];
  audits: AuditRecord[];
  packages: GenerationPackageRecord[];
  updatedAt: string;
}

export interface GenerationPackageRecord {
  id: string;
  workspaceId: string;
  name: string;
  version: string;
  artifactIds: string[];
  status: "draft" | "materialized" | "verified" | "certified";
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}