export type HealthState =
  | "healthy"
  | "degraded"
  | "critical"
  | "unknown";

export type EvolutionStatus =
  | "proposed"
  | "approved"
  | "executing"
  | "completed"
  | "rolled-back"
  | "rejected";

export interface ArchitectureAsset {
  id: string;
  assetType:
    | "foundation"
    | "kernel"
    | "fabric"
    | "module"
    | "service"
    | "capability"
    | "contract"
    | "data-asset";
  canonicalName: string;
  version: string;
  owner: string;
  dependencies: string[];
  contracts: string[];
  policies: string[];
  criticality: "low" | "medium" | "high" | "critical";
  expectedState: Record<string, unknown>;
  runtimeState: Record<string, unknown>;
  status: "active" | "deprecated" | "retired";
  createdAt: string;
  updatedAt: string;
}

export interface ArchitectureFinding {
  id: string;
  assetId: string;
  category:
    | "drift"
    | "dependency"
    | "compatibility"
    | "resilience"
    | "governance"
    | "performance";
  severity: "info" | "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  evidence: Record<string, unknown>;
  recommendation: string;
  blocking: boolean;
  status: "open" | "acknowledged" | "resolved";
  createdAt: string;
  updatedAt: string;
}

export interface ImpactAnalysis {
  id: string;
  changeId: string;
  targetAssetId: string;
  affectedAssets: string[];
  directDependencies: string[];
  transitiveDependencies: string[];
  affectedContracts: string[];
  affectedPolicies: string[];
  riskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  requiresHumanApproval: boolean;
  recommendations: string[];
  analyzedAt: string;
}

export interface RuntimeMetric {
  id: string;
  component: string;
  metric: string;
  value: number;
  unit: string;
  thresholdWarning?: number;
  thresholdCritical?: number;
  labels: Record<string, string>;
  recordedAt: string;
}

export interface RuntimeHealthSnapshot {
  id: string;
  component: string;
  state: HealthState;
  score: number;
  reasons: string[];
  metrics: Record<string, number>;
  recordedAt: string;
}

export interface EvolutionProposal {
  id: string;
  title: string;
  description: string;
  targetAssetId: string;
  currentVersion: string;
  targetVersion: string;
  changeType:
    | "patch"
    | "minor"
    | "major"
    | "migration"
    | "deprecation";
  requestedBy: string;
  requiresHumanApproval: boolean;
  approvedBy?: string;
  status: EvolutionStatus;
  impactAnalysisId?: string;
  rollbackPlan: string[];
  executionPlan: string[];
  evidence: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EvolutionExecution {
  id: string;
  proposalId: string;
  status: "started" | "completed" | "failed" | "rolled-back";
  checkpoints: Array<{
    name: string;
    status: "pending" | "passed" | "failed";
    evidence?: string;
  }>;
  startedAt: string;
  completedAt?: string;
}

export interface AuditRecord {
  id: string;
  action: string;
  actor: string;
  assetId?: string;
  details: Record<string, unknown>;
  createdAt: string;
}

export interface CertificationRecord {
  id: string;
  version: string;
  status: "not-certified" | "certified" | "rejected";
  score: number;
  approvedBy?: string;
  checks: Record<string, boolean>;
  createdAt: string;
}