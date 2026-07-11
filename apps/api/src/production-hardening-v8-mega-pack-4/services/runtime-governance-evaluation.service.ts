import {
  BadRequestException,
  Injectable,
} from "@nestjs/common";
import {
  GovernanceAuditEventType,
  GovernanceControlMode,
  GovernanceDecision,
  GovernanceEvaluationFactor,
  GovernanceJsonValue,
  GovernanceRequestStatus,
  GovernanceRiskLevel,
} from "../contracts";
import {
  EvaluateGovernanceRequestDto,
} from "../dto";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  approvalsFromGovernanceRisk,
  clampGovernanceScore,
  governanceDecisionFromRisk,
  governanceRiskFromScore,
} from "../utils";
import {
  RuntimeChangeWindowService,
} from "./runtime-change-window.service";
import {
  RuntimeGovernanceAuditService,
} from "./runtime-governance-audit.service";
import {
  RuntimeGovernanceRecommendationService,
} from "./runtime-governance-recommendation.service";
import {
  RuntimeGovernanceRequestService,
} from "./runtime-governance-request.service";
import {
  RuntimeMaintenanceModeService,
} from "./runtime-maintenance-mode.service";

@Injectable()
export class RuntimeGovernanceEvaluationService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
    private readonly requests:
      RuntimeGovernanceRequestService,
    private readonly changeWindows:
      RuntimeChangeWindowService,
    private readonly maintenance:
      RuntimeMaintenanceModeService,
    private readonly recommendations:
      RuntimeGovernanceRecommendationService,
    private readonly audit:
      RuntimeGovernanceAuditService,
  ) {}

  evaluate(
    id: string,
    dto:
      EvaluateGovernanceRequestDto,
  ) {
    const request =
      this.requests.get(id);

    if (
      ![
        GovernanceRequestStatus.PENDING,
        GovernanceRequestStatus.DEFERRED,
      ].includes(request.status)
    ) {
      throw new BadRequestException(
        `Request cannot be evaluated in status ${request.status}`,
      );
    }

    request.status =
      GovernanceRequestStatus.EVALUATING;

    request.updatedAt =
      new Date().toISOString();

    this.store
      .saveGovernanceRequest(request);

    const factors =
      this.buildFactors(
        request,
        dto.runtimeContext ?? {},
      );

    const riskScore =
      clampGovernanceScore(
        factors.reduce(
          (
            total,
            factor,
          ) =>
            total +
            factor.weightedScore,
          0,
        ),
      );

    let riskLevel =
      governanceRiskFromScore(
        riskScore,
      );

    let decision =
      governanceDecisionFromRisk(
        riskLevel,
      );

    if (
      this.store.getControlMode() ===
      GovernanceControlMode.LOCKDOWN
    ) {
      riskLevel =
        GovernanceRiskLevel.CRITICAL;

      decision =
        GovernanceDecision.BLOCK;
    }

    if (
      request.changeWindowId
    ) {
      const windowDecision =
        this.changeWindows
          .isRequestAllowed(
            request.changeWindowId,
            request.type,
            riskLevel,
          );

      if (
        !windowDecision.allowed
      ) {
        decision =
          GovernanceDecision.DEFER;
      }
    } else if (
      request.environment ===
      "production"
    ) {
      decision =
        GovernanceDecision.DEFER;
    }

    const maintenancePolicy =
      this.maintenance
        .getAccessPolicy(
          request.environment,
          request.namespace,
          request.service,
        );

    if (
      request.type ===
        "deployment" &&
      !maintenancePolicy
        .allowDeployments
    ) {
      decision =
        GovernanceDecision.BLOCK;
    }

    const generatedRecommendations =
      this.recommendations
        .generate(request);

    request.evaluatedRiskLevel =
      riskLevel;

    request.riskScore =
      riskScore;

    request.decision =
      decision;

    request.evaluationFactors =
      factors;

    request.recommendations =
      generatedRecommendations;

    request.approvalsRequired =
      Math.max(
        request.approvalsRequired,
        approvalsFromGovernanceRisk(
          riskLevel,
        ),
      );

    request.evaluatedAt =
      new Date().toISOString();

    request.updatedAt =
      request.evaluatedAt;

    if (
      decision ===
      GovernanceDecision.BLOCK
    ) {
      request.status =
        GovernanceRequestStatus.REJECTED;

      request.rejectedAt =
        request.evaluatedAt;
    } else if (
      decision ===
      GovernanceDecision.DEFER
    ) {
      request.status =
        GovernanceRequestStatus.DEFERRED;
    } else if (
      request.approvalsRequired === 0
    ) {
      request.status =
        GovernanceRequestStatus.APPROVED;

      request.approvedAt =
        request.evaluatedAt;
    } else {
      request.status =
        GovernanceRequestStatus.PENDING;
    }

    const saved =
      this.store
        .saveGovernanceRequest(
          request,
        );

    this.audit.append({
      type:
        GovernanceAuditEventType
          .GOVERNANCE_REQUEST_EVALUATED,
      aggregateType:
        "governance_request",
      aggregateId:
        saved.id,
      actor:
        dto.actor,
      payload: {
        requestId:
          saved.id,
        riskScore:
          saved.riskScore ?? 0,
        evaluatedRiskLevel:
          saved.evaluatedRiskLevel ??
          null,
        decision:
          saved.decision ??
          null,
        status:
          saved.status,
        approvalsRequired:
          saved.approvalsRequired,
        recommendationIds:
          saved.recommendations.map(
            (item) => item.id,
          ),
      },
    });

    return saved;
  }

  private buildFactors(
    request:
      ReturnType<
        RuntimeGovernanceRequestService["get"]
      >,
    runtimeContext:
      Record<string, unknown>,
  ): GovernanceEvaluationFactor[] {
    const factors:
      GovernanceEvaluationFactor[] = [];

    factors.push(
      this.factor(
        "requested_risk",
        "Requested risk level",
        this.riskLevelScore(
          request.requestedRiskLevel,
        ),
        0.2,
        `Requested risk level is ${request.requestedRiskLevel}`,
      ),
    );

    factors.push(
      this.factor(
        "blast_radius",
        "Blast radius",
        request.blastRadius ??
        Number(
          runtimeContext
            .blastRadius ??
          30,
        ),
        0.2,
        "Blast radius influences runtime change risk",
      ),
    );

    factors.push(
      this.factor(
        "business_criticality",
        "Business criticality",
        request.businessCriticality ??
        Number(
          runtimeContext
            .businessCriticality ??
          40,
        ),
        0.15,
        "Business criticality increases governance requirements",
      ),
    );

    factors.push(
      this.factor(
        "test_coverage",
        "Test coverage",
        100 -
        (
          request.testCoverage ??
          Number(
            runtimeContext
              .testCoverage ??
            50,
          )
        ),
        0.15,
        "Lower test coverage increases deployment risk",
      ),
    );

    factors.push(
      this.factor(
        "rollback_readiness",
        "Rollback readiness",
        request.rollbackPlanAvailable
          ? 10
          : 90,
        0.15,
        request.rollbackPlanAvailable
          ? "Rollback plan is available"
          : "Rollback plan is missing",
      ),
    );

    factors.push(
      this.factor(
        "production_environment",
        "Production environment",
        request.environment ===
          "production"
          ? 85
          : 25,
        0.1,
        `Request environment is ${request.environment}`,
      ),
    );

    factors.push(
      this.factor(
        "active_incidents",
        "Active incident pressure",
        Math.min(
          100,
          Number(
            runtimeContext
              .activeIncidents ??
            0,
          ) *
          20,
        ),
        0.05,
        "Active incidents increase operational change risk",
      ),
    );

    return factors;
  }

  private factor(
    key: string,
    label: string,
    score: number,
    weight: number,
    reason: string,
  ): GovernanceEvaluationFactor {
    const normalized =
      clampGovernanceScore(
        score,
      );

    return {
      key,
      label,
      score:
        normalized,
      weight,
      weightedScore:
        Math.round(
          normalized *
          weight,
        ),
      reason,
      metadata: {},
    };
  }

  private riskLevelScore(
    level:
      GovernanceRiskLevel,
  ): number {
    switch (level) {
      case GovernanceRiskLevel.CRITICAL:
        return 100;

      case GovernanceRiskLevel.HIGH:
        return 80;

      case GovernanceRiskLevel.MEDIUM:
        return 55;

      case GovernanceRiskLevel.LOW:
        return 25;

      case GovernanceRiskLevel.INFORMATIONAL:
      default:
        return 5;
    }
  }
}
