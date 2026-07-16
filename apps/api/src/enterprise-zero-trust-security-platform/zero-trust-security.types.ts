export interface IdentityRecord {
  id: string;
  type: "USER" | "SERVICE" | "DEVICE";
  status: "ACTIVE" | "SUSPENDED" | "REVOKED";
  attributes: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface AuthorizationPolicy {
  id: string;
  name: string;
  effect: "ALLOW" | "DENY" | "REVIEW";
  priority: number;
  enabled: boolean;
  conditions: Record<string, unknown>;
  version: string;
}

export interface AuthorizationDecision {
  id: string;
  identityId: string;
  action: string;
  resource: string;
  outcome: "ALLOW" | "DENY" | "REVIEW";
  matchedPolicies: string[];
  riskScore: number;
  reasons: string[];
  createdAt: string;
}

export interface SecretRecord {
  key: string;
  value: string;
  version: number;
  updatedAt: string;
}

export interface KeyRecord {
  id: string;
  algorithm: string;
  version: number;
  status: "ACTIVE" | "RETIRED" | "REVOKED";
  material: string;
  createdAt: string;
}

export interface CertificateRecord {
  id: string;
  subject: string;
  issuer: string;
  serialNumber: string;
  validFrom: string;
  validTo: string;
  status: "ACTIVE" | "EXPIRED" | "REVOKED";
}

export interface AuditRecord {
  id: string;
  actor: string;
  action: string;
  resource: string;
  outcome: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface ThreatRecord {
  id: string;
  type: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  source: string;
  status: "OPEN" | "INVESTIGATING" | "RESOLVED";
  description: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface ZeroTrustMetrics {
  identities: number;
  policies: number;
  decisions: number;
  deniedDecisions: number;
  secrets: number;
  keys: number;
  certificates: number;
  audits: number;
  threats: number;
  openThreats: number;
}

export interface ZeroTrustHealth {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: ZeroTrustMetrics;
  components: Record<string, string>;
}
