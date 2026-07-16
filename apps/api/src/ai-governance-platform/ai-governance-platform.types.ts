export type AiGovernancePlatformCapability =
  | "AI_GOVERNANCE_CENTER"
  | "MODEL_REGISTRY"
  | "FEATURE_STORE"
  | "PROMPT_REGISTRY"
  | "AI_EVALUATION_PLATFORM"
  | "AI_POLICY_ENFORCEMENT"
  | "RESPONSIBLE_AI_CENTER"
  | "MODEL_RISK_MANAGEMENT"
  | "AI_AUDIT_TRAIL"
  | "AI_GUARDRAILS";

export interface AiGovernancePlatformRecord {
  id: string;
  capability: AiGovernancePlatformCapability;
  status: "READY" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  metadata?: Record<string, unknown>;
}