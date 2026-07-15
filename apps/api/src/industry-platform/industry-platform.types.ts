export type IndustryStatus = "ACTIVE" | "SUSPENDED" | "RETIRED";

export interface IndustryDefinition {
  key: string;
  name: string;
  status: IndustryStatus;
  sharedCapabilities: string[];
  specializedCapabilities: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface SharedCapabilityDefinition {
  key: string;
  name: string;
  domain:
    | "COMMERCE"
    | "RENTAL"
    | "MAINTENANCE"
    | "PARTS"
    | "FINANCE"
    | "INSURANCE"
    | "LOGISTICS"
    | "INSPECTION"
    | "DEALERSHIP"
    | "MARKETPLACE";
  reusable: boolean;
  version: string;
  status: "ACTIVE" | "DEPRECATED";
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface IndustryCapabilityBinding {
  id: string;
  industryKey: string;
  capabilityKey: string;
  enabled: boolean;
  configuration: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface IndustryOperationRequest {
  industryKey: string;
  capabilityKey: string;
  tenantId: string;
  actorId: string;
  action: string;
  payload?: Record<string, unknown>;
}

export interface IndustryOperationResult {
  id: string;
  industryKey: string;
  capabilityKey: string;
  tenantId: string;
  actorId: string;
  action: string;
  success: boolean;
  status: "COMPLETED";
  createdAt: string;
  output: Record<string, unknown>;
}