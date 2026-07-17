export type DigitalDnaCertificationState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DigitalDnaCertificationRecord {
  id: string;
  assetType: string;
  assetId: string;
  name: string;
  purpose: string;
  owner: string;
  state: DigitalDnaCertificationState;
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

export interface DigitalDnaCertificationStatus {
  system: "AVOS Digital DNA";
  layer: "D ig it al Dn aC er ti fi ca ti on";
  status: "operational";
  capabilities: string[];
  records: number;
}