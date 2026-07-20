export type AgpRuntimeStatus =
  | "created"
  | "booting"
  | "operational"
  | "degraded"
  | "stopped";

export type AgpApprovalStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected";

export interface AgpRuntimeState {
  name: string;
  version: string;
  status: AgpRuntimeStatus;
  bootedAt?: string;
  stoppedAt?: string;
  environment: string;
  featureFlags: Record<string, boolean>;
  metrics: Record<string, number>;
}

export interface AgpRegistryItem {
  id: string;
  type:
    | "capability"
    | "service"
    | "engine"
    | "strategy"
    | "integration";
  name: string;
  version: string;
  status: "registered" | "active" | "inactive";
  dependencies: string[];
  registeredAt: string;
}

export interface AgpDomainEvent<T = unknown> {
  id: string;
  type: string;
  version: number;
  source: string;
  aggregateId?: string;
  payload: T;
  metadata: Record<string, string>;
  occurredAt: string;
}

export interface AgpVerificationResult {
  id: string;
  name: string;
  status: "passed" | "failed";
  score: number;
  checks: Record<string, boolean>;
  findings: string[];
  generatedAt: string;
}

export interface AgpCertificationResult {
  id: string;
  name: string;
  version: string;
  status: "certified" | "rejected";
  score: number;
  checks: Record<string, boolean>;
  blockingFindings: string[];
  approvedBy: string;
  certifiedAt: string;
  generatedAt: string;
}