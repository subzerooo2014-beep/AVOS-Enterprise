export type GenesisPipelinePrimitive = string | number | boolean | null;
export type GenesisPipelineValue =
  | GenesisPipelinePrimitive
  | GenesisPipelineValue[]
  | { [key: string]: GenesisPipelineValue };

export enum GenesisPipelineStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export enum GenesisPipelineStage {
  BLUEPRINT = "blueprint",
  GENERATION = "generation",
  WORKSPACE = "workspace",
  VALIDATION = "validation",
  RELEASE = "release",
}

export interface GenesisPipelineFinding {
  code: string;
  stage: GenesisPipelineStage;
  message: string;
  metadata: Record<string, GenesisPipelineValue>;
}

export interface GenesisPipelineEvidence {
  id: string;
  stage: GenesisPipelineStage;
  action: string;
  message: string;
  metadata: Record<string, GenesisPipelineValue>;
  createdAt: string;
}
