export type ProductFactoryStage =
  | "product-blueprint"
  | "architecture-composition"
  | "capability-assembly"
  | "experience-composition"
  | "data-contracts"
  | "security-governance"
  | "digital-dna"
  | "knowledge-registration"
  | "genesis-integration"
  | "quality-certification"
  | "launch-readiness"
  | "human-approval"
  | "completed";

export interface ProductFactoryRequest {
  productName: string;
  productType:
    | "web-platform"
    | "mobile-application"
    | "api-platform"
    | "enterprise-product"
    | "multi-channel-product";
  version?: string;
  description?: string;
  capabilities: string[];
  channels?: string[];
  targetEnvironment?: "development" | "staging" | "production";
  approvedBy: string;
  blueprint?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface ProductFactoryStageResult {
  stage: ProductFactoryStage;
  status: "completed" | "blocked";
  score: number;
  details: Record<string, unknown>;
}

export interface ProductFactoryResult {
  success: boolean;
  productId: string;
  productName: string;
  productType: ProductFactoryRequest["productType"];
  version: string;
  architectureId: string;
  digitalDnaId: string;
  releaseCandidateId: string;
  stages: ProductFactoryStageResult[];
  overallScore: number;
  humanFinalAuthority: true;
  completedAt: string;
}
