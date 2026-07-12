export type V4Primitive = string | number | boolean | null;
export type V4Value =
  | V4Primitive
  | V4Value[]
  | { [key: string]: V4Value };

export enum V4DomainStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface V4DomainFieldInput {
  name: string;
  type: "string" | "number" | "boolean" | "date";
  required: boolean;
  unique?: boolean;
}

export interface V4DomainInput {
  key: string;
  entityName: string;
  fields: V4DomainFieldInput[];
}

export interface V4EnterpriseIntent {
  systemKey: string;
  systemName: string;
  description: string;
  domains: V4DomainInput[];
  businessGoals?: string[];
  targetUsers?: string[];
  constraints?: string[];
}

export interface V4Capability {
  key: string;
  domainKey: string;
  name: string;
  category:
    | "core"
    | "supporting"
    | "analytics"
    | "governance";
  confidence: number;
}

export interface V4EntityInsight {
  entity: string;
  aggregateRoot: boolean;
  identifiers: string[];
  searchableFields: string[];
  auditable: boolean;
}

export interface V4RelationshipInsight {
  sourceDomain: string;
  targetDomain: string;
  relation: "one-to-one" | "one-to-many" | "many-to-many";
  inferredBy: string;
  confidence: number;
}

export interface V4WorkflowInsight {
  key: string;
  domainKey: string;
  trigger: string;
  steps: string[];
  outcome: string;
}

export interface V4RoleInsight {
  role: string;
  permissions: string[];
}

export interface V4EventInsight {
  key: string;
  domainKey: string;
  type: "domain" | "integration" | "audit";
  payloadFields: string[];
}

export interface V4PolicyInsight {
  key: string;
  domainKey: string;
  rule: string;
  enforcement: "allow" | "deny" | "review";
}

export interface V4RiskSignal {
  key: string;
  domainKey: string;
  severity: "low" | "medium" | "high";
  recommendation: string;
}
