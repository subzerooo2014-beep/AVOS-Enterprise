export type CanonicalConceptStatus = "active" | "deprecated" | "retired";

export interface CanonicalConcept {
  id: string;
  canonicalName: string;
  displayName: string;
  description: string;
  domain: string;
  category:
    | "foundation"
    | "intelligence"
    | "governance"
    | "runtime"
    | "knowledge"
    | "product"
    | "ecosystem";
  synonyms: string[];
  relatedConceptIds: string[];
  version: string;
  status: CanonicalConceptStatus;
}

export type MetadataSchemaStatus = "active" | "deprecated" | "retired";

export interface MetadataOwnerSet {
  businessOwner: string;
  technicalOwner: string;
  governanceOwner: string;
  aiOwner?: string;
}

export interface MetadataFieldDefinition {
  name: string;
  type: "string" | "number" | "boolean" | "object" | "array" | "date";
  required: boolean;
  deprecated?: boolean;
  description?: string;
}

export interface MetadataSchemaDefinition {
  id: string;
  assetType: string;
  version: string;
  status: MetadataSchemaStatus;
  owners: MetadataOwnerSet;
  fields: MetadataFieldDefinition[];
  previousVersion?: string;
  createdAt: string;
  updatedAt: string;
}

export type ContractStatus = "active" | "deprecated" | "retired";

export interface EnterpriseContract {
  id: string;
  name: string;
  version: string;
  status: ContractStatus;
  ownerIdentityId: string;
  inputSchemaId?: string;
  outputSchemaId?: string;
  eventsProduced: string[];
  eventsConsumed: string[];
  permissions: string[];
  dependencyContractIds: string[];
  backwardCompatible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompatibilityIssue {
  code: string;
  severity: "info" | "warning" | "error";
  message: string;
  field?: string;
}

export interface CompatibilityResult {
  compatible: boolean;
  breakingChanges: number;
  warnings: number;
  issues: CompatibilityIssue[];
}
