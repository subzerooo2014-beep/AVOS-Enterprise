export type FactoryArtifactType =
  | "source"
  | "configuration"
  | "schema"
  | "documentation"
  | "test"
  | "build"
  | "package"
  | "metadata";

export interface FactoryProject {
  id: string;
  name: string;
  slug: string;
  objective: string;
  status: "draft" | "active" | "archived";
  rootPath: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface FactoryArtifact {
  id: string;
  projectId: string;
  type: FactoryArtifactType;
  relativePath: string;
  content: string;
  checksum: string;
  version: number;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface FactoryTemplate {
  id: string;
  name: string;
  category: string;
  language: string;
  content: string;
  variables: string[];
  version: string;
  enabled: boolean;
  metadata: Record<string, unknown>;
}

export interface FactoryGeneratorDescriptor {
  id: string;
  name: string;
  version: string;
  artifactTypes: FactoryArtifactType[];
  languages: string[];
  enabled: boolean;
  metadata: Record<string, unknown>;
}

export interface FactoryCompilerDescriptor {
  id: string;
  name: string;
  version: string;
  inputFormats: string[];
  outputFormats: string[];
  enabled: boolean;
  metadata: Record<string, unknown>;
}

export interface FactorySnapshot {
  id: string;
  projectId: string;
  label: string;
  artifactIds: string[];
  createdAt: string;
  metadata: Record<string, unknown>;
}
