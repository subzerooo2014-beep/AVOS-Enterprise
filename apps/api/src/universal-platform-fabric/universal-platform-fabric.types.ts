export type RegistryStatus = "ACTIVE" | "DEPRECATED" | "BLOCKED";

export interface CapabilityRecord {
  id: string;
  code: string;
  name: string;
  version: string;
  status: RegistryStatus;
  dependencies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CompatibilityResult {
  compatible: boolean;
  score: number;
  reasons: string[];
  migrations: string[];
}
