export type DesignExperiencePlatformCapability =
  | "EXPERIENCE_GENOME"
  | "DESIGN_CONSTITUTION"
  | "LIVING_STYLE_GUIDE"
  | "BRAND_GUARDIAN_AI"
  | "VISUAL_KNOWLEDGE_BASE"
  | "EXPERIENCE_COMPOSER"
  | "ACCESSIBILITY_GOVERNANCE"
  | "DESIGN_TOKEN_REGISTRY"
  | "UX_QUALITY_GATE"
  | "BRAND_COMPLIANCE";

export interface DesignExperiencePlatformRecord {
  id: string;
  capability: DesignExperiencePlatformCapability;
  status: "READY" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  metadata?: Record<string, unknown>;
}