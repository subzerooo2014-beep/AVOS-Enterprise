export type GenesisStatus = "DRAFT" | "ACTIVE" | "COMPLETED" | "FAILED";

export interface GenesisArtifact {
  id: string;
  type: string;
  name: string;
  path: string;
  status: GenesisStatus;
  metadata: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
}

export interface GenesisExecution {
  id: string;
  action: string;
  payload: Record<string, unknown>;
  status: GenesisStatus;
  result: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}