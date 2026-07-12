import { randomUUID } from "node:crypto";
import {
  UltraJEvidence,
  UltraJFinding,
  UltraJSeverity,
  UltraJStatus,
} from "./contracts";
import {
  AutonomousEnterpriseIntelligence,
  AutonomousEnterpriseIntelligenceResult,
  EnterpriseIntelligenceGoal,
} from "./autonomous-enterprise-intelligence";
import {
  DecisionMeshNode,
  GlobalDecisionMesh,
  GlobalDecisionMeshResult,
} from "./global-decision-mesh";
import {
  ArchitectureCapability,
  SelfDesigningArchitecture,
  SelfDesigningArchitectureResult,
} from "./self-designing-architecture";
import {
  FederatedKnowledgeNode,
  UniversalKnowledgeFabric,
  UniversalKnowledgeFabricResult,
} from "./universal-knowledge-fabric";
import {
  EnterpriseEvolutionSingularity,
  EnterpriseEvolutionSingularityResult,
  EvolutionSingularitySignal,
} from "./evolution-singularity";

export interface EnterpriseIntelligenceOrchestrationInput {
  systemKey: string;
  goals: EnterpriseIntelligenceGoal[];
  decisionNodes: DecisionMeshNode[];
  architectureCapabilities: ArchitectureCapability[];
  knowledgeNodes: FederatedKnowledgeNode[];
  evolutionSignals: EvolutionSingularitySignal[];
}

export interface EnterpriseIntelligenceOrchestrationResult {
  success: boolean;
  status: UltraJStatus;
  score: number;
  intelligence: AutonomousEnterpriseIntelligenceResult;
  decisionMesh: GlobalDecisionMeshResult;
  architecture: SelfDesigningArchitectureResult;
  knowledgeFabric: UniversalKnowledgeFabricResult;
  evolutionSingularity: EnterpriseEvolutionSingularityResult;
  findings: UltraJFinding[];
  evidence: UltraJEvidence[];
  completedAt: string;
}

export class EnterpriseIntelligenceOrchestratorV7 {
  constructor(
    readonly intelligence = new AutonomousEnterpriseIntelligence(),
    readonly decisionMesh = new GlobalDecisionMesh(),
    readonly architecture = new SelfDesigningArchitecture(),
    readonly knowledgeFabric = new UniversalKnowledgeFabric(),
    readonly evolutionSingularity = new EnterpriseEvolutionSingularity(),
  ) {}

  execute(
    input: EnterpriseIntelligenceOrchestrationInput,
  ): EnterpriseIntelligenceOrchestrationResult {
    const intelligence = this.intelligence.reason(input.goals);
    const decisionMesh = this.decisionMesh.decide(input.decisionNodes);
    const architecture = this.architecture.design(
      input.architectureCapabilities,
    );
    const knowledgeFabric = this.knowledgeFabric.federate(
      input.knowledgeNodes,
    );
    const evolutionSingularity = this.evolutionSingularity.evolve(
      input.evolutionSignals,
    );

    const findings: UltraJFinding[] = [
      ...intelligence.findings,
      ...evolutionSingularity.findings,
    ];

    if (decisionMesh.decision === "reject") {
      findings.push({
        code: "GLOBAL_DECISION_MESH_REJECTED",
        severity: UltraJSeverity.ERROR,
        message: "Global decision mesh rejected the enterprise action.",
        metadata: {
          consensus: decisionMesh.consensus,
          dissentingNodes: decisionMesh.dissentingNodes,
        },
      });
    }

    if (knowledgeFabric.nodes > 1 && knowledgeFabric.links.length === 0) {
      findings.push({
        code: "KNOWLEDGE_FABRIC_DISCONNECTED",
        severity: UltraJSeverity.ERROR,
        message: "Universal knowledge fabric contains disconnected domains.",
        metadata: { domains: knowledgeFabric.domains },
      });
    }

    const decisionScore =
      decisionMesh.decision === "reject"
        ? 20
        : decisionMesh.decision === "review"
          ? 60
          : Math.max(70, decisionMesh.consensus);

    const score = Math.round(
      (
        intelligence.intelligenceScore +
        decisionScore +
        architecture.architectureScore +
        knowledgeFabric.federationScore +
        Math.round(
          (evolutionSingularity.maturityScore +
            evolutionSingularity.autonomyScore) /
            2,
        )
      ) / 5,
    );

    const hasCritical = findings.some(
      (finding) => finding.severity === UltraJSeverity.CRITICAL,
    );
    const hasErrors = findings.some(
      (finding) => finding.severity === UltraJSeverity.ERROR,
    );

    const status = hasCritical
      ? UltraJStatus.BLOCKED
      : hasErrors || score < 65
        ? UltraJStatus.DEGRADED
        : UltraJStatus.READY;

    const success = status === UltraJStatus.READY;

    const evidence: UltraJEvidence[] = [
      {
        id: randomUUID(),
        systemKey: input.systemKey,
        category: "enterprise-intelligence-orchestrator-v7",
        action: "intelligence-orchestration.completed",
        message: `Enterprise intelligence orchestration completed with status ${status}.`,
        metadata: {
          score,
          intelligenceScore: intelligence.intelligenceScore,
          decision: decisionMesh.decision,
          architectureComponents: architecture.components.length,
          knowledgeLinks: knowledgeFabric.links.length,
          maturityScore: evolutionSingularity.maturityScore,
          autonomyScore: evolutionSingularity.autonomyScore,
        },
        createdAt: new Date().toISOString(),
      },
    ];

    return {
      success,
      status,
      score,
      intelligence,
      decisionMesh,
      architecture,
      knowledgeFabric,
      evolutionSingularity,
      findings,
      evidence,
      completedAt: new Date().toISOString(),
    };
  }
}
