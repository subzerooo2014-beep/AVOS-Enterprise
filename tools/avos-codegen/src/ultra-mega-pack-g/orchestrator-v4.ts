import { randomUUID } from "node:crypto";
import {
  UltraGEvidence,
  UltraGFinding,
  UltraGSeverity,
  UltraGStatus,
} from "./contracts";
import {
  AutonomousOperationsCenter,
  AutonomousOperationsResult,
  OperationalSignal,
} from "./autonomous-operations";
import {
  RuntimeFault,
  SelfHealingResult,
  SelfHealingRuntime,
} from "./self-healing-runtime";
import {
  EnterpriseSimulationEngine,
  EnterpriseSimulationResult,
  SimulationScenario,
} from "./enterprise-simulation";
import {
  AgentCapability,
  AgentCoordinationResult,
  AgentTask,
  MultiAgentCoordinator,
} from "./multi-agent-coordination";
import {
  ContinuousInnovationEngine,
  ContinuousInnovationResult,
  InnovationSignal,
} from "./continuous-innovation";

export interface EnterpriseOperationsOrchestrationInput {
  systemKey: string;
  operationalSignals: OperationalSignal[];
  runtimeFaults: RuntimeFault[];
  simulationScenarios: SimulationScenario[];
  agents: AgentCapability[];
  tasks: AgentTask[];
  innovationSignals: InnovationSignal[];
}

export interface EnterpriseOperationsOrchestrationResult {
  success: boolean;
  status: UltraGStatus;
  score: number;
  operations: AutonomousOperationsResult;
  healing: SelfHealingResult;
  simulation: EnterpriseSimulationResult;
  coordination: AgentCoordinationResult;
  innovation: ContinuousInnovationResult;
  findings: UltraGFinding[];
  evidence: UltraGEvidence[];
  completedAt: string;
}

export class EnterpriseOperationsOrchestratorV4 {
  constructor(
    readonly operations = new AutonomousOperationsCenter(),
    readonly healing = new SelfHealingRuntime(),
    readonly simulation = new EnterpriseSimulationEngine(),
    readonly coordination = new MultiAgentCoordinator(),
    readonly innovation = new ContinuousInnovationEngine(),
  ) {}

  execute(
    input: EnterpriseOperationsOrchestrationInput,
  ): EnterpriseOperationsOrchestrationResult {
    const operations = this.operations.evaluate(
      input.systemKey,
      input.operationalSignals,
    );
    const healing = this.healing.heal(
      input.systemKey,
      input.runtimeFaults,
    );
    const simulation = this.simulation.simulate(
      input.simulationScenarios,
    );
    const coordination = this.coordination.coordinate(
      input.agents,
      input.tasks,
    );
    const innovation = this.innovation.generate(
      input.innovationSignals,
    );

    const findings: UltraGFinding[] = [
      ...healing.findings,
      ...innovation.findings,
    ];

    if (coordination.unassignedTasks.length > 0) {
      findings.push({
        code: "AGENT_TASKS_UNASSIGNED",
        severity: UltraGSeverity.ERROR,
        message: "One or more agent tasks could not be assigned.",
        metadata: {
          unassignedTasks: coordination.unassignedTasks,
        },
      });
    }

    if (!simulation.bestScenarioKey) {
      findings.push({
        code: "SIMULATION_SCENARIO_MISSING",
        severity: UltraGSeverity.WARNING,
        message: "No simulation scenario was available.",
        metadata: {},
      });
    }

    const healingScore =
      input.runtimeFaults.length === 0
        ? 100
        : Math.round(
            (healing.recovered / input.runtimeFaults.length) * 100,
          );

    const coordinationScore =
      input.tasks.length === 0
        ? 100
        : Math.round(
            (coordination.assignments.length / input.tasks.length) * 100,
          );

    const innovationScore =
      innovation.proposals[0]?.priority ?? 70;

    const simulationScore =
      simulation.outcomes.find((outcome) => outcome.recommended)
        ?.resilienceScore ?? 70;

    const score = Math.round(
      (
        operations.healthScore +
        healingScore +
        coordinationScore +
        innovationScore +
        simulationScore
      ) / 5,
    );

    const hasCritical = findings.some(
      (finding) => finding.severity === UltraGSeverity.CRITICAL,
    );
    const hasErrors = findings.some(
      (finding) => finding.severity === UltraGSeverity.ERROR,
    );

    const status = hasCritical
      ? UltraGStatus.BLOCKED
      : hasErrors || score < 65
        ? UltraGStatus.DEGRADED
        : UltraGStatus.READY;

    const success = status === UltraGStatus.READY;

    const evidence: UltraGEvidence[] = [
      ...operations.evidence,
      ...healing.evidence,
      {
        id: randomUUID(),
        systemKey: input.systemKey,
        category: "enterprise-operations-orchestrator-v4",
        action: "orchestration.completed",
        message: `Enterprise operations completed with status ${status}.`,
        metadata: {
          score,
          operationalHealth: operations.healthScore,
          recoveredFaults: healing.recovered,
          bestScenarioKey: simulation.bestScenarioKey,
          assignedTasks: coordination.assignments.length,
          innovationProposals: innovation.proposals.length,
        },
        createdAt: new Date().toISOString(),
      },
    ];

    return {
      success,
      status,
      score,
      operations,
      healing,
      simulation,
      coordination,
      innovation,
      findings,
      evidence,
      completedAt: new Date().toISOString(),
    };
  }
}
