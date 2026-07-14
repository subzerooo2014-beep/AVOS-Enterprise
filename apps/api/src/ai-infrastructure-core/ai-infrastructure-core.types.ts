export type AiArtifactStatus = "DRAFT" | "ACTIVE" | "DEPRECATED" | "FAILED";

export interface ModelRecord {
  id: string;
  code: string;
  provider: string;
  version: string;
  status: AiArtifactStatus;
  capabilities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PromptRecord {
  id: string;
  code: string;
  version: string;
  template: string;
  variables: string[];
  status: AiArtifactStatus;
  createdAt: string;
}
