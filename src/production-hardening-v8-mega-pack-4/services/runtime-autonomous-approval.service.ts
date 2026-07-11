import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  ApprovalSuggestionDecision,
  AutonomousApprovalSuggestion,
  GovernanceApprovalTier,
  GovernanceDecision,
  GovernanceJsonValue,
  GovernanceRequest,
  GovernanceRiskLevel,
  GuardrailEvaluationResult,
  RuntimeDecisionConfidence,
} from "../contracts";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  RuntimeGovernanceApprovalMatrixService,
} from "./runtime-governance-approval-matrix.service";
import {
  RuntimeOperationalGuardrailService,
} from "./runtime-operational-guardrail.service";

@Injectable()
export class RuntimeAutonomousApprovalService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
    private readonly matrix:
      RuntimeGovernanceApprovalMatrixService,
    private readonly guardrails:
      RuntimeOperationalGuardrailService,
  ) {}

  generate(
    request:
      GovernanceRequest,
    runtimeContext:
      Record<string, unknown> = {},
  ): AutonomousApprovalSuggestion {
    const matrixDecision =
      this.matrix.evaluate(
        request,
      );

    const guardrailEvaluations =
      this.guardrails
        .evaluateRequest(
          request,
          runtimeContext,
        );

    const blockingConditions =
      guardrailEvaluations
        .filter(
          (item) =>
            item.result ===
            GuardrailEvaluationResult.FAILED,
        )
        .flatMap(
          (item) => item.reasons,
        );

    const warningConditions =
      guardrailEvaluations
        .filter(
          (item) =>
            item.result ===
            GuardrailEvaluationResult.WARNING,
        )
        .flatMap(
          (item) => item.reasons,
        );

    let decision =
      ApprovalSuggestionDecision
        .REQUIRE_MANUAL_REVIEW;

    let confidenceScore =
      70;

    const risk =
      request.evaluatedRiskLevel ??
      request.requestedRiskLevel;

    if (
      blockingConditions.length > 0 ||
      request.decision ===
        GovernanceDecision.BLOCK
    ) {
      decision =
        risk ===
          GovernanceRiskLevel.CRITICAL
          ? ApprovalSuggestionDecision
              .AUTO_REJECT
          : ApprovalSuggestionDecision
              .RECOMMEND_REJECTION;

      confidenceScore =
        95;
    } else if (
      request.decision ===
        GovernanceDecision.DEFER
    ) {
      decision =
        ApprovalSuggestionDecision.DEFER;

      confidenceScore =
        92;
    } else if (
      risk ===
        GovernanceRiskLevel.INFORMATIONAL &&
      request.rollbackPlanAvailable &&
      (
        request.testCoverage ??
        0
      ) >= 90 &&
      warningConditions.length === 0 &&
      matrixDecision.tier ===
        GovernanceApprovalTier.NONE
    ) {
      decision =
        ApprovalSuggestionDecision
          .AUTO_APPROVE;

      confidenceScore =
        97;
    } else if (
      (
        risk ===
          GovernanceRiskLevel.LOW ||
        risk ===
          GovernanceRiskLevel.MEDIUM
      ) &&
      request.rollbackPlanAvailable &&
      (
        request.testCoverage ??
        0
      ) >= 75 &&
      blockingConditions.length === 0
    ) {
      decision =
        ApprovalSuggestionDecision
          .RECOMMEND_APPROVAL;

      confidenceScore =
        warningConditions.length > 0
          ? 82
          : 91;
    } else {
      decision =
        ApprovalSuggestionDecision
          .REQUIRE_MANUAL_REVIEW;

      confidenceScore =
        85;
    }

    const confidence =
      this.confidenceFromScore(
        confidenceScore,
      );

    const suggestion:
      AutonomousApprovalSuggestion = {
      id:
        randomUUID(),
      requestId:
        request.id,
      decision,
      confidence,
      confidenceScore,
      suggestedApprovalCount:
        Math.max(
          request.approvalsRequired,
          matrixDecision
            .requiredApprovals,
        ),
      suggestedRoles:
        Array.from(
          new Set(
            matrixDecision.requiredRoles,
          ),
        ),
      reasons: [
        ...matrixDecision.reasons,
        `Risk level: ${risk}`,
        `Decision recommendation: ${decision}`,
      ],
      blockingConditions,
      warningConditions,
      metadata: {
        matrixTier:
          matrixDecision.tier,
        matchedRuleIds:
          matrixDecision.matchedRuleIds,
        guardrailEvaluations:
          guardrailEvaluations.length,
      } as Record<
        string,
        GovernanceJsonValue
      >,
      generatedAt:
        new Date().toISOString(),
    };

    return this.store
      .saveApprovalSuggestion(
        suggestion,
      );
  }

  list():
    AutonomousApprovalSuggestion[] {
    return this.store
      .listApprovalSuggestions();
  }

  private confidenceFromScore(
    score: number,
  ): RuntimeDecisionConfidence {
    if (score >= 95) {
      return RuntimeDecisionConfidence
        .VERY_HIGH;
    }

    if (score >= 80) {
      return RuntimeDecisionConfidence
        .HIGH;
    }

    if (score >= 60) {
      return RuntimeDecisionConfidence
        .MEDIUM;
    }

    return RuntimeDecisionConfidence
      .LOW;
  }
}
