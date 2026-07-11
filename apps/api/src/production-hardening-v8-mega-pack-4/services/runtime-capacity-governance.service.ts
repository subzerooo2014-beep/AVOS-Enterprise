import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  CapacityDecision,
  CapacityEvaluationStatus,
  CapacityPolicyStatus,
  GovernanceAuditEventType,
  GovernanceJsonValue,
  RuntimeCapacityEvaluation,
  RuntimeCapacityPolicy,
} from "../contracts";
import {
  CreateCapacityPolicyDto,
  EvaluateCapacityPolicyDto,
} from "../dto";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  RuntimeGovernanceAuditService,
} from "./runtime-governance-audit.service";

@Injectable()
export class RuntimeCapacityGovernanceService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
    private readonly audit:
      RuntimeGovernanceAuditService,
  ) {}

  create(
    dto: CreateCapacityPolicyDto,
  ): RuntimeCapacityPolicy {
    if (
      dto.maximumInstances <
      dto.minimumInstances
    ) {
      throw new BadRequestException(
        "Maximum instances must be greater than or equal to minimum instances",
      );
    }

    const duplicate =
      this.store
        .listCapacityPolicies()
        .find(
          (policy) =>
            policy.key === dto.key &&
            policy.environment ===
              dto.environment &&
            policy.namespace ===
              dto.namespace &&
            policy.service ===
              dto.service,
        );

    if (duplicate) {
      throw new BadRequestException(
        `Capacity policy already exists for key ${dto.key}`,
      );
    }

    const now =
      new Date().toISOString();

    const policy:
      RuntimeCapacityPolicy = {
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
      metricType:
        dto.metricType,
      metricName:
        dto.metricName,
      status:
        CapacityPolicyStatus.ACTIVE,
      thresholds:
        dto.thresholds,
      minimumInstances:
        dto.minimumInstances,
      maximumInstances:
        dto.maximumInstances,
      scaleStep:
        dto.scaleStep,
      cooldownSeconds:
        dto.cooldownSeconds,
      allowAutomaticScaling:
        dto.allowAutomaticScaling,
      blockChangesWhenCritical:
        dto.blockChangesWhenCritical,
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

    const saved =
      this.store.saveCapacityPolicy(
        policy,
      );

    this.audit.append({
      type:
        GovernanceAuditEventType
          .SLO_REGISTERED,
      aggregateType:
        "runtime_capacity_policy",
      aggregateId:
        saved.id,
      actor:
        dto.actor,
      payload: {
        capacityPolicyId:
          saved.id,
        key:
          saved.key,
        service:
          saved.service,
        metricType:
          saved.metricType,
        metricName:
          saved.metricName,
        status:
          saved.status,
        minimumInstances:
          saved.minimumInstances,
        maximumInstances:
          saved.maximumInstances,
      },
    });

    return saved;
  }

  evaluate(
    id: string,
    dto:
      EvaluateCapacityPolicyDto,
  ): RuntimeCapacityEvaluation {
    const policy =
      this.get(id);

    if (
      policy.status !==
      CapacityPolicyStatus.ACTIVE
    ) {
      throw new BadRequestException(
        "Capacity policy is not active",
      );
    }

    let status =
      CapacityEvaluationStatus.HEALTHY;

    let decision =
      CapacityDecision.NO_ACTION;

    let recommendedInstances =
      dto.currentInstances;

    let reason =
      "Capacity is within policy limits";

    if (
      dto.actualValue >=
      policy.thresholds.critical
    ) {
      status =
        CapacityEvaluationStatus.CRITICAL;

      if (
        policy.allowAutomaticScaling &&
        dto.currentInstances <
          policy.maximumInstances
      ) {
        decision =
          CapacityDecision.SCALE_OUT;

        recommendedInstances =
          Math.min(
            policy.maximumInstances,
            dto.currentInstances +
            policy.scaleStep,
          );

        reason =
          "Critical capacity threshold exceeded";
      } else if (
        policy.blockChangesWhenCritical
      ) {
        decision =
          CapacityDecision.BLOCK_CHANGE;

        reason =
          "Critical capacity threshold exceeded and changes are blocked";
      } else {
        decision =
          CapacityDecision.ALERT;

        reason =
          "Critical capacity threshold exceeded";
      }
    } else if (
      dto.actualValue >=
      policy.thresholds.scaleOut
    ) {
      status =
        CapacityEvaluationStatus.WARNING;

      if (
        policy.allowAutomaticScaling &&
        dto.currentInstances <
          policy.maximumInstances
      ) {
        decision =
          CapacityDecision.SCALE_OUT;

        recommendedInstances =
          Math.min(
            policy.maximumInstances,
            dto.currentInstances +
            policy.scaleStep,
          );

        reason =
          "Scale-out threshold exceeded";
      } else {
        decision =
          CapacityDecision.ALERT;

        reason =
          "Scale-out threshold exceeded";
      }
    } else if (
      policy.thresholds.scaleIn !==
        undefined &&
      dto.actualValue <=
        policy.thresholds.scaleIn &&
      dto.currentInstances >
        policy.minimumInstances
    ) {
      decision =
        CapacityDecision.SCALE_IN;

      recommendedInstances =
        Math.max(
          policy.minimumInstances,
          dto.currentInstances -
          policy.scaleStep,
        );

      reason =
        "Scale-in threshold reached";
    } else if (
      dto.actualValue >=
      policy.thresholds.warning
    ) {
      status =
        CapacityEvaluationStatus.WARNING;

      decision =
        CapacityDecision.ALERT;

      reason =
        "Warning capacity threshold exceeded";
    }

    const evaluation:
      RuntimeCapacityEvaluation = {
      id:
        randomUUID(),
      policyId:
        policy.id,
      service:
        policy.service,
      metricType:
        policy.metricType,
      metricName:
        policy.metricName,
      actualValue:
        dto.actualValue,
      currentInstances:
        dto.currentInstances,
      status,
      decision,
      recommendedInstances,
      reason,
      metadata:
        (dto.metadata ?? {}) as Record<
          string,
          GovernanceJsonValue
        >,
      observedAt:
        dto.observedAt ??
        new Date().toISOString(),
      evaluatedAt:
        new Date().toISOString(),
    };

    policy.lastEvaluationAt =
      evaluation.evaluatedAt;

    if (
      decision !==
      CapacityDecision.NO_ACTION
    ) {
      policy.lastActionAt =
        evaluation.evaluatedAt;
    }

    policy.updatedAt =
      evaluation.evaluatedAt;

    this.store.saveCapacityPolicy(
      policy,
    );

    const saved =
      this.store.saveCapacityEvaluation(
        evaluation,
      );

    this.audit.append({
      type:
        GovernanceAuditEventType
          .SLO_EVALUATED,
      aggregateType:
        "runtime_capacity_evaluation",
      aggregateId:
        saved.id,
      actor: {
        id:
          "avos-capacity-governance",
        type:
          "system",
        name:
          "AVOS Capacity Governance",
        roles: [
          "runtime_governance",
          "capacity_management",
        ],
      },
      payload: {
        capacityEvaluationId:
          saved.id,
        policyId:
          saved.policyId,
        service:
          saved.service,
        actualValue:
          saved.actualValue,
        currentInstances:
          saved.currentInstances,
        status:
          saved.status,
        decision:
          saved.decision,
        recommendedInstances:
          saved.recommendedInstances,
      },
    });

    return saved;
  }

  listPolicies():
    RuntimeCapacityPolicy[] {
    return this.store
      .listCapacityPolicies();
  }

  listEvaluations():
    RuntimeCapacityEvaluation[] {
    return this.store
      .listCapacityEvaluations();
  }

  get(
    id: string,
  ): RuntimeCapacityPolicy {
    const policy =
      this.store.getCapacityPolicy(id);

    if (!policy) {
      throw new NotFoundException(
        `Capacity policy ${id} was not found`,
      );
    }

    return policy;
  }
}
