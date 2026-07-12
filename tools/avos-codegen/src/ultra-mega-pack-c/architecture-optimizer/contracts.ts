import { UltraCFinding } from "../contracts";

export interface ArchitectureOptimizationNode {
  key: string;
  kind: string;
  dependencies: string[];
  complexity: number;
  maintainability: number;
  resilience: number;
  cost: number;
}

export interface ArchitectureOptimizationInput {
  systemKey: string;
  nodes: ArchitectureOptimizationNode[];
}

export interface ArchitectureOptimizationAction {
  key: string;
  target: string;
  type: string;
  description: string;
  expectedBenefit: number;
  expectedRisk: number;
  controls: string[];
}

export interface ArchitectureOptimizationResult {
  systemKey: string;
  scoreBefore: number;
  scoreAfter: number;
  actions: ArchitectureOptimizationAction[];
  findings: UltraCFinding[];
  optimizedAt: string;
}
