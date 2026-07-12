export type GenesisV3Primitive = string | number | boolean | null;
export type GenesisV3Value =
  | GenesisV3Primitive
  | GenesisV3Value[]
  | { [key: string]: GenesisV3Value };

export enum GenesisV3Status {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export enum GenesisV3ArtifactKind {
  BACKEND = "backend",
  PRISMA = "prisma",
  FRONTEND = "frontend",
  DOCKER = "docker",
  CI = "ci",
  CONFIG = "config",
  DOCUMENTATION = "documentation",
  REGISTRATION = "registration",
  TEST = "test",
}

export interface GenesisV3Domain {
  key: string;
  entityName: string;
  fields: Array<{
    name: string;
    type: "string" | "number" | "boolean" | "date";
    required: boolean;
    unique?: boolean;
  }>;
}

export interface GenesisV3Specification {
  systemKey: string;
  systemName: string;
  description: string;
  domains: GenesisV3Domain[];
  frontend: {
    enabled: boolean;
    title: string;
  };
  database: {
    provider: "postgresql" | "mysql" | "sqlite";
  };
  docker: boolean;
  ci: boolean;
}

export interface GenesisV3Artifact {
  relativePath: string;
  kind: GenesisV3ArtifactKind;
  content: string;
  hash: string;
  metadata: Record<string, GenesisV3Value>;
}
