export type DigitalIdentityType =
  | "user"
  | "organization"
  | "agent"
  | "capability"
  | "service"
  | "workflow"
  | "data-asset"
  | "decision"
  | "product"
  | "integration"
  | "policy"
  | "model";

export type DigitalIdentityStatus =
  | "active"
  | "suspended"
  | "retired"
  | "revoked";

export type MetadataAssetType =
  | "capability"
  | "product"
  | "agent"
  | "workflow"
  | "decision"
  | "knowledge"
  | "data"
  | "service"
  | "integration"
  | "policy"
  | "model";

export type DependencyRelation =
  | "depends-on"
  | "provides-to"
  | "consumes"
  | "publishes"
  | "subscribes-to"
  | "governed-by"
  | "owned-by"
  | "derived-from"
  | "extends"
  | "replaces"
  | "compatible-with"
  | "conflicts-with";

export type DependencyCriticality =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type ContractStatus =
  | "draft"
  | "active"
  | "deprecated"
  | "retired";

export interface DigitalIdentity {
  id: string;
  canonicalName: string;
  displayName: string;
  type: DigitalIdentityType;
  status: DigitalIdentityStatus;
  ownerIdentityId?: string;
  organizationIdentityId?: string;
  aliases: string[];
  permissions: string[];
  attributes: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface MetadataRecord {
  id: string;
  assetId: string;
  assetType: MetadataAssetType;
  version: string;
  purpose: string;
  description: string;
  tags: string[];
  ownerIdentityId: string;
  lifecycleStage: string;
  domain: string;
  sensitivity: "public" | "internal" | "confidential" | "restricted";
  sourceSystem: string;
  schemaVersion: string;
  attributes: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface DependencyNode {
  id: string;
  identityId: string;
  assetType: MetadataAssetType;
  label: string;
  version: string;
  active: boolean;
  metadataRecordId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DependencyEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  relation: DependencyRelation;
  criticality: DependencyCriticality;
  required: boolean;
  versionConstraint?: string;
  contractId?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CapabilityContract {
  id: string;
  name: string;
  providerIdentityId: string;
  consumerIdentityIds: string[];
  contractType:
    | "api"
    | "event"
    | "workflow"
    | "data"
    | "policy"
    | "service";
  version: string;
  status: ContractStatus;
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
  guarantees: string[];
  constraints: string[];
  compatibilityVersions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DependencyImpactResult {
  rootNodeId: string;
  impactedNodeIds: string[];
  criticalPathNodeIds: string[];
  directDependents: string[];
  transitiveDependents: string[];
  risks: string[];
  calculatedAt: string;
}

export interface ArchitectureValidationFinding {
  id: string;
  severity: "info" | "warning" | "error" | "critical";
  code: string;
  message: string;
  subjectId: string;
  relatedIds: string[];
  createdAt: string;
}

export interface Foundation9AuditRecord {
  id: string;
  correlationId: string;
  category:
    | "identity"
    | "metadata"
    | "dependency"
    | "contract"
    | "catalog"
    | "validation"
    | "impact";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
