export type ArchitectureRegistryFoundationCapability =
  | "CAPABILITY_REGISTRY"
  | "PLATFORM_REGISTRY"
  | "INDUSTRY_REGISTRY"
  | "MODULE_REGISTRY"
  | "SERVICE_REGISTRY"
  | "API_REGISTRY"
  | "EVENT_REGISTRY"
  | "WORKFLOW_REGISTRY"
  | "VERSION_REGISTRY"
  | "ARCHITECTURE_STANDARDS_REGISTRY";

export interface ArchitectureRegistryFoundationRecord {
  id: string;
  capability: ArchitectureRegistryFoundationCapability;
  status: "READY" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  metadata?: Record<string, unknown>;
}