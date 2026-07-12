import { randomUUID } from "node:crypto";
import {
  UltraIEvidence,
  UltraIFinding,
  UltraISeverity,
  UltraIStatus,
} from "./contracts";
import {
  DigitalTwinEntity,
  DigitalTwinScenario,
  EnterpriseDigitalTwin,
  EnterpriseDigitalTwinResult,
} from "./digital-twin";
import {
  AutonomousPolicyNegotiator,
  NegotiablePolicy,
  PolicyNegotiationResult,
} from "./policy-negotiation";
import {
  FabricNode,
  FabricTask,
  GlobalOrchestrationFabric,
  GlobalOrchestrationFabricResult,
} from "./global-orchestration-fabric";
import {
  CognitiveOperationsMemory,
  MemoryRecommendation,
  OperationsMemoryEntry,
} from "./cognitive-operations-memory";
import {
  EnterpriseSingularityCoordinator,
  SingularityCoordinationResult,
  SingularityEngine,
} from "./singularity-coordination";

export interface EnterpriseSingularityOrchestrationInput {
  systemKey: string;
  twinEntities: DigitalTwinEntity[];
  twinScenario?: DigitalTwinScenario;
  policies: NegotiablePolicy[];
  fabricNodes: FabricNode[];
  fabricTasks: FabricTask[];
  memoryEntries: Array<Omit<OperationsMemoryEntry, "id" | "createdAt">>;
  memoryQuery: {
    event: string;
    contextKeys: string[];
  };
  singularityEngines: SingularityEngine[];
}

export interface EnterpriseSingularityOrchestrationResult {
  success: boolean;
  status: UltraIStatus;
  score: number;
  twin: EnterpriseDigitalTwinResult;
  policyNegotiation: PolicyNegotiationResult;
  fabric: GlobalOrchestrationFabricResult;
  memoryRecommendation: MemoryRecommendation | null;
  memorySize: number;
  singularity: SingularityCoordinationResult;
  findings: UltraIFinding[];
  evidence: UltraIEvidence[];
  completedAt: string;
}

export class EnterpriseSingularityOrchestratorV6 {
  constructor(
    readonly twin = new EnterpriseDigitalTwin(),
    readonly negotiator = new AutonomousPolicyNegotiator(),
    readonly fabric = new GlobalOrchestrationFabric(),
    readonly memory = new CognitiveOperationsMemory(),
    readonly singularity = new EnterpriseSingularityCoordinator(),
  ) {}

  execute(
    input: EnterpriseSingularityOrchestrationInput,
  ): EnterpriseSingularityOrchestrationResult {
    const twin = this.twin.synchronize(
      input.systemKey,
      input.twinEntities,
      input.twinScenario,
    );

    const policyNegotiation = this.negotiator.negotiate(input.policies);
    const fabric = this.fabric.route(input.fabricNodes, input.fabricTasks);

    for (const entry of input.memoryEntries) {
      this.memory.remember(entry);
    }

    const memoryRecommendation = this.memory.recommend(
      input.memoryQuery.event,
      input.memoryQuery.contextKeys,
    );

    const singularity = this.singularity.coordinate(
      input.singularityEngines,
    );

    const findings: UltraIFinding[] = [
      ...policyNegotiation.findings,
      ...singularity.findings,
    ];

    if (fabric.unroutedTasks.length > 0) {
      findings.push({
        code: "GLOBAL_FABRIC_TASK_UNROUTED",
        severity: UltraISeverity.ERROR,
        message: "One or more global orchestration tasks were not routed.",
        metadata: { unroutedTasks: fabric.unroutedTasks },
      });
    }

    if (!memoryRecommendation) {
      findings.push({
        code: "COGNITIVE_MEMORY_RECOMMENDATION_MISSING",
        severity: UltraISeverity.WARNING,
        message: "No cognitive operations memory recommendation was available.",
        metadata: {},
      });
    }

    const policyScore = policyNegotiation.agreed
      ? policyNegotiation.confidence
      : 30;

    const fabricScore =
      input.fabricTasks.length === 0
        ? 100
        : Math.round(
            (fabric.routes.length / input.fabricTasks.length) * 100,
          );

    const memoryScore = memoryRecommendation?.similarityScore ?? 40;

    const score = Math.round(
      (
        twin.healthScore +
        policyScore +
        fabricScore +
        memoryScore +
        singularity.readinessScore
      ) / 5,
    );

    const hasCritical = findings.some(
      (finding) => finding.severity === UltraISeverity.CRITICAL,
    );
    const hasErrors = findings.some(
      (finding) => finding.severity === UltraISeverity.ERROR,
    );

    const status = hasCritical
      ? UltraIStatus.BLOCKED
      : hasErrors || score < 65
        ? UltraIStatus.DEGRADED
        : UltraIStatus.READY;

    const success = status === UltraIStatus.READY;

    const evidence: UltraIEvidence[] = [
      ...twin.evidence,
      {
        id: randomUUID(),
        systemKey: input.systemKey,
        category: "enterprise-singularity-orchestrator-v6",
        action: "singularity-orchestration.completed",
        message: `Enterprise singularity orchestration completed with status ${status}.`,
        metadata: {
          score,
          twinHealth: twin.healthScore,
          policyAgreed: policyNegotiation.agreed,
          fabricRoutes: fabric.routes.length,
          memorySize: this.memory.size(),
          singularityReadiness: singularity.readinessScore,
        },
        createdAt: new Date().toISOString(),
      },
    ];

    return {
      success,
      status,
      score,
      twin,
      policyNegotiation,
      fabric,
      memoryRecommendation,
      memorySize: this.memory.size(),
      singularity,
      findings,
      evidence,
      completedAt: new Date().toISOString(),
    };
  }
}
