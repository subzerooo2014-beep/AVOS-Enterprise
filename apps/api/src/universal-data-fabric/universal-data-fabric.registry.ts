import { UniversalDataFabricCapability } from "./universal-data-fabric.types";

export const UNIVERSAL_DATA_FABRIC_CAPABILITIES: Readonly<Record<UniversalDataFabricCapability, string>> = {
  MASTER_DATA_HUB: "Master Data Hub",
  UNIVERSAL_CUSTOMER_360: "Universal Customer 360",
  UNIVERSAL_ASSET_REGISTRY: "Universal Asset Registry",
  ENTERPRISE_DATA_FABRIC: "Enterprise Data Fabric",
  ENTERPRISE_SEARCH_FABRIC: "Enterprise Search Fabric",
  DATA_LINEAGE: "Data Lineage",
  DATA_QUALITY: "Data Quality",
  SCHEMA_FEDERATION: "Schema Federation",
  REAL_TIME_DATA_MESH: "Real Time Data Mesh",
  DATA_GOVERNANCE: "Data Governance",
};