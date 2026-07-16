export type UniversalDataFabricCapability =
  | "MASTER_DATA_HUB"
  | "UNIVERSAL_CUSTOMER_360"
  | "UNIVERSAL_ASSET_REGISTRY"
  | "ENTERPRISE_DATA_FABRIC"
  | "ENTERPRISE_SEARCH_FABRIC"
  | "DATA_LINEAGE"
  | "DATA_QUALITY"
  | "SCHEMA_FEDERATION"
  | "REAL_TIME_DATA_MESH"
  | "DATA_GOVERNANCE";

export interface UniversalDataFabricRecord {
  id: string;
  capability: UniversalDataFabricCapability;
  status: "READY" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  metadata?: Record<string, unknown>;
}