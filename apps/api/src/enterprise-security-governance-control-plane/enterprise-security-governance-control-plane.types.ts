export type SecurityComponentType =
  | "AUTHENTICATION"
  | "AUTHORIZATION"
  | "ROLE"
  | "PERMISSION"
  | "POLICY"
  | "RISK"
  | "COMPLIANCE"
  | "AUDIT"
  | "ZERO_TRUST"
  | "SECRETS"
  | "ENCRYPTION"
  | "THREAT"
  | "UNKNOWN";

export interface SecurityComponentRecord {
  id: string;
  name: string;
  type: SecurityComponentType;
  filePath: string;
  domain: string;
  version: string;
  capabilities: string[];
  dependencies: string[];
  status: "DISCOVERED" | "ACTIVE";
  discoveredAt: string;
}

export interface SecurityPolicyRecord {
  id: string;
  name: string;
  domain: string;
  version: string;
  effect: "ALLOW" | "DENY" | "REVIEW";
  priority: number;
  enabled: boolean;
  conditions: Record<string, unknown>;
}

export interface AccessDecisionRequest {
  subject: string;
  action: string;
  resource: string;
  context?: Record<string, unknown>;
}

export interface AccessDecisionResult {
  id: string;
  subject: string;
  action: string;
  resource: string;
  outcome: "ALLOW" | "DENY" | "REVIEW";
  appliedPolicies: string[];
  riskScore: number;
  reasons: string[];
  createdAt: string;
}

export interface SecurityIncidentRecord {
  id: string;
  type: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  source: string;
  status: "OPEN" | "INVESTIGATING" | "RESOLVED";
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  resolvedAt?: string;
}

export interface SecretRecord {
  key: string;
  value: string;
  version: number;
  updatedAt: string;
}

export interface SecurityMetrics {
  components: number;
  policies: number;
  decisions: number;
  allowed: number;
  denied: number;
  reviews: number;
  incidents: number;
  openIncidents: number;
  secrets: number;
}

export interface SecurityHealth {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: SecurityMetrics;
  components: Record<string, string>;
}
