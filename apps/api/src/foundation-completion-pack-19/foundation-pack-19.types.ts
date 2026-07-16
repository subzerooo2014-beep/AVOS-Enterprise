export type OntologyTermType =
  | "entity"
  | "capability"
  | "product"
  | "workflow"
  | "decision"
  | "policy"
  | "knowledge"
  | "event"
  | "agent"
  | "service"
  | "data"
  | "organization"
  | "customer"
  | "asset"
  | "integration"
  | "model";

export type OntologyTermStatus =
  | "draft"
  | "active"
  | "deprecated"
  | "retired";

export type OntologyRelationType =
  | "is-a"
  | "part-of"
  | "depends-on"
  | "produces"
  | "consumes"
  | "governed-by"
  | "owned-by"
  | "triggers"
  | "implements"
  | "exposes"
  | "derived-from"
  | "related-to"
  | "supersedes";

export type OntologyConstraintOperator =
  | "required"
  | "min"
  | "max"
  | "equals"
  | "contains"
  | "one-of"
  | "pattern"
  | "unique";

export interface OntologyDefinition {
  id: string;
  name: string;
  description: string;
  namespace: string;
  version: string;
  status: OntologyTermStatus;
  ownerIdentityId: string;
  domains: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface OntologyTerm {
  id: string;
  ontologyId: string;
  canonicalName: string;
  displayName: string;
  definition: string;
  termType: OntologyTermType;
  status: OntologyTermStatus;
  aliases: string[];
  attributes: Record<string, unknown>;
  parentTermIds: string[];
  externalReferences: string[];
  createdAt: string;
  updatedAt: string;
}

export interface OntologyRelation {
  id: string;
  ontologyId: string;
  fromTermId: string;
  toTermId: string;
  relation: OntologyRelationType;
  label: string;
  cardinality:
    | "one-to-one"
    | "one-to-many"
    | "many-to-one"
    | "many-to-many";
  transitive: boolean;
  symmetric: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface OntologyConstraint {
  id: string;
  ontologyId: string;
  termId: string;
  field: string;
  operator: OntologyConstraintOperator;
  value?: unknown;
  message: string;
  severity: "info" | "warning" | "error" | "critical";
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OntologyMapping {
  id: string;
  ontologyId: string;
  termId: string;
  sourceSystem: string;
  sourceType: string;
  sourceValue: string;
  targetValue: string;
  confidence: number;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface OntologyValidationFinding {
  id: string;
  ontologyId: string;
  severity: "info" | "warning" | "error" | "critical";
  code:
    | "missing-definition"
    | "duplicate-term"
    | "missing-parent"
    | "invalid-relation"
    | "invalid-constraint"
    | "orphan-term"
    | "circular-inheritance"
    | "namespace-conflict"
    | "version-invalid";
  subjectId: string;
  message: string;
  relatedIds: string[];
  createdAt: string;
}

export interface OntologyVersionRecord {
  id: string;
  ontologyId: string;
  version: string;
  termIds: string[];
  relationIds: string[];
  constraintIds: string[];
  changeSummary: string;
  createdByIdentityId: string;
  createdAt: string;
}

export interface OntologyHealthIndex {
  id: string;
  ontologyId: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    definitionCoverageScore: number;
    relationCoverageScore: number;
    constraintCoverageScore: number;
    mappingCoverageScore: number;
    integrityScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface OntologyAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "ontology"
    | "term"
    | "relation"
    | "constraint"
    | "mapping"
    | "validation"
    | "version"
    | "health";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
