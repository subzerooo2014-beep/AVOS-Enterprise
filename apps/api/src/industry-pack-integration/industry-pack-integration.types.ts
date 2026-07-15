export type IndustryPackStatus =
  | "DISCOVERED"
  | "VALIDATED"
  | "REGISTERED"
  | "MIGRATED"
  | "FAILED";

export interface IndustryPackDescriptor {
  id: string;
  code: string;
  name: string;
  sourceModule: string;
  sourcePath: string;
  industryCount: number;
  capabilities: string[];
  version: string;
  status: IndustryPackStatus;
  compatibilityScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface IndustryPackAdapter {
  id: string;
  packCode: string;
  adapterType: "DIRECT" | "SHARED_RUNTIME" | "LEGACY_BRIDGE";
  sourceCapabilities: string[];
  targetCapabilities: string[];
  mappings: Record<string, string>;
  status: "DRAFT" | "ACTIVE" | "DISABLED";
  createdAt: string;
  updatedAt: string;
}

export interface IndustryMigrationExecution {
  id: string;
  packCode: string;
  targetCoreVersion: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  migratedIndustries: number;
  migratedCapabilities: number;
  warnings: string[];
  errors: string[];
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IndustryCompatibilityResult {
  packCode: string;
  modulePresent: boolean;
  registryPresent: boolean;
  servicePresent: boolean;
  controllerPresent: boolean;
  webPresent: boolean;
  mobilePresent: boolean;
  testsPresent: boolean;
  score: number;
  issues: string[];
}