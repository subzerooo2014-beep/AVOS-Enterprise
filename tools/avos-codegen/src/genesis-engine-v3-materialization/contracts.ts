export type GenesisV3MaterializationPrimitive =
  | string
  | number
  | boolean
  | null;

export type GenesisV3MaterializationValue =
  | GenesisV3MaterializationPrimitive
  | GenesisV3MaterializationValue[]
  | { [key: string]: GenesisV3MaterializationValue };

export enum GenesisV3MaterializationStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface GenesisV3MaterializationArtifact {
  relativePath: string;
  content: string;
  hash: string;
  overwrite: boolean;
}

export interface GenesisV3MaterializationOperation {
  relativePath: string;
  absolutePath: string;
  action: "create" | "overwrite" | "skip";
  success: boolean;
  verified: boolean;
  previousHash: string | null;
  currentHash: string | null;
}

export interface GenesisV3RollbackEntry {
  relativePath: string;
  action: "delete-created" | "restore-overwritten";
  previousContent: string | null;
  previousHash: string | null;
}
