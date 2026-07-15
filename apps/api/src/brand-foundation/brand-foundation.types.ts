export type BrandPersonalityTrait =
  | "PREMIUM"
  | "AI_FIRST"
  | "GLOBAL"
  | "TRUSTED"
  | "INTELLIGENT"
  | "SCALABLE";

export type FoundationLayer =
  | "VISION"
  | "BRAND_IDENTITY"
  | "BRAND_DNA"
  | "DESIGN_SYSTEM"
  | "CONSTITUTIONAL_FOUNDATION"
  | "STRATEGIC_FOUNDATION"
  | "PLATFORM_FOUNDATION"
  | "PRODUCT_ARCHITECTURE"
  | "PRODUCT_DEVELOPMENT";

export interface AvosBrandIdentity {
  brandName: "AVOS Enterprise";
  officialTagline: "The Operating System for Mobility";
  officialLogo: "AV Wing Motion";
  personality: BrandPersonalityTrait[];
}

export interface AvosBrandDna {
  principles: string[];
  experienceAttributes: string[];
  productBehavior: string[];
}

export interface AvosDesignSystem {
  required: boolean;
  tokens: string[];
  standards: string[];
  accessibilityRequired: boolean;
  responsiveRequired: boolean;
}

export interface AvosCoreFoundation {
  version: string;
  status: "OFFICIAL";
  mandatoryOrder: FoundationLayer[];
  brandIdentity: AvosBrandIdentity;
  brandDna: AvosBrandDna;
  designSystem: AvosDesignSystem;
  appliesTo: string[];
  governanceRules: string[];
  qualityGates: string[];
}