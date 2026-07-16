export type FoundationLifecycle =
  | "DRAFT"
  | "EXPERIMENTAL"
  | "DEVELOPMENT"
  | "TESTING"
  | "APPROVED"
  | "PRODUCTION"
  | "DEPRECATED"
  | "ARCHIVED"
  | "REMOVED";

export type FoundationSeverity = "INFO" | "WARNING" | "ERROR" | "CRITICAL";

export interface CapabilityDefinition {
  id: string;
  name: string;
  description: string;
  domain: string;
  owner: string;
  version: string;
  lifecycle: FoundationLifecycle;
  dependencies: string[];
  securityLevel: "PUBLIC" | "INTERNAL" | "CONFIDENTIAL" | "RESTRICTED";
  aiLevel: "NONE" | "ASSISTED" | "AUTONOMOUS";
  events: string[];
  apis: string[];
  tags: string[];
}

export interface DependencyEdge {
  source: string;
  target: string;
  type: "REQUIRES" | "USES" | "EMITS_TO" | "GOVERNS";
  required: boolean;
}

export interface FoundationContract {
  id: string;
  name: string;
  type: "API" | "EVENT" | "COMMAND" | "QUERY" | "AI" | "PLUGIN" | "INTEGRATION";
  version: string;
  owner: string;
  backwardCompatible: boolean;
}

export interface FoundationPolicy {
  id: string;
  name: string;
  domain: string;
  version: string;
  enabled: boolean;
  enforcement: "ADVISORY" | "MANDATORY" | "BLOCKING";
}

export interface FoundationSchema {
  id: string;
  name: string;
  type: "DATABASE" | "DTO" | "API" | "EVENT" | "WORKFLOW" | "AI" | "MESSAGE";
  version: string;
  compatibility: "BACKWARD" | "FORWARD" | "FULL" | "NONE";
}

export interface FoundationViolation {
  code: string;
  severity: FoundationSeverity;
  component: string;
  message: string;
  remediation: string;
}

export interface FoundationComplianceReport {
  compliant: boolean;
  score: number;
  checkedAt: string;
  violations: FoundationViolation[];
  metrics: {
    capabilities: number;
    dependencies: number;
    contracts: number;
    policies: number;
    schemas: number;
  };
}
