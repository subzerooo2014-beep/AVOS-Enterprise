import { randomUUID } from "node:crypto";
import {
  UltraHEvidence,
  UltraHFinding,
  UltraHSeverity,
  UltraHStatus,
} from "./contracts";
import {
  CommandCenterMetric,
  EnterpriseCommandCenter,
  EnterpriseCommandCenterResult,
} from "./enterprise-command-center";
import {
  OperationalForecast,
  PredictiveOperationsEngine,
  PredictiveOperationsResult,
  PredictiveSignal,
} from "./predictive-operations";
import {
  AutonomousResourceAllocator,
  ResourceAllocationResult,
  ResourceDemand,
  ResourcePool,
} from "./resource-allocation";
import {
  StrategicAgentCouncil,
  StrategicAgentVote,
  StrategicCouncilDecision,
} from "./strategic-agent-council";
import {
  ControlPlaneCommand,
  UniversalControlPlaneResult,
  UniversalEnterpriseControlPlane,
} from "./universal-control-plane";

export interface EnterpriseControlOrchestrationInput {
  systemKey: string;
  commandCenterMetrics: CommandCenterMetric[];
  predictiveSignals: PredictiveSignal[];
  resourcePools: ResourcePool[];
  resourceDemands: ResourceDemand[];
  councilVotes: StrategicAgentVote[];
  controlCommands: ControlPlaneCommand[];
}

export interface EnterpriseControlOrchestrationResult {
  success: boolean;
  status: UltraHStatus;
  score: number;
  commandCenter: EnterpriseCommandCenterResult;
  predictive: PredictiveOperationsResult;
  resources: ResourceAllocationResult;
  council: StrategicCouncilDecision;
  controlPlane: UniversalControlPlaneResult;
  findings: UltraHFinding[];
  evidence: UltraHEvidence[];
  completedAt: string;
}

export class EnterpriseControlOrchestratorV5 {
  constructor(
    readonly commandCenter = new EnterpriseCommandCenter(),
    readonly predictive = new PredictiveOperationsEngine(),
    readonly resources = new AutonomousResourceAllocator(),
    readonly council = new StrategicAgentCouncil(),
    readonly controlPlane = new UniversalEnterpriseControlPlane(),
  ) {}

  execute(
    input: EnterpriseControlOrchestrationInput,
  ): EnterpriseControlOrchestrationResult {
    const commandCenter = this.commandCenter.evaluate(
      input.systemKey,
      input.commandCenterMetrics,
    );
    const predictive = this.predictive.forecast(input.predictiveSignals);
    const resources = this.resources.allocate(
      input.resourcePools,
      input.resourceDemands,
    );
    const council = this.council.decide(input.councilVotes);
    const controlPlane = this.controlPlane.route(
      input.systemKey,
      input.controlCommands,
    );

    const findings: UltraHFinding[] = [...predictive.findings];

    const unsatisfiedResources = resources.allocations.filter(
      (allocation) => !allocation.fullySatisfied,
    );

    if (unsatisfiedResources.length > 0) {
      findings.push({
        code: "RESOURCE_DEMAND_UNSATISFIED",
        severity: UltraHSeverity.WARNING,
        message: "One or more resource demands were not fully satisfied.",
        metadata: {
          demandKeys: unsatisfiedResources.map((item) => item.demandKey),
        },
      });
    }

    if (council.decision === "reject") {
      findings.push({
        code: "STRATEGIC_COUNCIL_REJECTED",
        severity: UltraHSeverity.ERROR,
        message: "Strategic agent council rejected the proposed action.",
        metadata: {
          consensusScore: council.consensusScore,
          dissentingAgents: council.dissentingAgents,
        },
      });
    }

    if (council.consensusScore < 50) {
      findings.push({
        code: "STRATEGIC_COUNCIL_LOW_CONSENSUS",
        severity: UltraHSeverity.WARNING,
        message: "Strategic agent council consensus is below 50 percent.",
        metadata: { consensusScore: council.consensusScore },
      });
    }

    const interventionForecasts = predictive.forecasts.filter(
      (forecast: OperationalForecast) => forecast.interventionRequired,
    ).length;

    const resourceScore =
      resources.allocations.length === 0
        ? 100
        : Math.round(
            (resources.allocations.filter((item) => item.fullySatisfied).length /
              resources.allocations.length) *
              100,
          );

    const predictiveScore =
      predictive.forecasts.length === 0
        ? 100
        : Math.max(
            0,
            100 - Math.round((interventionForecasts / predictive.forecasts.length) * 50),
          );

    const councilScore =
      council.decision === "reject"
        ? 20
        : council.decision === "review"
          ? 60
          : council.consensusScore;

    const routingScore =
      input.controlCommands.length === 0
        ? 100
        : Math.round(
            (controlPlane.routedCommands.filter((item) => item.status === "routed").length /
              input.controlCommands.length) *
              100,
          );

    const score = Math.round(
      (
        commandCenter.enterpriseScore +
        predictiveScore +
        resourceScore +
        councilScore +
        routingScore
      ) / 5,
    );

    const hasCritical = findings.some(
      (finding) => finding.severity === UltraHSeverity.CRITICAL,
    );
    const hasErrors = findings.some(
      (finding) => finding.severity === UltraHSeverity.ERROR,
    );

    const status = hasCritical
      ? UltraHStatus.BLOCKED
      : hasErrors || score < 65
        ? UltraHStatus.DEGRADED
        : UltraHStatus.READY;

    const success = status === UltraHStatus.READY;

    const evidence: UltraHEvidence[] = [
      ...commandCenter.evidence,
      ...controlPlane.evidence,
      {
        id: randomUUID(),
        systemKey: input.systemKey,
        category: "enterprise-control-orchestrator-v5",
        action: "control-orchestration.completed",
        message: `Enterprise control orchestration completed with status ${status}.`,
        metadata: {
          score,
          enterpriseScore: commandCenter.enterpriseScore,
          predictiveInterventions: interventionForecasts,
          resourceScore,
          councilDecision: council.decision,
          councilConsensus: council.consensusScore,
          routedCommands: controlPlane.routedCommands.length,
        },
        createdAt: new Date().toISOString(),
      },
    ];

    return {
      success,
      status,
      score,
      commandCenter,
      predictive,
      resources,
      council,
      controlPlane,
      findings,
      evidence,
      completedAt: new Date().toISOString(),
    };
  }
}
