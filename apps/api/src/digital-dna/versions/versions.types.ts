export type DigitalDnaVersionsState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DigitalDnaVersionsRecord {
  id: string;
  assetType: string;
  assetId: string;
  name: string;
  purpose: string;
  owner: string;
  state: DigitalDnaVersionsState;
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

export interface DigitalDnaVersionsStatus {
  system: "AVOS Digital DNA";
  layer: "D ig it al Dn aV er si on s";
  status: "operational";
  capabilities: string[];
  records: number;
}