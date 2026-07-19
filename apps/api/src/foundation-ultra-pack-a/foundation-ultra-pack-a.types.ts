export type FoundationAssetKind =
  | "constitution"
  | "language-term"
  | "digital-dna"
  | "digital-genome"
  | "asset-identity"
  | "blueprint"
  | "architecture-drift";

export type FoundationStatus =
  | "draft"
  | "active"
  | "deprecated"
  | "superseded"
  | "certified";

export interface AuditRecord {
  id: string;
  action: string;
  actor: string;
  assetId?: string;
  details: Record<string, unknown>;
  createdAt: string;
}

export interface ConstitutionalRule {
  id: string;
  code: string;
  title: string;
  description: string;
  category:
    | "foundation"
    | "governance"
    | "human-authority"
    | "compliance"
    | "architecture"
    | "trust";
  mandatory: boolean;
  priority: number;
  status: FoundationStatus;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnterpriseTerm {
  id: string;
  term: string;
  canonicalName: string;
  definition: string;
  aliases: string[];
  forbiddenAliases: string[];
  domain: string;
  version: string;
  status: FoundationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DigitalDnaRecord {
  id: string;
  assetId: string;
  assetType: string;
  purpose: string;
  owner: string;
  version: string;
  lifecycle: string;
  dependencies: string[];
  contracts: string[];
  policies: string[];
  permissions: string[];
  events: string[];
  metrics: string[];
  risks: string[];
  compliance: string[];
  trust: Record<string, unknown>;
  certification: Record<string, unknown>;
  evolutionHistory: Array<Record<string, unknown>>;
  createdAt: string;
  updatedAt: string;
}

export interface DigitalGenomeRecord {
  id: string;
  name: string;
  version: string;
  assetIds: string[];
  capabilityIds: string[];
  platformIds: string[];
  productIds: string[];
  dependencyEdges: Array<{ from: string; to: string; type: string }>;
  constitutionalRuleIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AssetIdentityRecord {
  id: string;
  canonicalName: string;
  assetType: string;
  owner: string;
  authority: string;
  jurisdictionScope: string[];
  lifecycle: string;
  version: string;
  status: FoundationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BlueprintRecord {
  id: string;
  name: string;
  version: string;
  status: FoundationStatus;
  designedAssets: string[];
  runtimeAssets: string[];
  dependencies: Array<{ from: string; to: string; type: string }>;
  contracts: string[];
  policies: string[];
  environments: string[];
  certification: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ArchitectureDriftRecord {
  id: string;
  blueprintId: string;
  severity: "info" | "low" | "medium" | "high" | "critical";
  category:
    | "missing-runtime-asset"
    | "unexpected-runtime-asset"
    | "dependency-mismatch"
    | "contract-mismatch"
    | "policy-mismatch"
    | "version-mismatch";
  expected: unknown;
  actual: unknown;
  resolved: boolean;
  resolution?: string;
  detectedAt: string;
  resolvedAt?: string;
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