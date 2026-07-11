import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GovernanceDecision,
  GovernanceJsonValue,
  GovernanceRequestStatus,
  GuardrailEvaluationResult,
  RuntimeDecisionConfidence,
  RuntimeDecisionEvidence,
  RuntimeDecisionRecord,
  RuntimeDecisionRecordStatus,
  RuntimeDecisionSource,
} from "../contracts";
import {
  ReviewRuntimeDecisionDto,
} from "../dto";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  RuntimeAutonomousApprovalService,
} from "./runtime-autonomous-approval.service";
import {
  RuntimeGovernanceApprovalMatrixService,
} from "./runtime-governance-approval-matrix.service";
import {
  RuntimeGovernanceRequestService,
} from "./runtime-governance-request.service";
import {
  RuntimeOperationalGuardrailService,
} from "./runtime-operational-guardrail.service";

@Injectable()
export class RuntimeDecisionCenterService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
    private readonly requests:
      RuntimeGovernanceRequestService,
    private readonly matrix:
      RuntimeGovernanceApprovalMatrixService,
    private readonly approvals:
      RuntimeAutonomousApprovalService,
    private readonly guardrails:
      RuntimeOperationalGuardrailService,
  ) {}

  generate(
    requestId: string,
    runtimeContext:
      Record<string, unknown> = {},
  ): RuntimeDecisionRecord {
    const request =
      this.requests.get(
        requestId,
      );

    const matrixDecision =
      this.matrix.evaluate(
        request,
      );

    const suggestion =
      this.approvals.generate(
        request,
        runtimeContext,
      );

    const guardrailEvaluations =
      this.store
        .listGuardrailEvaluations()
        .filter(
          (item) =>
            item.requestId ===
            request.id,
        );

    const failedGuardrails =
      guardrailEvaluations.filter(
        (item) =>
          item.result ===
          GuardrailEvaluationResult.FAILED,
      );

    const warningGuardrails =
      guardrailEvaluations.filter(
        (item) =>
          item.result ===
          GuardrailEvaluationResult.WARNING,
      );

    let decision =
      request.decision ??
      GovernanceDecision
        .REQUIRE_APPROVAL;

    if (
      failedGuardrails.length > 0
    ) {
      decision =
        failedGuardrails[0]
          .decision ??
        GovernanceDecision.BLOCK;
    }

    const confidenceScore =
      Math.min(
        100,
        Math.max(
          0,
          suggestion.confidenceScore -
          warningGuardrails.length * 5,
        ),
      );

    const evidence:
      RuntimeDecisionEvidence[] = [
      {
        id:
          randomUUID(),
        source:
          RuntimeDecisionSource
            .RISK_ENGINE,
        sourceId:
          request.id,
        label:
          "Governance risk score",
        value:
          request.riskScore ?? 0,
        weight:
          0.3,
        score:
          request.riskScore ?? 0,
        reason:
          "Governance request risk evaluation",
        metadata: {},
      },
      {
        id:
          randomUUID(),
        source:
          RuntimeDecisionSource
            .APPROVAL_MATRIX,
        sourceId:
          request.id,
        label:
          "Approval tier",
        value:
          matrixDecision.tier,
        weight:
          0.2,
        score:
          matrixDecision
            .requiredApprovals *
          20,
        reason:
          matrixDecision.reasons.join(
            "; ",
          ),
        metadata: {
          matchedRuleIds:
            matrixDecision
              .matchedRuleIds,
        },
      },
      {
        id:
          randomUUID(),
        source:
          RuntimeDecisionSource
            .POLICY,
        sourceId:
          request.id,
        label:
          "Operational guardrails",
        value:
          failedGuardrails.length,
        weight:
          0.3,
        score:
          failedGuardrails.length *
          30 +
          warningGuardrails.length *
          10,
        reason:
          `Failed guardrails: ${failedGuardrails.length}; warning guardrails: ${warningGuardrails.length}`,
        metadata: {
          failedGuardrailIds:
            failedGuardrails.map(
              (item) =>
                item.guardrailId,
            ),
          warningGuardrailIds:
            warningGuardrails.map(
              (item) =>
                item.guardrailId,
            ),
        },
      },
      {
        id:
          randomUUID(),
        source:
          RuntimeDecisionSource
            .COMPOSITE,
        sourceId:
          suggestion.id,
        label:
          "Autonomous approval suggestion",
        value:
          suggestion.decision,
        weight:
          0.2,
        score:
          suggestion.confidenceScore,
        reason:
          suggestion.reasons.join(
            "; ",
          ),
        metadata: {
          blockingConditions:
            suggestion
              .blockingConditions,
          warningConditions:
            suggestion
              .warningConditions,
        },
      },
    ];

    const now =
      new Date().toISOString();

    const record:
      RuntimeDecisionRecord = {
      id:
        randomUUID(),
      requestId:
        request.id,
      status:
        RuntimeDecisionRecordStatus
          .PENDING_REVIEW,
      decision,
      source:
        RuntimeDecisionSource
          .COMPOSITE,
      confidence:
        this.confidenceFromScore(
          confidenceScore,
        ),
      confidenceScore,
      riskLevel:
        request.evaluatedRiskLevel ??
        request.requestedRiskLevel,
      riskScore:
        request.riskScore ?? 0,
      approvalTier:
        matrixDecision.tier,
      approvalsRequired:
        Math.max(
          request.approvalsRequired,
          matrixDecision
            .requiredApprovals,
          suggestion
            .suggestedApprovalCount,
        ),
      requiredRoles:
        Array.from(
          new Set([
            ...matrixDecision
              .requiredRoles,
            ...suggestion
              .suggestedRoles,
          ]),
        ),
      evidence,
      reasons: [
        ...(request
          .recommendations ?? [])
          .map(
            (item) =>
              item.description,
          ),
        ...suggestion.reasons,
      ],
      recommendations: [
        ...(
          request.recommendations ??
          []
        ).map(
          (item) =>
            item.title,
        ),
        ...suggestion
          .warningConditions,
      ],
      expiresAt:
        new Date(
          Date.now() +
          24 * 60 * 60 * 1000,
        ).toISOString(),
      createdBy: {
        id:
          "avos-runtime-decision-center",
        type:
          "system",
        name:
          "AVOS Runtime Decision Center",
        roles: [
          "runtime_governance",
          "decision_authority",
        ],
      },
      createdAt:
        now,
      updatedAt:
        now,
    };

    return this.store
      .saveDecisionRecord(
        record,
      );
  }

  list():
    RuntimeDecisionRecord[] {
    return this.store
      .listDecisionRecords();
  }

  get(
    id: string,
  ): RuntimeDecisionRecord {
    const record =
      this.store
        .getDecisionRecord(id);

    if (!record) {
      throw new NotFoundException(
        `Runtime decision record ${id} was not found`,
      );
    }

    return record;
  }

  review(
    id: string,
    dto:
      ReviewRuntimeDecisionDto,
  ): RuntimeDecisionRecord {
    const record =
      this.get(id);

    if (
      ![
        RuntimeDecisionRecordStatus.PENDING_REVIEW,
        RuntimeDecisionRecordStatus.GENERATED,
      ].includes(record.status)
    ) {
      throw new BadRequestException(
        `Decision cannot be reviewed in status ${record.status}`,
      );
    }

    const now =
      new Date().toISOString();

    record.status =
      dto.status;

    record.reviewedBy =
      dto.actor;

    record.reviewedAt =
      now;

    record.updatedAt =
      now;

    if (
      dto.status ===
      RuntimeDecisionRecordStatus.ACCEPTED
    ) {
      record.acceptedAt =
        now;
    }

    if (
      dto.status ===
      RuntimeDecisionRecordStatus.REJECTED
    ) {
      record.rejectedAt =
        now;
    }

    if (
      dto.status ===
      RuntimeDecisionRecordStatus.OVERRIDDEN
    ) {
      record.overriddenAt =
        now;

      record.overrideReason =
        dto.overrideReason ??
        dto.reason;
    }

    record.reasons.push(
      `Review: ${dto.reason}`,
    );

    return this.store
      .saveDecisionRecord(
        record,
      );
  }

  markExecuted(
    id: string,
  ): RuntimeDecisionRecord {
    const record =
      this.get(id);

    if (
      record.status !==
      RuntimeDecisionRecordStatus.ACCEPTED
    ) {
      throw new BadRequestException(
        `Only accepted decisions can be marked executed. Current status: ${record.status}`,
      );
    }

    record.status =
      RuntimeDecisionRecordStatus.EXECUTED;

    record.executedAt =
      new Date().toISOString();

    record.updatedAt =
      record.executedAt;

    const request =
      this.requests.get(
        record.requestId,
      );

    if (
      request.status ===
      GovernanceRequestStatus.APPROVED
    ) {
      request.status =
        GovernanceRequestStatus.EXECUTED;

      request.executedAt =
        record.executedAt;

      request.updatedAt =
        record.executedAt;

      this.store
        .saveGovernanceRequest(
          request,
        );
    }

    return this.store
      .saveDecisionRecord(
        record,
      );
  }

  snapshot() {
    const decisions =
      this.list();

    const evaluations =
      this.guardrails
        .listEvaluations();

    return {
      totalDecisions:
        decisions.length,
      generatedDecisions:
        decisions.filter(
          (item) =>
            item.status ===
            RuntimeDecisionRecordStatus.GENERATED,
        ).length,
      pendingReview:
        decisions.filter(
          (item) =>
            item.status ===
            RuntimeDecisionRecordStatus.PENDING_REVIEW,
        ).length,
      acceptedDecisions:
        decisions.filter(
          (item) =>
            item.status ===
            RuntimeDecisionRecordStatus.ACCEPTED,
        ).length,
      rejectedDecisions:
        decisions.filter(
          (item) =>
            item.status ===
            RuntimeDecisionRecordStatus.REJECTED,
        ).length,
      overriddenDecisions:
        decisions.filter(
          (item) =>
            item.status ===
            RuntimeDecisionRecordStatus.OVERRIDDEN,
        ).length,
      executedDecisions:
        decisions.filter(
          (item) =>
            item.status ===
            RuntimeDecisionRecordStatus.EXECUTED,
        ).length,
      approvalSuggestions:
        this.store
          .listApprovalSuggestions()
          .length,
      activeGuardrails:
        this.store
          .listGuardrails()
          .filter(
            (item) =>
              item.status ===
              "active",
          ).length,
      guardrailEvaluations:
        evaluations.length,
      failedGuardrails:
        evaluations.filter(
          (item) =>
            item.result ===
            GuardrailEvaluationResult.FAILED,
        ).length,
      warningGuardrails:
        evaluations.filter(
          (item) =>
            item.result ===
            GuardrailEvaluationResult.WARNING,
        ).length,
      generatedAt:
        new Date().toISOString(),
    };
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
