import { EnterpriseMetadataPlatformCapability } from "./enterprise-metadata-platform.types";

export const ENTERPRISE_METADATA_PLATFORM_CAPABILITIES: Readonly<Record<EnterpriseMetadataPlatformCapability, string>> = {
  ENTERPRISE_METADATA_PLATFORM: "Enterprise Metadata Platform",
  ENTERPRISE_DATA_DICTIONARY: "Enterprise Data Dictionary",
  GLOBAL_ID: "Global Id",
  METADATA_FIRST_ARCHITECTURE: "Metadata First Architecture",
  CENTRAL_CONFIGURATION: "Central Configuration",
  ABSTRACTION_LAYER: "Abstraction Layer",
  SCHEMA_REGISTRY: "Schema Registry",
  METADATA_LINEAGE: "Metadata Lineage",
  SEMANTIC_CATALOG: "Semantic Catalog",
  METADATA_GOVERNANCE: "Metadata Governance",
};