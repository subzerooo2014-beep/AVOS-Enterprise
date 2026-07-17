export type DigitalDnaRelationshipsState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DigitalDnaRelationshipsRecord {
  id: string;
  assetType: string;
  assetId: string;
  name: string;
  purpose: string;
  owner: string;
  state: DigitalDnaRelationshipsState;
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

export interface DigitalDnaRelationshipsStatus {
  system: "AVOS Digital DNA";
  layer: "D ig it al Dn aR el at io ns hi ps";
  status: "operational";
  capabilities: string[];
  records: number;
}