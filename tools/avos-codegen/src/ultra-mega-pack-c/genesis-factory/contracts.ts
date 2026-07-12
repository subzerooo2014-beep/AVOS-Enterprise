import {
  UltraCDecision,
  UltraCEvidence,
  UltraCFinding,
} from "../contracts";
import { EnterpriseDesign } from "../enterprise-designer";
import { ArchitectureOptimizationResult } from "../architecture-optimizer";
import { IntegrationFabricPlan } from "../integration-fabric";
import { KnowledgeEvolutionResult } from "../knowledge-evolution";

export interface GenesisFactoryInput {
  systemKey: string;
  design: EnterpriseDesign;
  optimization: ArchitectureOptimizationResult;
  integration: IntegrationFabricPlan;
  knowledge: KnowledgeEvolutionResult;
}

export interface GenesisFactoryResult {
  success: boolean;
  decision: UltraCDecision;
  score: number;
  controls: string[];
  findings: UltraCFinding[];
  evidence: UltraCEvidence[];
  completedAt: string;
}
