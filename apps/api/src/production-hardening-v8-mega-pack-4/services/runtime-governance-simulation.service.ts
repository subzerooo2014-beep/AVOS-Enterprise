import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GovernanceImpactCategory,
  GovernanceJsonValue,
  GovernancePolicySimulation,
  GovernanceRiskLevel,
  GovernanceSimulationFinding,
  GovernanceSimulationStatus,
} from "../contracts";
import {
  SimulateGovernanceRequestDto,
} from "../dto";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  clampGovernanceScore,
  governanceDecisionFromRisk,
  governanceRiskFromScore,
} from "../utils";
import {
  RuntimeGovernanceRequestService,
} from "./runtime-governance-request.service";

@Injectable()
export class RuntimeGovernanceSimulationService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
    private readonly requests:
      RuntimeGovernanceRequestService,
  ) {}

  simulate(
    requestId: string,
    dto: SimulateGovernanceRequestDto,
  ): GovernancePolicySimulation {
    const request =
      this.requests.get(requestId);

    const startedAt =
      new Date().toISOString();

    const simulation:
      GovernancePolicySimulation = {
      id:
        randomUUID(),
      requestId:
        request.id,
      status:
        GovernanceSimulationStatus.RUNNING,
      scenario: {
        id:
          randomUUID(),
        name:
          dto.scenarioName,
        description:
          dto.description,
        changes:
          dto.changes as Record<
            string,
            GovernanceJsonValue
          >,
        assumptions:
          (dto.assumptions ?? {}) as Record<
            string,
            GovernanceJsonValue
          >,
      },
      predictedDecision:
        request.decision ??
        governanceDecisionFromRisk(
          request.requestedRiskLevel,
        ),
      predictedRiskLevel:
        request.evaluatedRiskLevel ??
        request.requestedRiskLevel,
      predictedRiskScore:
        request.riskScore ?? 0,
      findings: [],
      recommendations: [],
      startedAt,
    };

    this.store.saveSimulation(
      simulation,
    );

    try {
      const score =
        this.calculateScenarioRisk(
          request.blastRadius ?? 30,
          request.businessCriticality ?? 40,
          request.testCoverage ?? 50,
          request.rollbackPlanAvailable,
          dto.changes,
          dto.assumptions ?? {},
        );

      const riskLevel =
        governanceRiskFromScore(score);

      const findings =
        this.buildFindings(
          request.id,
          score,
          dto.changes,
        );

      simulation.predictedRiskScore =
        score;

      simulation.predictedRiskLevel =
        riskLevel;

      simulation.predictedDecision =
        governanceDecisionFromRisk(
          riskLevel,
        );

      simulation.findings =
        findings;

      simulation.recommendations =
        this.buildRecommendations(
          riskLevel,
          findings,
        );

      simulation.status =
        GovernanceSimulationStatus.COMPLETED;

      simulation.completedAt =
        new Date().toISOString();

      return this.store.saveSimulation(
        simulation,
      );
    } catch (error) {
      simulation.status =
        GovernanceSimulationStatus.FAILED;

      simulation.failedAt =
        new Date().toISOString();

      simulation.error =
        error instanceof Error
          ? error.message
          : "Unknown simulation failure";

      return this.store.saveSimulation(
        simulation,
      );
    }
  }

  list():
    GovernancePolicySimulation[] {
    return this.store
      .listSimulations();
  }

  get(
    id: string,
  ): GovernancePolicySimulation {
    const item =
      this.store.getSimulation(id);

    if (!item) {
      throw new NotFoundException(
        `Governance simulation ${id} was not found`,
      );
    }

    return item;
  }

  private calculateScenarioRisk(
    blastRadius: number,
    businessCriticality: number,
    testCoverage: number,
    rollbackPlanAvailable: boolean,
    changes: Record<string, unknown>,
    assumptions: Record<string, unknown>,
  ): number {
    const deploymentScale =
      Number(
        changes.deploymentScale ??
        assumptions.deploymentScale ??
        1,
      );

    const dependencyCount =
      Number(
        changes.dependencyCount ??
        assumptions.dependencyCount ??
        0,
      );

    const securitySensitive =
      Boolean(
        changes.securitySensitive ??
        assumptions.securitySensitive ??
        false,
      );

    const dataMigration =
      Boolean(
        changes.dataMigration ??
        assumptions.dataMigration ??
        false,
      );

    const score =
      blastRadius * 0.2 +
      businessCriticality * 0.2 +
      (100 - testCoverage) * 0.2 +
      (rollbackPlanAvailable ? 5 : 25) +
      Math.min(
        15,
        deploymentScale * 3,
      ) +
      Math.min(
        10,
        dependencyCount * 2,
      ) +
      (securitySensitive ? 10 : 0) +
      (dataMigration ? 10 : 0);

    return clampGovernanceScore(
      score,
    );
  }

  private buildFindings(
    requestId: string,
    riskScore: number,
    changes: Record<string, unknown>,
  ): GovernanceSimulationFinding[] {
    const findings:
      GovernanceSimulationFinding[] = [];

    if (
      Number(
        changes.deploymentScale ?? 1,
      ) >= 3
    ) {
      findings.push({
        id:
          randomUUID(),
        category:
          GovernanceImpactCategory.SERVICE,
        severity:
          GovernanceRiskLevel.HIGH,
        title:
          "Wide deployment scale detected",
        description:
          "The simulated deployment affects multiple runtime units.",
        affectedResourceIds: [
          requestId,
        ],
        confidence:
          94,
        metadata: {
          deploymentScale:
            Number(
              changes.deploymentScale ??
              1,
            ),
        },
      });
    }

    if (
      Boolean(
        changes.securitySensitive,
      )
    ) {
      findings.push({
        id:
          randomUUID(),
        category:
          GovernanceImpactCategory.SECURITY,
        severity:
          GovernanceRiskLevel.HIGH,
        title:
          "Security-sensitive change",
        description:
          "The scenario includes security-sensitive modifications.",
        affectedResourceIds: [
          requestId,
        ],
        confidence:
          98,
        metadata: {},
      });
    }

    if (
      Boolean(
        changes.dataMigration,
      )
    ) {
      findings.push({
        id:
          randomUUID(),
        category:
          GovernanceImpactCategory.DATA,
        severity:
          GovernanceRiskLevel.HIGH,
        title:
          "Data migration impact",
        description:
          "The scenario contains data migration risk.",
        affectedResourceIds: [
          requestId,
        ],
        confidence:
          97,
        metadata: {},
      });
    }

    if (
      riskScore >= 65
    ) {
      findings.push({
        id:
          randomUUID(),
        category:
          GovernanceImpactCategory.BUSINESS,
        severity:
          governanceRiskFromScore(
            riskScore,
          ),
        title:
          "Elevated scenario risk",
        description:
          "The simulated scenario exceeds the elevated-risk threshold.",
        affectedResourceIds: [
          requestId,
        ],
        confidence:
          96,
        metadata: {
          riskScore,
        },
      });
    }

    return findings;
  }

  private buildRecommendations(
    riskLevel: GovernanceRiskLevel,
    findings: GovernanceSimulationFinding[],
  ): string[] {
    const recommendations:
      string[] = [];

    if (
      riskLevel ===
        GovernanceRiskLevel.HIGH ||
      riskLevel ===
        GovernanceRiskLevel.CRITICAL
    ) {
      recommendations.push(
        "Require senior governance approval",
      );

      recommendations.push(
        "Execute within a restricted maintenance window",
      );

      recommendations.push(
        "Validate rollback plan before execution",
      );
    }

    if (
      findings.some(
        (finding) =>
          finding.category ===
          GovernanceImpactCategory.DATA,
      )
    ) {
      recommendations.push(
        "Create a verified data backup before execution",
      );
    }

    if (
      findings.some(
        (finding) =>
          finding.category ===
          GovernanceImpactCategory.SECURITY,
      )
    ) {
      recommendations.push(
        "Require security review and enhanced monitoring",
      );
    }

    if (
      recommendations.length === 0
    ) {
      recommendations.push(
        "Proceed with standard governance monitoring",
      );
    }

    return Array.from(
      new Set(recommendations),
    );
  }
}
