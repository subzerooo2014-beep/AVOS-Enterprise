export type CoreFoundationStackCapability =
  | "VISION_FOUNDATION"
  | "BRAND_FOUNDATION"
  | "CONSTITUTION_FOUNDATION"
  | "STRATEGY_FOUNDATION"
  | "PLATFORM_FOUNDATION"
  | "PRODUCT_ARCHITECTURE_FOUNDATION"
  | "PRODUCT_DEVELOPMENT_FOUNDATION"
  | "FOUNDATION_REGISTRY"
  | "FOUNDATION_EVIDENCE"
  | "FOUNDATION_GOVERNANCE";

export interface CoreFoundationStackRecord {
  id: string;
  capability: CoreFoundationStackCapability;
  status: "READY" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  metadata?: Record<string, unknown>;
}