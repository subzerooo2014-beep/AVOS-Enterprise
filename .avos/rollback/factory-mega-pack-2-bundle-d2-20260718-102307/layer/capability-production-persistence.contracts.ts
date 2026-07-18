export type ProductionRecordStatus =
  | "planned"
  | "materialized"
  | "registered"
  | "failed";

export interface CapabilityProductionBlueprint {
  name: string;
  version: string;
  description: string;
  domain: string;
  approvedBy: string;
}

export interface CapabilityArtifact {
  relativePath: string;
  kind: string;
  checksum: string;
  size: number;
}

export interface CapabilityProductionRecord {
  id: string;
  blueprint: CapabilityProductionBlueprint;
  status: ProductionRecordStatus;
  workspacePath: string;
  artifacts: CapabilityArtifact[];
  humanFinalAuthority: boolean;
  createdAt: string;
  updatedAt: string;
}
