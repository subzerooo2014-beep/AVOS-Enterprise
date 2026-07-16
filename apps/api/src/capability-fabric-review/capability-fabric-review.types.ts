export type ArchitectureReviewSeverity =
  | "INFO"
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export interface ArchitectureReviewFinding {
  id: string;
  category:
    | "STRUCTURE"
    | "DEPENDENCY"
    | "CONTRACT"
    | "GOVERNANCE"
    | "RUNTIME"
    | "INTELLIGENCE"
    | "ENTERPRISE"
    | "DOCUMENTATION"
    | "DUPLICATION"
    | "READINESS";
  severity: ArchitectureReviewSeverity;
  title: string;
  description: string;
  evidence: Record<string, unknown>;
  recommendation: string;
  blocking: boolean;
}

export interface ArchitectureLayerReview {
  layer: "CF-1" | "CF-2" | "CF-3" | "CF-4" | "CF-5";
  module: string;
  present: boolean;
  exportedServices: number;
  publicRoutes: number;
  dependencies: string[];
  score: number;
  findings: ArchitectureReviewFinding[];
}

export interface CapabilityFabricConsolidationDecision {
  id: string;
  type:
    | "KEEP"
    | "MERGE"
    | "STANDARDIZE"
    | "DEPRECATE"
    | "DOCUMENT"
    | "HARDEN";
  target: string;
  rationale: string;
  action: string;
  priority: number;
}

export interface CapabilityFabricReadinessReport {
  system: "AVOS Capability Fabric";
  version: "Foundation V1";
  architectureScore: number;
  foundationFirst: boolean;
  layersReviewed: number;
  blockingFindings: number;
  highFindings: number;
  mediumFindings: number;
  decisions: CapabilityFabricConsolidationDecision[];
  knowledgeFabricReady: boolean;
  readinessReason: string;
  generatedAt: string;
}

export interface CapabilityFabricReviewSnapshot {
  reviews: number;
  findings: number;
  blockingFindings: number;
  decisions: number;
  architectureScore: number;
  knowledgeFabricReady: boolean;
  generatedAt: string;
}