export type FoundationStage =
  | "VISION"
  | "BRAND_IDENTITY"
  | "BRAND_DNA"
  | "DESIGN_SYSTEM"
  | "CONSTITUTIONAL_FOUNDATION"
  | "STRATEGIC_FOUNDATION"
  | "PLATFORM_FOUNDATION"
  | "PRODUCT_ARCHITECTURE"
  | "PRODUCT_DEVELOPMENT";

export type ConformanceStatus =
  | "DRAFT"
  | "UNDER_REVIEW"
  | "CONFORMANT"
  | "NON_CONFORMANT"
  | "BLOCKED";

export interface FoundationEvidence {
  id: string;
  stage: FoundationStage;
  evidenceType:
    | "DOCUMENT"
    | "CODE"
    | "TEST"
    | "REGISTRY"
    | "APPROVAL"
    | "DESIGN_ARTIFACT";
  reference: string;
  verified: boolean;
  verifiedAt?: string;
}

export interface ProductFoundationRegistration {
  id: string;
  productName: string;
  productType:
    | "APPLICATION"
    | "PLATFORM"
    | "INDUSTRY_PACK"
    | "AI_SYSTEM"
    | "MARKETPLACE"
    | "API"
    | "MOBILE_APP"
    | "WEBSITE"
    | "DASHBOARD";
  owner: string;
  currentStage: FoundationStage;
  completedStages: FoundationStage[];
  evidence: FoundationEvidence[];
  status: ConformanceStatus;
  violations: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FoundationGateResult {
  productId: string;
  requestedStage: FoundationStage;
  allowed: boolean;
  missingStages: FoundationStage[];
  unverifiedEvidence: string[];
  violations: string[];
  evaluatedAt: string;
}

export interface FoundationPolicy {
  code: string;
  title: string;
  description: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  mandatory: boolean;
}