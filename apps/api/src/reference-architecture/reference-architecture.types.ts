export type RegistryKind =
  | "CAPABILITY"
  | "PLATFORM"
  | "INDUSTRY"
  | "MODULE"
  | "SERVICE"
  | "API"
  | "EVENT"
  | "WORKFLOW";

export type ArchitectureLayer =
  | "EXPERIENCE"
  | "APPLICATION"
  | "DOMAIN"
  | "PLATFORM"
  | "DATA"
  | "AI"
  | "INTEGRATION"
  | "SECURITY"
  | "OPERATIONS";

export type RegistrationStatus =
  | "DRAFT"
  | "ACTIVE"
  | "DEPRECATED"
  | "RETIRED";

export interface ArchitectureStandard {
  code: string;
  title: string;
  layer: ArchitectureLayer;
  mandatory: boolean;
  description: string;
}

export interface ArchitectureRegistryEntry {
  id: string;
  registryKind: RegistryKind;
  code: string;
  name: string;
  version: string;
  layer: ArchitectureLayer;
  owner: string;
  description: string;
  dependencies: string[];
  capabilities: string[];
  apiRoutes: string[];
  eventNames: string[];
  status: RegistrationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ArchitectureConformanceResult {
  entryId: string;
  valid: boolean;
  missingFields: string[];
  unknownDependencies: string[];
  duplicateCodes: string[];
  violations: string[];
  evaluatedAt: string;
}