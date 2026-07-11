import {
  Injectable,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GovernanceAuditEventType,
  GovernanceJsonValue,
  GovernanceRecommendation,
  GovernanceRecommendationType,
  GovernanceRequest,
  GovernanceRiskLevel,
} from "../contracts";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  RuntimeGovernanceAuditService,
} from "./runtime-governance-audit.service";

@Injectable()
export class RuntimeGovernanceRecommendationService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
    private readonly audit:
      RuntimeGovernanceAuditService,
  ) {}

  generate(
    request:
      GovernanceRequest,
  ): GovernanceRecommendation[] {
    const recommendations:
      GovernanceRecommendation[] = [];

    if (
      !request.rollbackPlanAvailable
    ) {
      recommendations.push(
        this.create(
          request,
          GovernanceRecommendationType
            .REQUIRE_ROLLBACK_PLAN,
          100,
          "Rollback plan required",
          "The request must include a validated rollback plan before approval.",
          true,
          99,
          {
            reason:
              "rollback_plan_missing",
          },
        ),
      );
    }

    if (
      (
        request.testCoverage ??
        0
      ) < 75
    ) {
      recommendations.push(
        this.create(
          request,
          GovernanceRecommendationType
            .REQUIRE_TESTING,
          90,
          "Additional testing required",
          "Test coverage is below the governance threshold of 75%.",
          true,
          95,
          {
            testCoverage:
              request.testCoverage ??
              0,
            minimumRequired:
              75,
          },
        ),
      );
    }

    if (
      (
        request.blastRadius ??
        0
      ) >= 60
    ) {
      recommendations.push(
        this.create(
          request,
          GovernanceRecommendationType
            .REDUCE_BLAST_RADIUS,
          85,
          "Reduce blast radius",
          "The expected blast radius is high and should be segmented before execution.",
          true,
          94,
          {
            blastRadius:
              request.blastRadius ??
              0,
          },
        ),
      );
    }

    if (
      request.requestedRiskLevel ===
        GovernanceRiskLevel.HIGH ||
      request.requestedRiskLevel ===
        GovernanceRiskLevel.CRITICAL
    ) {
      recommendations.push(
        this.create(
          request,
          GovernanceRecommendationType
            .REQUIRE_MONITORING,
          80,
          "Enhanced runtime monitoring required",
          "High-risk requests require enhanced monitoring during and after execution.",
          true,
          98,
          {
            requestedRiskLevel:
              request.requestedRiskLevel,
          },
        ),
      );

      recommendations.push(
        this.create(
          request,
          GovernanceRecommendationType
            .ESCALATE,
          75,
          "Escalate for senior approval",
          "The request should be reviewed by senior operations and security approvers.",
          true,
          97,
          {
            requestedRiskLevel:
              request.requestedRiskLevel,
          },
        ),
      );
    }

    if (
      !request.changeWindowId &&
      request.environment ===
        "production"
    ) {
      recommendations.push(
        this.create(
          request,
          GovernanceRecommendationType
            .REQUIRE_MAINTENANCE_WINDOW,
          70,
          "Approved change window required",
          "Production changes should be linked to an approved change window.",
          true,
          96,
          {
            environment:
              request.environment,
          },
        ),
      );
    }

    if (
      recommendations.length === 0
    ) {
      recommendations.push(
        this.create(
          request,
          GovernanceRecommendationType
            .APPROVE,
          10,
          "Request is suitable for approval",
          "No blocking governance conditions were detected.",
          false,
          90,
          {
            recommendation:
              "standard_approval",
          },
        ),
      );
    }

    return recommendations;
  }

  list():
    GovernanceRecommendation[] {
    return this.store
      .listRecommendations();
  }

  private create(
    request:
      GovernanceRequest,
    type:
      GovernanceRecommendationType,
    priority: number,
    title: string,
    description: string,
    required: boolean,
    confidence: number,
    metadata:
      Record<
        string,
        GovernanceJsonValue
      >,
  ): GovernanceRecommendation {
    const recommendation:
      GovernanceRecommendation = {
      id:
        randomUUID(),
      requestId:
        request.id,
      type,
      priority,
      title,
      description,
      required,
      confidence,
      metadata,
      createdAt:
        new Date().toISOString(),
    };

    const saved =
      this.store
        .saveRecommendation(
          recommendation,
        );

    this.audit.append({
      type:
        GovernanceAuditEventType
          .RECOMMENDATION_CREATED,
      aggregateType:
        "governance_recommendation",
      aggregateId:
        saved.id,
      actor: {
        id:
          "avos-governance-recommendation-engine",
        type:
          "system",
        name:
          "AVOS Governance Recommendation Engine",
        roles: [
          "runtime_governance",
          "decision_support",
        ],
      },
      payload: {
        recommendationId:
          saved.id,
        requestId:
          saved.requestId,
        type:
          saved.type,
        priority:
          saved.priority,
        required:
          saved.required,
        confidence:
          saved.confidence,
      },
    });

    return saved;
  }
}
