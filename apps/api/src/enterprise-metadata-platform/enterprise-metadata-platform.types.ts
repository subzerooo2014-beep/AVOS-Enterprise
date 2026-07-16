export type EnterpriseMetadataPlatformCapability =
  | "ENTERPRISE_METADATA_PLATFORM"
  | "ENTERPRISE_DATA_DICTIONARY"
  | "GLOBAL_ID"
  | "METADATA_FIRST_ARCHITECTURE"
  | "CENTRAL_CONFIGURATION"
  | "ABSTRACTION_LAYER"
  | "SCHEMA_REGISTRY"
  | "METADATA_LINEAGE"
  | "SEMANTIC_CATALOG"
  | "METADATA_GOVERNANCE";

export interface EnterpriseMetadataPlatformRecord {
  id: string;
  capability: EnterpriseMetadataPlatformCapability;
  status: "READY" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  metadata?: Record<string, unknown>;
}