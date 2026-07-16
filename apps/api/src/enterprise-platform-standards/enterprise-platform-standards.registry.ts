import { EnterprisePlatformStandardsCapability } from "./enterprise-platform-standards.types";

export const ENTERPRISE_PLATFORM_STANDARDS_CAPABILITIES: Readonly<Record<EnterprisePlatformStandardsCapability, string>> = {
  PLUGIN_MANIFEST_STANDARD: "Plugin Manifest Standard",
  VERSION_COMPATIBILITY_LAYER: "Version Compatibility Layer",
  EVENT_SCHEMA_REGISTRY: "Event Schema Registry",
  PERMISSION_GRAPH: "Permission Graph",
  DATA_LINEAGE: "Data Lineage",
  WORKFLOW_VERSIONING: "Workflow Versioning",
  POLICY_AS_CODE: "Policy As Code",
  AI_GUARDRAILS_FRAMEWORK: "Ai Guardrails Framework",
  SECRETS_KEY_ROTATION: "Secrets Key Rotation",
  PLATFORM_STANDARDS_EVIDENCE: "Platform Standards Evidence",
};