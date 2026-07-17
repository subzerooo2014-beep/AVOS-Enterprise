export type IdentityKind =
  | "human"
  | "organization"
  | "agent"
  | "capability"
  | "product"
  | "workflow"
  | "decision"
  | "data-asset"
  | "integration"
  | "machine";

export type IdentityStatus = "active" | "suspended" | "retired" | "merged";
export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";
export type TrustLevel = "unknown" | "basic" | "trusted" | "high-assurance";

export interface DigitalIdentityRecord {
  readonly id: string;
  readonly universalId: string;
  readonly kind: IdentityKind;
  readonly displayName: string;
  readonly description?: string;
  readonly externalReference?: string;
  readonly ownerIdentityId?: string;
  readonly status: IdentityStatus;
  readonly verificationStatus: VerificationStatus;
  readonly trustLevel: TrustLevel;
  readonly trustScore: number;
  readonly version: number;
  readonly tags: readonly string[];
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly dna: DigitalDnaProfile;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface DigitalDnaProfile {
  readonly purpose: string;
  readonly capabilities: readonly string[];
  readonly policies: readonly string[];
  readonly permissions: readonly string[];
  readonly dependencies: readonly string[];
  readonly contracts: readonly string[];
  readonly provenance: readonly string[];
  readonly evolutionHistory: readonly string[];
}

export interface IdentityRelationship {
  readonly id: string;
  readonly sourceIdentityId: string;
  readonly targetIdentityId: string;
  readonly type: string;
  readonly strength: number;
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly createdAt: string;
}

export interface IdentityAuditEvent {
  readonly id: string;
  readonly identityId?: string;
  readonly action: string;
  readonly actor: string;
  readonly outcome: "allowed" | "denied" | "recorded";
  readonly details: Readonly<Record<string, unknown>>;
  readonly createdAt: string;
}

export interface IdentityPolicyEvaluation {
  readonly id: string;
  readonly identityId: string;
  readonly action: string;
  readonly approved: boolean;
  readonly requiresHumanApproval: boolean;
  readonly reasons: readonly string[];
  readonly evaluatedAt: string;
}

export interface IdentityHealthReport {
  readonly status: "healthy" | "degraded" | "critical";
  readonly score: number;
  readonly identities: number;
  readonly activeIdentities: number;
  readonly verifiedIdentities: number;
  readonly relationships: number;
  readonly duplicateCandidates: number;
  readonly findings: readonly string[];
  readonly generatedAt: string;
}

export interface IdentityCertificationRecord {
  readonly id: string;
  readonly reviewId: string;
  readonly status: "certified" | "rejected";
  readonly score: number;
  readonly level: "excellent" | "good" | "conditional" | "rejected";
  readonly blockingFindings: readonly string[];
  readonly certifiedAt: string;
}
