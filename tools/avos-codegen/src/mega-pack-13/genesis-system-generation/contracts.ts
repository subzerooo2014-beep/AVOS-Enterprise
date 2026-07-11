export type GenesisJsonPrimitive =
  | string
  | number
  | boolean
  | null;

export type GenesisJsonValue =
  | GenesisJsonPrimitive
  | GenesisJsonValue[]
  | {
      [key: string]: GenesisJsonValue;
    };

export enum GenesisSystemStatus {
  DRAFT = "draft",
  VALIDATING = "validating",
  PLANNED = "planned",
  GENERATING = "generating",
  VERIFYING = "verifying",
  COMPLETED = "completed",
  FAILED = "failed",
  ROLLED_BACK = "rolled_back",
}

export enum GenesisStageKind {
  DISCOVERY = "discovery",
  BLUEPRINT_RESOLUTION = "blueprint_resolution",
  ARCHITECTURE_VALIDATION = "architecture_validation",
  GENERATION = "generation",
  QUALITY_GATE = "quality_gate",
  VERIFICATION = "verification",
  KNOWLEDGE_REGISTRATION = "knowledge_registration",
}

export enum GenesisFindingSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export interface GenesisCapabilityRequirement {
  key: string;
  name: string;
  description: string;
  required: boolean;
  priority: number;
  dependencies: string[];
  metadata: Record<string, GenesisJsonValue>;
}

export interface GenesisBlueprintRequest {
  key: string;
  required: boolean;
  versionRange?: string;
  configuration: Record<string, GenesisJsonValue>;
}

export interface GenesisSystemSpecification {
  id: string;
  key: string;
  name: string;
  description: string;
  version: string;
  status: GenesisSystemStatus;
  objectives: string[];
  capabilities: GenesisCapabilityRequirement[];
  blueprintRequests: GenesisBlueprintRequest[];
  environments: string[];
  metadata: Record<string, GenesisJsonValue>;
  createdAt: string;
  updatedAt: string;
}

export interface GenesisBlueprintDescriptor {
  key: string;
  name: string;
  version: string;
  capabilities: string[];
  dependencies: string[];
  conflicts: string[];
  metadata: Record<string, GenesisJsonValue>;
}

export interface GenesisBlueprintResolution {
  request: GenesisBlueprintRequest;
  success: boolean;
  reasons: string[];
  resolved?: GenesisBlueprintDescriptor;
}

export interface GenesisBlueprintComposition {
  systemId: string;
  successful: boolean;
  resolutions: GenesisBlueprintResolution[];
  selectedBlueprints: GenesisBlueprintDescriptor[];
  capabilityCoverage: Record<string, string[]>;
  generatedAt: string;
}

export interface GenesisCapabilityNode {
  key: string;
  required: boolean;
  dependencies: string[];
  providers: string[];
}

export interface GenesisCapabilityEdge {
  from: string;
  to: string;
}

export interface GenesisCapabilityGraph {
  systemId: string;
  nodes: GenesisCapabilityNode[];
  edges: GenesisCapabilityEdge[];
  cycles: string[][];
  generatedAt: string;
}

export interface GenesisFinding {
  code: string;
  severity: GenesisFindingSeverity;
  message: string;
  subject?: string;
  metadata: Record<string, GenesisJsonValue>;
}

export interface GenesisArchitectureValidation {
  systemId: string;
  valid: boolean;
  score: number;
  findings: GenesisFinding[];
  validatedAt: string;
}

export interface GenesisGenerationStage {
  id: string;
  key: string;
  name: string;
  kind: GenesisStageKind;
  order: number;
  dependencies: string[];
  mandatory: boolean;
  inputs: Record<string, GenesisJsonValue>;
  expectedOutputs: string[];
}

export interface GenesisGenerationPlan {
  systemId: string;
  stages: GenesisGenerationStage[];
  rollbackStages: GenesisGenerationStage[];
  generatedAt: string;
}

export interface GenesisArtifact {
  key: string;
  relativePath: string;
  kind: string;
  content?: string;
  checksum?: string;
  metadata: Record<string, GenesisJsonValue>;
}

export interface GenesisStageResult {
  stageKey: string;
  success: boolean;
  artifacts: GenesisArtifact[];
  findings: GenesisFinding[];
  startedAt: string;
  completedAt: string;
  durationMs: number;
}

export interface GenesisEvidenceEntry {
  id: string;
  systemId: string;
  category: string;
  action: string;
  message: string;
  metadata: Record<string, GenesisJsonValue>;
  createdAt: string;
}

export interface GenesisKnowledgeRecord {
  id: string;
  systemId: string;
  topic: string;
  summary: string;
  facts: Record<string, GenesisJsonValue>;
  createdAt: string;
}

export interface GenesisGenerationResult {
  success: boolean;
  specification: GenesisSystemSpecification;
  composition: GenesisBlueprintComposition;
  graph: GenesisCapabilityGraph;
  validation: GenesisArchitectureValidation;
  plan?: GenesisGenerationPlan;
  stageResults: GenesisStageResult[];
  artifacts: GenesisArtifact[];
  evidence: GenesisEvidenceEntry[];
  knowledge: GenesisKnowledgeRecord[];
  completedAt: string;
}
