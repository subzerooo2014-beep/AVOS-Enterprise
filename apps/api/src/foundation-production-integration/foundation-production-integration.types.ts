export type IntegrationStatus =
  | "registered"
  | "connected"
  | "degraded"
  | "disconnected"
  | "certified";

export interface FoundationIntegrationTarget {
  id: string;
  key:
    | "foundation-ultra"
    | "enterprise-kernel"
    | "capability-fabric"
    | "knowledge-fabric"
    | "intelligence-fabric"
    | "living-blueprint"
    | "digital-genome"
    | "event-bus"
    | "control-plane";
  name: string;
  version: string;
  status: IntegrationStatus;
  endpointHints: string[];
  required: boolean;
  dependencies: string[];
  capabilities: string[];
  certificationRequired: boolean;
  healthScore: number;
  lastCheckedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ControlPlaneCommand {
  id: string;
  command:
    | "discover"
    | "synchronize"
    | "health-check"
    | "verify"
    | "certify"
    | "reconcile";
  targetIds: string[];
  requestedBy: string;
  requiresHumanApproval: boolean;
  approvedBy?: string;
  status: "queued" | "running" | "completed" | "failed" | "rejected";
  results: Array<{
    targetId: string;
    success: boolean;
    message: string;
    score?: number;
  }>;
  createdAt: string;
  completedAt?: string;
}

export interface UnifiedHealthSnapshot {
  id: string;
  overallScore: number;
  state: "healthy" | "degraded" | "critical";
  targets: Array<{
    targetId: string;
    status: IntegrationStatus;
    healthScore: number;
    required: boolean;
  }>;
  blockingIssues: string[];
  createdAt: string;
}

export interface CertificationRegistryEntry {
  id: string;
  subject: string;
  version: string;
  status: "certified" | "rejected" | "unknown";
  score: number;
  approvedBy?: string;
  source: string;
  checks: Record<string, boolean>;
  registeredAt: string;
}

export interface ProductionReadinessReport {
  id: string;
  version: string;
  status: "ready" | "not-ready";
  score: number;
  checks: Record<string, boolean>;
  blockingIssues: string[];
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