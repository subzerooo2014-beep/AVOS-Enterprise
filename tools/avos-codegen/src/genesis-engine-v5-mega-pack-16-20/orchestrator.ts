import { randomUUID } from "node:crypto";
import {
  V5OperationsInput,
  V5OperationsStatus,
} from "./contracts";
import { V5SloGenerator } from "./slo-generator";
import { V5IncidentDetectionGenerator } from "./incident-generator";
import { V5RunbookGenerator } from "./runbook-generator";
import { V5RemediationGenerator } from "./remediation-generator";
import { V5ResilienceGenerator } from "./resilience-generator";
import { V5OperationsEvidenceGenerator } from "./operations-evidence-generator";

export interface V5OperationsRuntimeResult {
  success: boolean;
  status: V5OperationsStatus;
  score: number;
  slos: ReturnType<V5SloGenerator["generate"]>;
  incidentRules: ReturnType<
    V5IncidentDetectionGenerator["generate"]
  >;
  runbooks: ReturnType<V5RunbookGenerator["generate"]>;
  remediations: ReturnType<V5RemediationGenerator["generate"]>;
  capacityDecisions: ReturnType<
    V5ResilienceGenerator["capacity"]
  >;
  rollbackPolicies: ReturnType<
    V5ResilienceGenerator["rollback"]
  >;
  resiliencePolicies: ReturnType<
    V5ResilienceGenerator["policies"]
  >;
  operationalEvidence: ReturnType<
    V5OperationsEvidenceGenerator["evidence"]
  >;
  alertRoutes: ReturnType<
    V5OperationsEvidenceGenerator["alertRoutes"]
  >;
  testPlan: ReturnType<V5OperationsEvidenceGenerator["tests"]>;
  enterpriseBrainPayload: Record<string, unknown>;
  evolutionCenterPayload: Record<string, unknown>;
  evidence: Array<{
    id: string;
    action: string;
    message: string;
    createdAt: string;
  }>;
  completedAt: string;
}

export class GenesisV5OperationsRuntimeOrchestrator {
  constructor(
    readonly sloGenerator = new V5SloGenerator(),
    readonly incidentGenerator =
      new V5IncidentDetectionGenerator(),
    readonly runbookGenerator = new V5RunbookGenerator(),
    readonly remediationGenerator =
      new V5RemediationGenerator(),
    readonly resilienceGenerator = new V5ResilienceGenerator(),
    readonly evidenceGenerator =
      new V5OperationsEvidenceGenerator(),
  ) {}

  execute(
    input: V5OperationsInput,
  ): V5OperationsRuntimeResult {
    const slos = this.sloGenerator.generate(input);
    const incidentRules =
      this.incidentGenerator.generate(input.services);
    const runbooks = this.runbookGenerator.generate(
      input.services,
      incidentRules,
    );
    const remediations =
      this.remediationGenerator.generate(input);
    const capacityDecisions =
      this.resilienceGenerator.capacity(input);
    const rollbackPolicies =
      this.resilienceGenerator.rollback(input);
    const resiliencePolicies =
      this.resilienceGenerator.policies(input);
    const operationalEvidence =
      this.evidenceGenerator.evidence(input.services);
    const alertRoutes = this.evidenceGenerator.alertRoutes();
    const testPlan = this.evidenceGenerator.tests();

    const serviceCoverage =
      input.services.length === 0
        ? 0
        : Math.round(
            (slos.length / input.services.length) * 100,
          );

    const operationsCoverage = [
      incidentRules.length >= input.services.length,
      runbooks.length === incidentRules.length,
      rollbackPolicies.length === input.services.length,
      resiliencePolicies.length === input.services.length,
      operationalEvidence.length >= input.services.length,
    ].filter(Boolean).length;

    const operationsScore = Math.round(
      (operationsCoverage / 5) * 100,
    );

    const automationScore =
      input.enableAutoRemediation === false
        ? 80
        : remediations.length > 0
          ? 100
          : 0;

    const score = Math.round(
      (serviceCoverage + operationsScore + automationScore) / 3,
    );

    const success =
      input.services.length > 0 &&
      slos.length === input.services.length &&
      incidentRules.length > 0 &&
      runbooks.length === incidentRules.length &&
      resiliencePolicies.length === input.services.length &&
      score >= 80;

    const status = success
      ? V5OperationsStatus.READY
      : score >= 60
        ? V5OperationsStatus.DEGRADED
        : V5OperationsStatus.BLOCKED;

    return {
      success,
      status,
      score,
      slos,
      incidentRules,
      runbooks,
      remediations,
      capacityDecisions,
      rollbackPolicies,
      resiliencePolicies,
      operationalEvidence,
      alertRoutes,
      testPlan,
      enterpriseBrainPayload: {
        type: "genesis-v5-operations-runtime",
        systemKey: input.systemKey,
        slos,
        incidentRules,
        runbooks,
        remediations,
        capacityDecisions,
        rollbackPolicies,
        resiliencePolicies,
        operationalEvidence,
        alertRoutes,
      },
      evolutionCenterPayload: {
        type: "genesis-v5-operations-baseline",
        systemKey: input.systemKey,
        score,
        services: input.services.length,
        incidents: incidentRules.length,
        runbooks: runbooks.length,
        remediations: remediations.length,
        rollbackPolicies: rollbackPolicies.length,
        evidenceDefinitions: operationalEvidence.length,
      },
      evidence: [
        {
          id: randomUUID(),
          action: "genesis-v5.operations-runtime.completed",
          message: `Autonomous operations runtime completed with score ${score}.`,
          createdAt: new Date().toISOString(),
        },
      ],
      completedAt: new Date().toISOString(),
    };
  }
}
