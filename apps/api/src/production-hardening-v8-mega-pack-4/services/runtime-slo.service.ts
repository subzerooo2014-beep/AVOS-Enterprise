import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GovernanceAuditEventType,
  GovernanceJsonValue,
  RuntimeSloDefinition,
  RuntimeSloEvaluation,
  SloComplianceStatus,
} from "../contracts";
import {
  CreateRuntimeSloDto,
  EvaluateRuntimeSloDto,
} from "../dto";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  clampGovernanceScore,
} from "../utils";
import {
  RuntimeGovernanceAuditService,
} from "./runtime-governance-audit.service";

@Injectable()
export class RuntimeSloService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
    private readonly audit:
      RuntimeGovernanceAuditService,
  ) {}

  create(
    dto: CreateRuntimeSloDto,
  ): RuntimeSloDefinition {
    const duplicate =
      this.store
        .listSloDefinitions()
        .find(
          (slo) =>
            slo.key === dto.key &&
            slo.environment ===
              dto.environment &&
            slo.namespace ===
              dto.namespace &&
            slo.service ===
              dto.service,
        );

    if (duplicate) {
      throw new BadRequestException(
        `Runtime SLO already exists for key ${dto.key}`,
      );
    }

    const now =
      new Date().toISOString();

    const item:
      RuntimeSloDefinition = {
      id:
        randomUUID(),
      key:
        dto.key,
      name:
        dto.name,
      description:
        dto.description,
      environment:
        dto.environment,
      namespace:
        dto.namespace,
      service:
        dto.service,
      metric:
        dto.metric,
      target:
        dto.target,
      warningThreshold:
        dto.warningThreshold,
      breachThreshold:
        dto.breachThreshold,
      evaluationWindowMinutes:
        dto.evaluationWindowMinutes,
      enabled:
        dto.enabled,
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
    };

    const saved =
      this.store
        .saveSloDefinition(item);

    this.audit.append({
      type:
        GovernanceAuditEventType
          .SLO_REGISTERED,
      aggregateType:
        "runtime_slo_definition",
      aggregateId:
        saved.id,
      actor:
        dto.actor,
      payload: {
        sloId:
          saved.id,
        key:
          saved.key,
        environment:
          saved.environment,
        namespace:
          saved.namespace,
        service:
          saved.service,
        metric:
          saved.metric,
        target:
          saved.target,
        warningThreshold:
          saved.warningThreshold,
        breachThreshold:
          saved.breachThreshold,
        enabled:
          saved.enabled,
      },
    });

    return saved;
  }

  evaluate(
    id: string,
    dto: EvaluateRuntimeSloDto,
  ): RuntimeSloEvaluation {
    const slo =
      this.get(id);

    if (!slo.enabled) {
      throw new BadRequestException(
        "Runtime SLO is disabled",
      );
    }

    const status =
      this.resolveComplianceStatus(
        slo,
        dto.actualValue,
      );

    const breachPercentage =
      this.calculateBreachPercentage(
        slo.target,
        dto.actualValue,
      );

    const errorBudgetRemaining =
      clampGovernanceScore(
        100 -
        breachPercentage,
      );

    const item:
      RuntimeSloEvaluation = {
      id:
        randomUUID(),
      sloId:
        slo.id,
      actualValue:
        dto.actualValue,
      targetValue:
        slo.target,
      complianceStatus:
        status,
      errorBudgetRemaining,
      breachPercentage,
      observedAt:
        dto.observedAt ??
        new Date().toISOString(),
      evaluatedAt:
        new Date().toISOString(),
      metadata:
        (dto.metadata ?? {}) as Record<
          string,
          GovernanceJsonValue
        >,
    };

    const saved =
      this.store
        .saveSloEvaluation(item);

    this.audit.append({
      type:
        GovernanceAuditEventType
          .SLO_EVALUATED,
      aggregateType:
        "runtime_slo_evaluation",
      aggregateId:
        saved.id,
      actor: {
        id:
          "avos-slo-engine",
        type:
          "system",
        name:
          "AVOS Runtime SLO Engine",
        roles: [
          "runtime_governance",
          "slo_enforcement",
        ],
      },
      payload: {
        evaluationId:
          saved.id,
        sloId:
          saved.sloId,
        actualValue:
          saved.actualValue,
        targetValue:
          saved.targetValue,
        complianceStatus:
          saved.complianceStatus,
        errorBudgetRemaining:
          saved.errorBudgetRemaining,
        breachPercentage:
          saved.breachPercentage,
        observedAt:
          saved.observedAt,
      },
    });

    return saved;
  }

  listDefinitions():
    RuntimeSloDefinition[] {
    return this.store
      .listSloDefinitions();
  }

  listEvaluations():
    RuntimeSloEvaluation[] {
    return this.store
      .listSloEvaluations();
  }

  get(
    id: string,
  ): RuntimeSloDefinition {
    const item =
      this.store
        .getSloDefinition(id);

    if (!item) {
      throw new NotFoundException(
        `Runtime SLO ${id} was not found`,
      );
    }

    return item;
  }

  getServiceCompliance(
    environment: string,
    namespace: string,
    service: string,
  ): {
    environment: string;
    namespace: string;
    service: string;
    definitions: number;
    compliant: number;
    atRisk: number;
    breached: number;
    unknown: number;
    compliancePercentage: number;
    evaluatedAt: string;
  } {
    const definitions =
      this.listDefinitions()
        .filter(
          (slo) =>
            slo.environment ===
              environment &&
            slo.namespace ===
              namespace &&
            slo.service ===
              service &&
            slo.enabled,
        );

    const latestEvaluations =
      definitions
        .map((definition) => {
          const evaluation =
            this.listEvaluations()
              .filter(
                (item) =>
                  item.sloId ===
                  definition.id,
              )
              .sort(
                (a, b) =>
                  b.evaluatedAt.localeCompare(
                    a.evaluatedAt,
                  ),
              )[0];

          return {
            definition,
            evaluation,
          };
        });

    const compliant =
      latestEvaluations.filter(
        (item) =>
          item.evaluation?.complianceStatus ===
          SloComplianceStatus.COMPLIANT,
      ).length;

    const atRisk =
      latestEvaluations.filter(
        (item) =>
          item.evaluation?.complianceStatus ===
          SloComplianceStatus.AT_RISK,
      ).length;

    const breached =
      latestEvaluations.filter(
        (item) =>
          item.evaluation?.complianceStatus ===
          SloComplianceStatus.BREACHED,
      ).length;

    const unknown =
      latestEvaluations.filter(
        (item) =>
          !item.evaluation ||
          item.evaluation.complianceStatus ===
          SloComplianceStatus.UNKNOWN,
      ).length;

    const evaluatedCount =
      compliant +
      atRisk +
      breached;

    const compliancePercentage =
      evaluatedCount === 0
        ? 0
        : Math.round(
            compliant /
            evaluatedCount *
            100,
          );

    return {
      environment,
      namespace,
      service,
      definitions:
        definitions.length,
      compliant,
      atRisk,
      breached,
      unknown,
      compliancePercentage,
      evaluatedAt:
        new Date().toISOString(),
    };
  }

  private resolveComplianceStatus(
    slo: RuntimeSloDefinition,
    actualValue: number,
  ): SloComplianceStatus {
    const higherIsBetter =
      slo.target >=
      slo.breachThreshold;

    if (higherIsBetter) {
      if (
        actualValue >=
        slo.target
      ) {
        return SloComplianceStatus.COMPLIANT;
      }

      if (
        actualValue >=
        slo.warningThreshold
      ) {
        return SloComplianceStatus.AT_RISK;
      }

      return SloComplianceStatus.BREACHED;
    }

    if (
      actualValue <=
      slo.target
    ) {
      return SloComplianceStatus.COMPLIANT;
    }

    if (
      actualValue <=
      slo.warningThreshold
    ) {
      return SloComplianceStatus.AT_RISK;
    }

    return SloComplianceStatus.BREACHED;
  }

  private calculateBreachPercentage(
    target: number,
    actual: number,
  ): number {
    if (
      target === 0
    ) {
      return actual === 0
        ? 0
        : 100;
    }

    return clampGovernanceScore(
      Math.abs(
        actual - target,
      ) /
      Math.abs(target) *
      100,
    );
  }
}
