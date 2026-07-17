export type DigitalDnaRegistryState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DigitalDnaRegistryRecord {
  id: string;
  assetType: string;
  assetId: string;
  name: string;
  purpose: string;
  owner: string;
  state: DigitalDnaRegistryState;
  version: string;
  attributes: Record<string, unknown>;
  relations: string[];
  policies: string[];
  permissions: string[];
  events: string[];
  metrics: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export interface DigitalDnaRegistryStatus {
  system: "AVOS Digital DNA";
  layer: "D ig it al Dn aR eg is tr y";
  status: "operational";
  capabilities: string[];
  records: number;
}