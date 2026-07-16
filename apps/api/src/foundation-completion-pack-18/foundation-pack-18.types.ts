export type FoundationComponentStatus =
  | "present"
  | "partial"
  | "missing"
  | "degraded"
  | "unknown";

export type FoundationValidationSeverity =
  | "info"
  | "warning"
  | "error"
  | "critical";

export type FoundationMaturityLevel =
  | "initial"
  | "developing"
  | "defined"
  | "managed"
  | "optimized";

export interface FoundationComponentDefinition {
  id: string;
  name: string;
  domain:
    | "control-plane"
    | "trust"
    | "governance"
    | "identity"
    | "metadata"
    | "dependency-graph"
    | "architecture"
    | "evolution"
    | "memory"
    | "knowledge"
    | "digital-dna"
    | "digital-genome"
    | "sdk";
  required: boolean;
  expectedModule: string;
  expectedRoute: string;
  minimumVersion: string;
  dependencies: string[];
  status: FoundationComponentStatus;
  metadata: Record<string, unknown>;
  updatedAt: string;
}

export interface FoundationValidationFinding {
  id: string;
  severity: FoundationValidationSeverity;
  code:
    | "missing-component"
    | "partial-component"
    | "dependency-missing"
    | "dependency-cycle"
    | "invalid-version"
    | "route-missing"
    | "module-missing"
    | "cross-foundation-inconsistency"
    | "health-below-threshold"
    | "readiness-blocked";
  componentId: string;
  message: string;
  relatedIds: string[];
  createdAt: string;
}

export interface FoundationConsistencyResult {
  id: string;
  consistent: boolean;
  checkedComponents: number;
  dependencyCycles: string[][];
  orphanComponents: string[];
  versionMismatches: string[];
  routeConflicts: string[];
  findings: FoundationValidationFinding[];
  checkedAt: string;
}

export interface FoundationMaturityAssessment {
  id: string;
  level: FoundationMaturityLevel;
  score: number;
  dimensions: {
    architecture: number;
    governance: number;
    trust: number;
    knowledge: number;
    intelligence: number;
    operations: number;
  };
  strengths: string[];
  gaps: string[];
  assessedAt: string;
}

export interface FoundationReadinessAssessment {
  id: string;
  score: number;
  ready: boolean;
  blockers: string[];
  warnings: string[];
  requiredComponentsPresent: number;
  requiredComponentsTotal: number;
  validationScore: number;
  consistencyScore: number;
  maturityScore: number;
  assessedAt: string;
}

export interface FoundationRecommendation {
  id: string;
  priority: "low" | "medium" | "high" | "critical";
  category:
    | "component"
    | "dependency"
    | "consistency"
    | "maturity"
    | "health"
    | "readiness";
  title: string;
  description: string;
  relatedComponentIds: string[];
  rationale: string[];
  status: "open" | "accepted" | "dismissed" | "implemented";
  createdAt: string;
  updatedAt: string;
}

export interface FoundationHealthIndex {
  id: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    componentCoverageScore: number;
    validationScore: number;
    consistencyScore: number;
    maturityScore: number;
    readinessScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface FoundationValidationAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "registry"
    | "validation"
    | "consistency"
    | "maturity"
    | "readiness"
    | "recommendation"
    | "health";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
