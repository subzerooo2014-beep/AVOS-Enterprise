export type GenomeStatus =
  | "draft"
  | "active"
  | "superseded"
  | "retired";

export type GenomeLayer =
  | "architecture"
  | "capabilities"
  | "security"
  | "governance"
  | "ai"
  | "integrations"
  | "products"
  | "ecosystem"
  | "evolution";

export interface GenomeDnaReference {
  dnaId: string;
  assetType: string;
  version: string;
  identityId: string;
  ownerIdentityId: string;
  status: string;
  checksum: string;
  layer: GenomeLayer;
}

export interface GenomeLayerComposition {
  layer: GenomeLayer;
  dnaReferences: GenomeDnaReference[];
  weight: number;
  completenessScore: number;
  healthScore: number;
}

export interface EnterpriseDigitalGenome {
  id: string;
  name: string;
  description: string;
  version: string;
  status: GenomeStatus;
  organizationIdentityId: string;
  layers: GenomeLayerComposition[];
  crossLayerRelations: Array<{
    fromDnaId: string;
    toDnaId: string;
    relation: string;
    criticality: "low" | "medium" | "high" | "critical";
  }>;
  metadata: Record<string, unknown>;
  checksum: string;
  createdAt: string;
  updatedAt: string;
}

export interface GenomeSnapshot {
  id: string;
  genomeId: string;
  version: string;
  snapshot: EnterpriseDigitalGenome;
  createdByIdentityId: string;
  reason: string;
  createdAt: string;
}

export interface GenomeComparisonResult {
  id: string;
  genomeId: string;
  fromVersion: string;
  toVersion: string;
  addedDnaIds: string[];
  removedDnaIds: string[];
  changedDnaIds: string[];
  addedRelations: string[];
  removedRelations: string[];
  breakingChanges: string[];
  comparedAt: string;
}

export interface GenomeEvolutionRecord {
  id: string;
  genomeId: string;
  fromVersion: string;
  toVersion: string;
  changeSummary: string;
  affectedLayers: GenomeLayer[];
  compatibility:
    | "compatible"
    | "conditionally-compatible"
    | "breaking";
  approvedByIdentityId?: string;
  evolvedByIdentityId: string;
  evolvedAt: string;
}

export interface GenomeValidationFinding {
  id: string;
  genomeId: string;
  severity: "info" | "warning" | "error" | "critical";
  code:
    | "missing-layer"
    | "duplicate-dna"
    | "missing-dna-reference"
    | "invalid-cross-layer-relation"
    | "checksum-mismatch"
    | "incomplete-layer"
    | "unbalanced-composition"
    | "version-invalid";
  message: string;
  relatedIds: string[];
  createdAt: string;
}

export interface GenomeHealthIndex {
  id: string;
  genomeId: string;
  score: number;
  level: "critical" | "degraded" | "stable" | "healthy" | "excellent";
  metrics: {
    layerCompletenessScore: number;
    dnaCoverageScore: number;
    relationIntegrityScore: number;
    balanceScore: number;
    evolutionReadinessScore: number;
  };
  reasons: string[];
  calculatedAt: string;
}

export interface GenomeAuditRecord {
  id: string;
  correlationId: string;
  category:
    | "genome"
    | "composition"
    | "snapshot"
    | "comparison"
    | "evolution"
    | "validation"
    | "health";
  action: string;
  subjectId: string;
  actorIdentityId: string;
  outcome: "success" | "failure" | "warning" | "blocked";
  metadata: Record<string, unknown>;
  occurredAt: string;
}
