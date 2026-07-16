export type EnterprisePlatformStandardsCapability =
  | "PLUGIN_MANIFEST_STANDARD"
  | "VERSION_COMPATIBILITY_LAYER"
  | "EVENT_SCHEMA_REGISTRY"
  | "PERMISSION_GRAPH"
  | "DATA_LINEAGE"
  | "WORKFLOW_VERSIONING"
  | "POLICY_AS_CODE"
  | "AI_GUARDRAILS_FRAMEWORK"
  | "SECRETS_KEY_ROTATION"
  | "PLATFORM_STANDARDS_EVIDENCE";

export interface EnterprisePlatformStandardsRecord {
  id: string;
  capability: EnterprisePlatformStandardsCapability;
  status: "READY" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  metadata?: Record<string, unknown>;
}