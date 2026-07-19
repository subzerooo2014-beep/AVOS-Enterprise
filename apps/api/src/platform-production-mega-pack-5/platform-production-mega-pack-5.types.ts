export type SecurityDecision = "allow" | "deny" | "challenge";
export type IdentityStatus = "active" | "suspended" | "revoked";
export type ThreatSeverity = "low" | "medium" | "high" | "critical";

export interface RuntimeIdentity {
  id: string;
  runtimeKey: string;
  serviceName: string;
  environment: string;
  trustDomain: string;
  status: IdentityStatus;
  publicKeyId: string;
  capabilities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthenticationSession {
  id: string;
  identityId: string;
  tokenFingerprint: string;
  issuedAt: string;
  expiresAt: string;
  status: "active" | "expired" | "revoked";
}

export interface AuthorizationPolicy {
  id: string;
  name: string;
  subjectPattern: string;
  resourcePattern: string;
  actions: string[];
  environments: string[];
  decision: SecurityDecision;
  priority: number;
  active: boolean;
  humanApprovalRequired: boolean;
  createdAt: string;
}

export interface SecretRecord {
  id: string;
  name: string;
  scope: string;
  version: number;
  encryptedValue: string;
  checksum: string;
  active: boolean;
  createdAt: string;
  rotatedAt?: string;
}

export interface EncryptionRecord {
  id: string;
  algorithm: string;
  keyId: string;
  purpose: string;
  status: "active" | "retired";
  createdAt: string;
}

export interface ThreatSignal {
  id: string;
  source: string;
  type: string;
  severity: ThreatSeverity;
  confidence: number;
  subject: string;
  indicators: Record<string, unknown>;
  status: "open" | "contained" | "resolved" | "false-positive";
  createdAt: string;
  updatedAt: string;
}

export interface SecurityIncident {
  id: string;
  title: string;
  severity: ThreatSeverity;
  sourceThreatId: string;
  status: "open" | "investigating" | "contained" | "resolved";
  owner: string;
  timeline: Array<{
    at: string;
    action: string;
    actor: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface SecurityAuditRecord {
  id: string;
  category: string;
  action: string;
  actor: string;
  subject: string;
  outcome: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface SecurityDashboard {
  id: string;
  score: number;
  state: "healthy" | "degraded" | "critical";
  activeIdentities: number;
  activeSessions: number;
  activePolicies: number;
  activeSecrets: number;
  activeEncryptionKeys: number;
  openThreats: number;
  criticalThreats: number;
  openIncidents: number;
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