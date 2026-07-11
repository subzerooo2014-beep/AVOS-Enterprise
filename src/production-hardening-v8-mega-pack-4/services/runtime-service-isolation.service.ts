import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GovernanceAuditEventType,
  GovernanceJsonValue,
  IsolationPlanStatus,
  IsolationStrategy,
  ServiceIsolationPlan,
  ServiceIsolationRule,
} from "../contracts";
import {
  CreateIsolationPlanDto,
  UpdateIsolationPlanStatusDto,
} from "../dto";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  RuntimeGovernanceAuditService,
} from "./runtime-governance-audit.service";

@Injectable()
export class RuntimeServiceIsolationService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
    private readonly audit:
      RuntimeGovernanceAuditService,
  ) {}

  create(
    dto: CreateIsolationPlanDto,
  ): ServiceIsolationPlan {
    const source =
      this.store.getDependencyNode(
        dto.sourceNodeId,
      );

    if (!source) {
      throw new NotFoundException(
        `Dependency node ${dto.sourceNodeId} was not found`,
      );
    }

    const rules:
      ServiceIsolationRule[] =
      dto.rules.map((rule) => {
        if (
          !this.store.getDependencyNode(
            rule.nodeId,
          )
        ) {
          throw new NotFoundException(
            `Isolation rule node ${rule.nodeId} was not found`,
          );
        }

        return {
          id:
            randomUUID(),
          nodeId:
            rule.nodeId,
          strategy:
            rule.strategy,
          trafficPercentage:
            rule.trafficPercentage,
          blockIncomingTraffic:
            rule.blockIncomingTraffic,
          blockOutgoingTraffic:
            rule.blockOutgoingTraffic,
          pauseBackgroundJobs:
            rule.pauseBackgroundJobs,
          disableDependencies:
            rule.disableDependencies ?? [],
          preserveDependencies:
            rule.preserveDependencies ?? [],
          reason:
            rule.reason,
          metadata:
            (rule.metadata ?? {}) as Record<
              string,
              GovernanceJsonValue
            >,
        };
      });

    const affectedNodeIds =
      Array.from(
        new Set(
          [
            dto.sourceNodeId,
            ...rules.map(
              (rule) => rule.nodeId,
            ),
          ],
        ),
      );

    const affectedServices =
      Array.from(
        new Set(
          affectedNodeIds
            .map(
              (nodeId) =>
                this.store
                  .getDependencyNode(
                    nodeId,
                  )?.service,
            )
            .filter(
              (
                service,
              ): service is string =>
                Boolean(service),
            ),
        ),
      );

    const now =
      new Date().toISOString();

    const plan:
      ServiceIsolationPlan = {
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
      sourceNodeId:
        dto.sourceNodeId,
      status:
        IsolationPlanStatus.READY,
      strategy:
        dto.strategy,
      riskLevel:
        dto.riskLevel,
      affectedNodeIds,
      affectedServices,
      rules,
      recommendations:
        this.buildRecommendations(
          dto.strategy,
          rules,
        ),
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
      this.store.saveIsolationPlan(
        plan,
      );

    this.audit.append({
      type:
        GovernanceAuditEventType
          .DEPENDENCY_HEALTH_UPDATED,
      aggregateType:
        "service_isolation_plan",
      aggregateId:
        saved.id,
      actor:
        dto.actor,
      payload: {
        isolationPlanId:
          saved.id,
        strategy:
          saved.strategy,
        status:
          saved.status,
        affectedNodeIds:
          saved.affectedNodeIds,
        affectedServices:
          saved.affectedServices,
      },
    });

    return saved;
  }

  list():
    ServiceIsolationPlan[] {
    return this.store
      .listIsolationPlans();
  }

  get(
    id: string,
  ): ServiceIsolationPlan {
    const plan =
      this.store.getIsolationPlan(id);

    if (!plan) {
      throw new NotFoundException(
        `Isolation plan ${id} was not found`,
      );
    }

    return plan;
  }

  updateStatus(
    id: string,
    dto:
      UpdateIsolationPlanStatusDto,
  ): ServiceIsolationPlan {
    const plan =
      this.get(id);

    this.validateTransition(
      plan.status,
      dto.status,
    );

    const now =
      new Date().toISOString();

    plan.status =
      dto.status;

    plan.updatedAt =
      now;

    if (
      dto.status ===
      IsolationPlanStatus.ACTIVE
    ) {
      plan.activatedAt =
        now;
    }

    if (
      dto.status ===
      IsolationPlanStatus.COMPLETED
    ) {
      plan.completedAt =
        now;
    }

    if (
      dto.status ===
      IsolationPlanStatus.CANCELLED
    ) {
      plan.cancelledAt =
        now;
    }

    if (
      dto.status ===
      IsolationPlanStatus.FAILED
    ) {
      plan.failedAt =
        now;

      plan.error =
        dto.reason;
    }

    return this.store
      .saveIsolationPlan(plan);
  }

  private buildRecommendations(
    strategy: IsolationStrategy,
    rules: ServiceIsolationRule[],
  ): string[] {
    const recommendations:
      string[] = [];

    if (
      strategy ===
      IsolationStrategy.FULL
    ) {
      recommendations.push(
        "Notify all dependent service owners before activation",
      );

      recommendations.push(
        "Validate fallback paths before full isolation",
      );
    }

    if (
      rules.some(
        (rule) =>
          rule.trafficPercentage >= 80,
      )
    ) {
      recommendations.push(
        "Enable enhanced traffic monitoring",
      );
    }

    if (
      rules.some(
        (rule) =>
          rule.pauseBackgroundJobs,
      )
    ) {
      recommendations.push(
        "Prepare controlled job resumption sequence",
      );
    }

    if (
      recommendations.length === 0
    ) {
      recommendations.push(
        "Proceed with standard isolation monitoring",
      );
    }

    return recommendations;
  }

  private validateTransition(
    current: IsolationPlanStatus,
    next: IsolationPlanStatus,
  ): void {
    if (current === next) {
      return;
    }

    const transitions:
      Record<
        IsolationPlanStatus,
        IsolationPlanStatus[]
      > = {
      [IsolationPlanStatus.DRAFT]: [
        IsolationPlanStatus.READY,
        IsolationPlanStatus.CANCELLED,
      ],
      [IsolationPlanStatus.READY]: [
        IsolationPlanStatus.ACTIVE,
        IsolationPlanStatus.CANCELLED,
      ],
      [IsolationPlanStatus.ACTIVE]: [
        IsolationPlanStatus.COMPLETED,
        IsolationPlanStatus.FAILED,
        IsolationPlanStatus.CANCELLED,
      ],
      [IsolationPlanStatus.COMPLETED]: [],
      [IsolationPlanStatus.CANCELLED]: [],
      [IsolationPlanStatus.FAILED]: [
        IsolationPlanStatus.READY,
        IsolationPlanStatus.CANCELLED,
      ],
    };

    if (
      !transitions[current].includes(next)
    ) {
      throw new BadRequestException(
        `Invalid isolation plan transition from ${current} to ${next}`,
      );
    }
  }
}
