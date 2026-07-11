import {
  CodeGenArtifactDescriptor,
} from "../../artifacts/codegen-artifact.contracts";
import {
  CodeGenMetadata,
} from "../../core/codegen.contracts";
import {
  CodeGenExecutionPlan,
} from "../../planning/contracts/codegen-planning.contracts";

export enum CodeGenArtifactChangeType {
  CREATED = "created",
  MODIFIED = "modified",
  UNCHANGED = "unchanged",
  DELETED = "deleted",
  MOVED = "moved",
  CONFLICTED = "conflicted",
}

export enum CodeGenRegenerationDecision {
  GENERATE = "generate",
  REGENERATE = "regenerate",
  SKIP = "skip",
  DELETE = "delete",
  CONFLICT = "conflict",
}

export enum CodeGenIncrementalRunStatus {
  CREATED = "created",
  DETECTING = "detecting",
  PLANNING = "planning",
  EXECUTING = "executing",
  COMPLETED = "completed",
  FAILED = "failed",
  RECOVERED = "recovered",
}

export interface CodeGenArtifactState {
  artifactKey: string;
  relativePath: string;
  checksum: string;
  sizeBytes: number;
  generatedAt: string;
  metadata: CodeGenMetadata;
}

export interface CodeGenArtifactChange {
  artifactKey: string;
  relativePath: string;
  type: CodeGenArtifactChangeType;
  previous?: CodeGenArtifactState;
  current?: CodeGenArtifactState;
  reason: string;
  detectedAt: string;
}

export interface CodeGenRegenerationItem {
  artifact: CodeGenArtifactDescriptor;
  decision: CodeGenRegenerationDecision;
  change: CodeGenArtifactChange;
  priority: number;
  dependencies: string[];
  reason: string;
}

export interface CodeGenIncrementalExecutionPlan {
  id: string;
  basePlan: CodeGenExecutionPlan;
  items: CodeGenRegenerationItem[];
  generate: string[];
  regenerate: string[];
  skip: string[];
  remove: string[];
  conflicts: string[];
  createdAt: string;
}

export interface CodeGenIncrementalSnapshot {
  version: string;
  workspaceRoot: string;
  targetRoot: string;
  artifacts: CodeGenArtifactState[];
  executionPlan?: CodeGenExecutionPlan;
  metadata: CodeGenMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface CodeGenIncrementalRun {
  id: string;
  status: CodeGenIncrementalRunStatus;
  workspaceRoot: string;
  targetRoot: string;
  snapshotPath: string;
  changes: CodeGenArtifactChange[];
  plan?: CodeGenIncrementalExecutionPlan;
  warnings: string[];
  errors: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface CodeGenIncrementalMetrics {
  artifacts: number;
  created: number;
  modified: number;
  unchanged: number;
  deleted: number;
  conflicted: number;
  generated: number;
  regenerated: number;
  skipped: number;
  savedWorkRatio: number;
  durationMs: number;
  generatedAt: string;
}
