export type OperationsStatus =
  | "planned"
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface OperationsEnvironment {
  id: string;
  key: "development" | "test" | "staging" | "production";
  name: string;
  region: string;
  protected: boolean;
  deploymentPolicy: "open" | "approval-required" | "change-window-only";
  activeRelease?: string;
  healthScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface RuntimeFleetNode {
  id: string;
  runtimeKey: string;
  instanceName: string;
  environment: OperationsEnvironment["key"];
  region: string;
  zone: string;
  status: "online" | "draining" | "maintenance" | "offline";
  version: string;
  healthScore: number;
  capacity: number;
  workload: number;
  tags: string[];
  lastHeartbeatAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeploymentRecord {
  id: string;
  applicationKey: string;
  version: string;
  environment: OperationsEnvironment["key"];
  strategy: "rolling" | "blue-green" | "canary" | "recreate";
  status: OperationsStatus;
  requestedBy: string;
  approvedBy?: string;
  fleetNodeIds: string[];
  previousVersion?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface ReleaseRecord {
  id: string;
  applicationKey: string;
  version: string;
  environment: OperationsEnvironment["key"];
  status: "draft" | "approved" | "released" | "rejected" | "rolled-back";
  changeSummary: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  requiredApprovals: number;
  approvals: string[];
  deploymentId?: string;
  createdAt: string;
  releasedAt?: string;
}

export interface RollbackRecord {
  id: string;
  deploymentId: string;
  environment: OperationsEnvironment["key"];
  fromVersion: string;
  toVersion: string;
  reason: string;
  requestedBy: string;
  approvedBy: string;
  status: OperationsStatus;
  createdAt: string;
  completedAt?: string;
}

export interface MaintenanceWindow {
  id: string;
  environment: OperationsEnvironment["key"];
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  status: "scheduled" | "active" | "completed" | "cancelled";
  affectedServices: string[];
  approvedBy: string;
  createdAt: string;
}

export interface IncidentRecord {
  id: string;
  title: string;
  severity: "sev1" | "sev2" | "sev3" | "sev4";
  environment: OperationsEnvironment["key"];
  status: "open" | "investigating" | "mitigated" | "resolved" | "closed";
  commander: string;
  affectedServices: string[];
  summary: string;
  timeline: Array<{
    at: string;
    actor: string;
    action: string;
  }>;
  createdAt: string;
  resolvedAt?: string;
}

export interface OperationsCommand {
  id: string;
  command:
    | "deploy"
    | "rollback"
    | "scale"
    | "drain"
    | "resume"
    | "maintenance-start"
    | "maintenance-complete"
    | "incident-open"
    | "incident-resolve";
  targetIds: string[];
  requestedBy: string;
  approvedBy?: string;
  requiresHumanApproval: boolean;
  status: OperationsStatus;
  result: Record<string, unknown>;
  createdAt: string;
  completedAt?: string;
}

export interface OperationsDashboard {
  id: string;
  score: number;
  state: "healthy" | "degraded" | "critical";
  environments: number;
  fleetNodes: number;
  onlineFleetNodes: number;
  activeDeployments: number;
  activeMaintenanceWindows: number;
  openIncidents: number;
  criticalIncidents: number;
  blockingIssues: string[];
  createdAt: string;
}

export interface ProductionCertification {
  id: string;
  version: string;
  status: "not-certified" | "certified" | "rejected";
  score: number;
  approvedBy?: string;
  checks: Record<string, boolean>;
  createdAt: string;
}