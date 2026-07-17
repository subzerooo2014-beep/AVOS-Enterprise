export type DigitalDnaMetadataState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DigitalDnaMetadataRecord {
  id: string;
  assetType: string;
  assetId: string;
  name: string;
  purpose: string;
  owner: string;
  state: DigitalDnaMetadataState;
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

export interface DigitalDnaMetadataStatus {
  system: "AVOS Digital DNA";
  layer: "D ig it al Dn aM et ad at a";
  status: "operational";
  capabilities: string[];
  records: number;
}