export type V5SecurityPrimitive = string | number | boolean | null;
export type V5SecurityValue =
  | V5SecurityPrimitive
  | V5SecurityValue[]
  | { [key: string]: V5SecurityValue };

export enum V5SecurityStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface V5SecurityDomain {
  key: string;
  entityName: string;
  sensitiveFields?: string[];
  criticality?: "low" | "medium" | "high";
}

export interface V5SecurityRole {
  key: string;
  permissions: string[];
}

export interface V5SecurityInput {
  systemKey: string;
  tenantStrategy: "shared-schema" | "schema-per-tenant" | "database-per-tenant";
  domains: V5SecurityDomain[];
  roles: V5SecurityRole[];
  enableAbac?: boolean;
  enableZeroTrust?: boolean;
  enableQuotas?: boolean;
}

export interface V5TenantModel {
  tenantEntity: string;
  tenantKeyField: string;
  isolationStrategy: string;
  requiredIndexes: string[];
  lifecycleStates: string[];
}

export interface V5AccessPolicy {
  key: string;
  effect: "allow" | "deny" | "review";
  subjects: string[];
  resources: string[];
  actions: string[];
  conditions: string[];
}

export interface V5ServiceIdentity {
  serviceKey: string;
  identityType: "workload";
  authMethod: "mtls" | "signed-token";
  rotationRequired: boolean;
}

export interface V5QuotaPolicy {
  scope: "tenant" | "user" | "service";
  key: string;
  limit: number;
  windowSeconds: number;
}
