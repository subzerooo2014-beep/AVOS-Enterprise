export type CapabilityKind =
  | "MODULE"
  | "SERVICE"
  | "AI_AGENT"
  | "WORKFLOW"
  | "API"
  | "PRODUCT"
  | "RULE"
  | "DASHBOARD"
  | "AUTOMATION"
  | "MODEL"
  | "INTEGRATION"
  | "PLUGIN"
  | "DATA_ASSET"
  | "PLATFORM_SERVICE";

export type CapabilityLifecycleStage =
  | "CONCEPT"
  | "PROTOTYPE"
  | "SHARED_CAPABILITY"
  | "CORE_ENGINE"
  | "PLATFORM_SERVICE"
  | "STANDALONE_PRODUCT"
  | "LEGACY_ASSET";

export type CapabilityOperationalStatus =
  | "DRAFT"
  | "REGISTERED"
  | "ACTIVE"
  | "DEGRADED"
  | "SUSPENDED"
  | "DEPRECATED"
  | "ARCHIVED";

export type CapabilityVisibility =
  | "PRIVATE"
  | "INTERNAL"
  | "PARTNER"
  | "PUBLIC";

export type CapabilityCriticality =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "MISSION_CRITICAL";

export type CapabilityDependencyType =
  | "REQUIRES"
  | "OPTIONAL"
  | "EXTENDS"
  | "IMPLEMENTS"
  | "PROVIDES_FALLBACK_FOR"
  | "REPLACES";

export interface CapabilityIdentity {
  id: string;
  key: string;
  name: string;
  namespace: string;
  kind: CapabilityKind;
  owner: string;
  organization: string;
}

export interface CapabilityPurpose {
  summary: string;
  businessValue: string;
  outcomes: string[];
  nonGoals: string[];
}

export interface CapabilityContract {
  id: string;
  name: string;
  version: string;
  type: "COMMAND" | "QUERY" | "EVENT" | "API" | "DATA" | "POLICY";
  inputSchemaRef?: string;
  outputSchemaRef?: string;
  compatibility: "BACKWARD" | "FORWARD" | "FULL" | "NONE";
  required: boolean;
}

export interface CapabilityDependency {
  capabilityKey: string;
  versionRange: string;
  type: CapabilityDependencyType;
  required: boolean;
  reason: string;
}

export interface CapabilityPolicyBinding {
  policyId: string;
  policyVersion: string;
  enforcement: "ADVISORY" | "MANDATORY" | "BLOCKING";
  inherited: boolean;
}

export interface CapabilityPermission {
  action: string;
  resource: string;
  roles: string[];
  approvalRequired: boolean;
}

export interface CapabilityEventDefinition {
  name: string;
  version: string;
  direction: "PUBLISHES" | "SUBSCRIBES";
  schemaRef?: string;
  durable: boolean;
}

export interface CapabilityMetricDefinition {
  name: string;
  unit: string;
  type: "COUNTER" | "GAUGE" | "HISTOGRAM" | "RATE" | "SCORE";
  target?: number;
  warningThreshold?: number;
  criticalThreshold?: number;
}

export interface CapabilityHealthDefinition {
  healthEndpoint?: string;
  readinessEndpoint?: string;
  livenessEndpoint?: string;
  expectedStatus: "HEALTHY";
  checkIntervalSeconds: number;
  timeoutSeconds: number;
}

export interface CapabilityRuntimeDescriptor {
  runtime: "NODE" | "BROWSER" | "MOBILE" | "EDGE" | "EXTERNAL" | "AGNOSTIC";
  entrypoint?: string;
  moduleRef?: string;
  serviceRef?: string;
  controllerRef?: string;
  stateless: boolean;
  multiTenant: boolean;
  supportsIsolation: boolean;
}

export interface CapabilitySecurityDescriptor {
  classification:
    | "PUBLIC"
    | "INTERNAL"
    | "CONFIDENTIAL"
    | "RESTRICTED";
  authenticationRequired: boolean;
  authorizationRequired: boolean;
  dataSensitivity: string[];
  trustBoundary: string;
}

export interface CapabilityVersionRecord {
  version: string;
  releasedAt: string;
  changeType: "MAJOR" | "MINOR" | "PATCH";
  changes: string[];
  compatibleWith: string[];
  migrationRef?: string;
}

export interface CapabilityEvolutionRecord {
  id: string;
  fromStage: CapabilityLifecycleStage;
  toStage: CapabilityLifecycleStage;
  reason: string;
  approvedBy: string;
  occurredAt: string;
}

export interface CapabilityDigitalDNA {
  identity: CapabilityIdentity;
  purpose: CapabilityPurpose;
  version: string;
  lifecycleStage: CapabilityLifecycleStage;
  operationalStatus: CapabilityOperationalStatus;
  visibility: CapabilityVisibility;
  criticality: CapabilityCriticality;
  tags: string[];
  categories: string[];
  contracts: CapabilityContract[];
  dependencies: CapabilityDependency[];
  policies: CapabilityPolicyBinding[];
  permissions: CapabilityPermission[];
  events: CapabilityEventDefinition[];
  metrics: CapabilityMetricDefinition[];
  health: CapabilityHealthDefinition;
  runtime: CapabilityRuntimeDescriptor;
  security: CapabilitySecurityDescriptor;
  configurationSchemaRef?: string;
  documentationRef?: string;
  sourceRef?: string;
  versionHistory: CapabilityVersionRecord[];
  evolutionHistory: CapabilityEvolutionRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface CapabilityRegistrationInput {
  key: string;
  name: string;
  namespace?: string;
  kind: CapabilityKind;
  owner: string;
  organization?: string;
  summary: string;
  businessValue: string;
  outcomes?: string[];
  nonGoals?: string[];
  version?: string;
  lifecycleStage?: CapabilityLifecycleStage;
  visibility?: CapabilityVisibility;
  criticality?: CapabilityCriticality;
  tags?: string[];
  categories?: string[];
  contracts?: CapabilityContract[];
  dependencies?: CapabilityDependency[];
  policies?: CapabilityPolicyBinding[];
  permissions?: CapabilityPermission[];
  events?: CapabilityEventDefinition[];
  metrics?: CapabilityMetricDefinition[];
  health?: Partial<CapabilityHealthDefinition>;
  runtime?: Partial<CapabilityRuntimeDescriptor>;
  security?: Partial<CapabilitySecurityDescriptor>;
  configurationSchemaRef?: string;
  documentationRef?: string;
  sourceRef?: string;
}

export interface CapabilityValidationIssue {
  code: string;
  severity: "INFO" | "WARNING" | "ERROR" | "BLOCKING";
  field: string;
  message: string;
}

export interface CapabilityValidationResult {
  valid: boolean;
  qualityScore: number;
  issues: CapabilityValidationIssue[];
  evaluatedAt: string;
}

export interface CapabilityRegistrySnapshot {
  total: number;
  active: number;
  degraded: number;
  suspended: number;
  deprecated: number;
  archived: number;
  byKind: Record<string, number>;
  byLifecycleStage: Record<string, number>;
  dependencyEdges: number;
  contractCount: number;
  eventDefinitions: number;
  metricDefinitions: number;
  generatedAt: string;
}