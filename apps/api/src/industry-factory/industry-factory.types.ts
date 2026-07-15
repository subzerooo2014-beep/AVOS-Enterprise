export type IndustryBlueprintStatus =
  | "DRAFT"
  | "VALIDATED"
  | "PUBLISHED"
  | "DEPRECATED";

export interface IndustryBlueprint {
  id: string;
  code: string;
  name: string;
  description: string;
  version: string;
  targetCoreVersion: string;
  capabilities: string[];
  entities: string[];
  workflows: string[];
  integrations: string[];
  uiModules: string[];
  status: IndustryBlueprintStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IndustryGenerationJob {
  id: string;
  blueprintId: string;
  namespace: string;
  outputPath: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  generatedFiles: string[];
  warnings: string[];
  errors: string[];
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IndustryValidationResult {
  blueprintId: string;
  schemaValid: boolean;
  capabilitiesValid: boolean;
  namingValid: boolean;
  compatibilityValid: boolean;
  score: number;
  issues: string[];
  validatedAt: string;
}

export interface IndustryInstallation {
  id: string;
  generationJobId: string;
  blueprintId: string;
  targetEnvironment: "DEVELOPMENT" | "STAGING" | "PRODUCTION";
  status: "PENDING" | "INSTALLED" | "ROLLED_BACK" | "FAILED";
  installedFiles: string[];
  rollbackFiles: string[];
  installedAt?: string;
  rolledBackAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IndustryMarketplaceEntry {
  id: string;
  blueprintId: string;
  publisher: string;
  visibility: "PRIVATE" | "PARTNER" | "PUBLIC";
  status: "DRAFT" | "REVIEW" | "PUBLISHED" | "REJECTED";
  rating: number;
  installs: number;
  createdAt: string;
  updatedAt: string;
}