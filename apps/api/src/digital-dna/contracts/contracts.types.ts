export type DigitalDnaContractsState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DigitalDnaContractsRecord {
  id: string;
  assetType: string;
  assetId: string;
  name: string;
  purpose: string;
  owner: string;
  state: DigitalDnaContractsState;
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

export interface DigitalDnaContractsStatus {
  system: "AVOS Digital DNA";
  layer: "D ig it al Dn aC on tr ac ts";
  status: "operational";
  capabilities: string[];
  records: number;
}