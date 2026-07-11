import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GovernanceJsonValue,
  GovernanceRequest,
  GuardrailEvaluationResult,
  GuardrailStatus,
  RuntimeGuardrail,
  RuntimeGuardrailEvaluation,
} from "../contracts";
import {
  CreateRuntimeGuardrailDto,
  UpdateRuntimeGuardrailStatusDto,
} from "../dto";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  RuntimeGuardrailEvaluatorService,
} from "./runtime-guardrail-evaluator.service";

@Injectable()
export class RuntimeOperationalGuardrailService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
    private readonly evaluator:
      RuntimeGuardrailEvaluatorService,
  ) {}

  create(
    dto:
      CreateRuntimeGuardrailDto,
  ): RuntimeGuardrail {
    const duplicate =
      this.store
        .listGuardrails()
        .find(
          (item) =>
            item.key === dto.key &&
            item.status !==
              GuardrailStatus.ARCHIVED,
        );

    if (duplicate) {
      throw new BadRequestException(
        `Guardrail already exists for key ${dto.key}`,
      );
    }

    const now =
      new Date().toISOString();

    const guardrail:
      RuntimeGuardrail = {
      id:
        randomUUID(),
      key:
        dto.key,
      name:
        dto.name,
      description:
        dto.description,
      type:
        dto.type,
      status:
        GuardrailStatus.ACTIVE,
      environment:
        dto.environment,
      namespace:
        dto.namespace,
      service:
        dto.service,
      requestTypes:
        dto.requestTypes,
      conditions:
        dto.conditions.map(
          (condition) => ({
            field:
              condition.field,
            operator:
              condition.operator,
            value:
              condition.value as
                | GovernanceJsonValue
                | undefined,
          }),
        ),
      failureDecision:
        dto.failureDecision,
      warningOnly:
        dto.warningOnly,
      priority:
        dto.priority,
      requiredRoles:
        dto.requiredRoles,
      metadata:
        (dto.metadata ?? {}) as Record<
          string,
          GovernanceJsonValue
        >,
      createdBy:
        dto.actor,
      createdAt:
        now,
      updatedAt:
        now,
      activatedAt:
        now,
    };

    return this.store
      .saveGuardrail(
        guardrail,
      );
  }

  list():
    RuntimeGuardrail[] {
    return this.store
      .listGuardrails();
  }

  get(
    id: string,
  ): RuntimeGuardrail {
    const guardrail =
      this.store.getGuardrail(id);

    if (!guardrail) {
      throw new NotFoundException(
        `Runtime guardrail ${id} was not found`,
      );
    }

    return guardrail;
  }

  updateStatus(
    id: string,
    dto:
      UpdateRuntimeGuardrailStatusDto,
  ): RuntimeGuardrail {
    const guardrail =
      this.get(id);

    const now =
      new Date().toISOString();

    guardrail.status =
      dto.status;

    guardrail.updatedAt =
      now;

    if (
      dto.status ===
      GuardrailStatus.ACTIVE
    ) {
      guardrail.activatedAt =
        now;
    }

    if (
      dto.status ===
      GuardrailStatus.DISABLED
    ) {
      guardrail.disabledAt =
        now;
    }

    if (
      dto.status ===
      GuardrailStatus.ARCHIVED
    ) {
      guardrail.archivedAt =
        now;
    }

    guardrail.metadata = {
      ...guardrail.metadata,
      lastStatusReason:
        dto.reason,
      lastStatusActorId:
        dto.actor.id,
    };

    return this.store
      .saveGuardrail(
        guardrail,
      );
  }

  evaluateRequest(
    request:
      GovernanceRequest,
    context:
      Record<string, unknown>,
  ): RuntimeGuardrailEvaluation[] {
    const guardrails =
      this.list()
        .filter(
          (guardrail) =>
            guardrail.status ===
              GuardrailStatus.ACTIVE &&
            (
              !guardrail.environment ||
              guardrail.environment ===
                request.environment
            ) &&
            (
              !guardrail.namespace ||
              guardrail.namespace ===
                request.namespace
            ) &&
            (
              !guardrail.service ||
              guardrail.service ===
                request.service
            ) &&
            (
              guardrail.requestTypes
                .length === 0 ||
              guardrail.requestTypes
                .includes(
                  request.type,
                )
            ),
        )
        .sort(
          (a, b) =>
            b.priority - a.priority,
        );

    const evaluationContext = {
      request,
      context,
      riskLevel:
        request.evaluatedRiskLevel ??
        request.requestedRiskLevel,
      riskScore:
        request.riskScore ?? 0,
      blastRadius:
        request.blastRadius ?? 0,
      testCoverage:
        request.testCoverage ?? 0,
      rollbackPlanAvailable:
        request.rollbackPlanAvailable,
      businessCriticality:
        request.businessCriticality ??
        0,
      environment:
        request.environment,
      namespace:
        request.namespace,
      service:
        request.service ?? null,
      requestType:
        request.type,
      approvalsRequired:
        request.approvalsRequired,
    };

    return guardrails.map(
      (guardrail) => {
        const matched =
          this.evaluator
            .evaluateConditions(
              guardrail.conditions,
              evaluationContext,
            );

        const result =
          matched
            ? guardrail.warningOnly
              ? GuardrailEvaluationResult.WARNING
              : GuardrailEvaluationResult.FAILED
            : GuardrailEvaluationResult.PASSED;

        const reasons =
          matched
            ? [
                `Guardrail matched: ${guardrail.name}`,
              ]
            : [
                `Guardrail passed: ${guardrail.name}`,
              ];

        const evaluation:
          RuntimeGuardrailEvaluation = {
          id:
            randomUUID(),
          guardrailId:
            guardrail.id,
          requestId:
            request.id,
          result,
          decision:
            matched
              ? guardrail.failureDecision
              : undefined,
          reasons,
          evaluatedValues: {
            riskLevel:
              String(
                evaluationContext.riskLevel,
              ),
            riskScore:
              evaluationContext.riskScore,
            blastRadius:
              evaluationContext.blastRadius,
            testCoverage:
              evaluationContext.testCoverage,
            rollbackPlanAvailable:
              evaluationContext
                .rollbackPlanAvailable,
            approvalsRequired:
              evaluationContext
                .approvalsRequired,
          },
          evaluatedAt:
            new Date().toISOString(),
        };

        return this.store
          .saveGuardrailEvaluation(
            evaluation,
          );
      },
    );
  }

  listEvaluations():
    RuntimeGuardrailEvaluation[] {
    return this.store
      .listGuardrailEvaluations();
  }
}
