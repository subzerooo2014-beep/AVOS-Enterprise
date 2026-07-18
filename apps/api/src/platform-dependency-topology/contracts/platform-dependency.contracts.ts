export type PlatformDependencyType = "required" | "optional" | "runtime";
export type PlatformDependencyStatus = "active" | "disabled";
export type PlatformValidationSeverity = "info" | "warning" | "error";

export interface PlatformDependencyRecord {
  id: string;
  sourceServiceId: string;
  targetServiceId: string;
  type: PlatformDependencyType;
  minimumVersion?: string;
  status: PlatformDependencyStatus;
  metadata?: Record<string, unknown>;
  registeredAt: string;
  updatedAt: string;
}

export interface PlatformDependencyGraphNode {
  serviceId: string;
  incoming: string[];
  outgoing: string[];
}

export interface PlatformDependencyGraph {
  nodes: PlatformDependencyGraphNode[];
  edges: PlatformDependencyRecord[];
  generatedAt: string;
}

export interface PlatformValidationFinding {
  code: string;
  severity: PlatformValidationSeverity;
  message: string;
  serviceId?: string;
  dependencyId?: string;
  details?: Record<string, unknown>;
}

export interface PlatformValidationReport {
  id: string;
  status: "passed" | "failed";
  score: number;
  findings: PlatformValidationFinding[];
  validatedAt: string;
}

export interface PlatformExecutionWave {
  wave: number;
  services: string[];
}

export interface PlatformExecutionPlan {
  kind: "startup" | "shutdown";
  valid: boolean;
  order: string[];
  waves: PlatformExecutionWave[];
  findings: PlatformValidationFinding[];
  generatedAt: string;
}

export interface PlatformImpactReport {
  serviceId: string;
  directlyAffected: string[];
  indirectlyAffected: string[];
  totalAffected: number;
  impactPercentage: number;
  critical: boolean;
  generatedAt: string;
}

export interface PlatformTopologyReport {
  services: number;
  links: number;
  roots: string[];
  leaves: string[];
  criticalNodes: Array<{
    serviceId: string;
    dependentCount: number;
  }>;
  singlePointsOfFailure: string[];
  topologyScore: number;
  generatedAt: string;
}