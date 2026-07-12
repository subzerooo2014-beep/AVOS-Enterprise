export type V4DatabasePrimitive = string | number | boolean | null;
export type V4DatabaseValue =
  | V4DatabasePrimitive
  | V4DatabaseValue[]
  | { [key: string]: V4DatabaseValue };

export enum V4DatabaseStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface V4DatabaseField {
  name: string;
  type: "string" | "number" | "boolean" | "date";
  required: boolean;
  unique?: boolean;
}

export interface V4DatabaseDomain {
  key: string;
  entityName: string;
  fields: V4DatabaseField[];
}

export interface V4DatabaseRelationship {
  sourceDomain: string;
  targetDomain: string;
  relation: "one-to-one" | "one-to-many" | "many-to-many";
  inferredBy: string;
  confidence: number;
}

export interface V4DatabaseInput {
  systemKey: string;
  provider: "postgresql" | "mysql" | "sqlite";
  domains: V4DatabaseDomain[];
  relationships: V4DatabaseRelationship[];
  enableSoftDelete?: boolean;
  enableAuditFields?: boolean;
}

export interface V4DatabaseModel {
  name: string;
  domainKey: string;
  fields: string[];
  indexes: string[];
  constraints: string[];
  relations: string[];
}

export interface V4MigrationStep {
  order: number;
  key: string;
  action: string;
  reversible: boolean;
}

export interface V4SeedRecord {
  model: string;
  values: Record<string, V4DatabaseValue>;
}

export interface V4DatabasePolicy {
  key: string;
  model: string;
  rule: string;
  enforcement: "database" | "application" | "both";
}
