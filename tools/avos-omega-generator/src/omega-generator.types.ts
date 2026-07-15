export type OmegaArtifactType =
  | "module"
  | "controller"
  | "service"
  | "types"
  | "test"
  | "manifest";

export interface OmegaCapabilityBlueprint {
  capability: string;
  domain: string;
  route: string;
  actions: string[];
  metadata?: Record<string, unknown>;
}

export interface OmegaBundleBlueprint {
  bundle: string;
  namespace: string;
  targetRoot: string;
  capabilities: OmegaCapabilityBlueprint[];
}

export interface OmegaGeneratedArtifact {
  type: OmegaArtifactType;
  path: string;
  capability?: string;
}

export interface OmegaGenerationResult {
  bundle: string;
  namespace: string;
  targetRoot: string;
  capabilities: number;
  artifacts: OmegaGeneratedArtifact[];
  generatedAt: string;
}