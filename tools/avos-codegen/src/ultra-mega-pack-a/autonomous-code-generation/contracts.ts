import {
  UltraFinding,
  UltraValue,
} from "../contracts";

export enum AutonomousArtifactKind {
  MODULE = "module",
  SERVICE = "service",
  CONTROLLER = "controller",
  DTO = "dto",
  MODEL = "model",
  TEST = "test",
  DOCUMENTATION = "documentation",
  CONFIGURATION = "configuration",
}

export interface AutonomousGenerationRequirement {
  key: string;
  description: string;
  required: boolean;
  priority: number;
  dependencies: string[];
  metadata: Record<string, UltraValue>;
}

export interface AutonomousGenerationRequest {
  id: string;
  systemKey: string;
  targetRoot: string;
  requirements: AutonomousGenerationRequirement[];
  variables: Record<string, UltraValue>;
  dryRun: boolean;
  createdAt: string;
}

export interface AutonomousGeneratedArtifact {
  key: string;
  kind: AutonomousArtifactKind;
  relativePath: string;
  content: string;
  dependencies: string[];
  checksum: string;
  metadata: Record<string, UltraValue>;
}

export interface AutonomousGenerationPlanStep {
  key: string;
  order: number;
  description: string;
  dependencies: string[];
  artifactKinds: AutonomousArtifactKind[];
}

export interface AutonomousGenerationPlan {
  requestId: string;
  steps: AutonomousGenerationPlanStep[];
  generatedAt: string;
}

export interface AutonomousGenerationResult {
  success: boolean;
  request: AutonomousGenerationRequest;
  plan: AutonomousGenerationPlan;
  artifacts: AutonomousGeneratedArtifact[];
  findings: UltraFinding[];
  completedAt: string;
}
