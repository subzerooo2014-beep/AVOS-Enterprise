import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GovernanceArchiveType,
  GovernanceDataClassification,
  GovernanceRetentionAction,
  GovernanceRetentionEvaluation,
  GovernanceRetentionPolicy,
  GovernanceRetentionStatus,
} from "../contracts";
import {
  CreateGovernanceRetentionPolicyDto,
  UpdateGovernanceRetentionPolicyStatusDto,
} from "../dto";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";

@Injectable()
export class RuntimeGovernanceRetentionService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
  ) {}

  create(
    dto:
      CreateGovernanceRetentionPolicyDto,
  ): GovernanceRetentionPolicy {
    const duplicate =
      this.store
        .listGovernanceRetentionPolicies()
        .find(
          (policy) =>
            policy.key === dto.key &&
            policy.status !==
              GovernanceRetentionStatus.ARCHIVED,
        );

    if (duplicate) {
      throw new BadRequestException(
        `Retention policy already exists for key ${dto.key}`,
      );
    }

    const now =
      new Date().toISOString();

    const policy:
      GovernanceRetentionPolicy = {
      id:
        randomUUID(),
      key:
        dto.key,
      name:
        dto.name,
      description:
        dto.description,
      status:
        GovernanceRetentionStatus.ACTIVE,
      archiveTypes:
        dto.archiveTypes,
      classifications:
        dto.classifications,
      retentionDays:
        dto.retentionDays,
      archiveAfterDays:
        dto.archiveAfterDays,
      compressAfterDays:
        dto.compressAfterDays,
      redactAfterDays:
        dto.redactAfterDays,
      deleteAfterDays:
        dto.deleteAfterDays,
      legalHold:
        dto.legalHold,
      immutable:
        dto.immutable,
      environment:
        dto.environment,
      namespace:
        dto.namespace,
      metadata:
        (dto.metadata ?? {}) as Record<
          string,
          import("../contracts").GovernanceJsonValue
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
      .saveGovernanceRetentionPolicy(
        policy,
      );
  }

  evaluate(input: {
    policyId: string;
    resourceType:
      GovernanceArchiveType;
    resourceId: string;
    resourceCreatedAt: string;
    classification:
      GovernanceDataClassification;
  }): GovernanceRetentionEvaluation {
    const policy =
      this.get(
        input.policyId,
      );

    if (
      policy.status !==
      GovernanceRetentionStatus.ACTIVE
    ) {
      throw new BadRequestException(
        "Retention policy is not active",
      );
    }

    const ageMilliseconds =
      Date.now() -
      new Date(
        input.resourceCreatedAt,
      ).getTime();

    const resourceAgeDays =
      Math.max(
        0,
        Math.floor(
          ageMilliseconds /
          86400000,
        ),
      );

    let action =
      GovernanceRetentionAction.RETAIN;

    let reason =
      "Resource remains within retention period";

    if (
      policy.legalHold
    ) {
      action =
        GovernanceRetentionAction.LEGAL_HOLD;

      reason =
        "Retention policy has legal hold enabled";
    } else if (
      policy.deleteAfterDays !==
        undefined &&
      resourceAgeDays >=
        policy.deleteAfterDays
    ) {
      action =
        GovernanceRetentionAction.DELETE;

      reason =
        "Resource reached deletion age";
    } else if (
      policy.redactAfterDays !==
        undefined &&
      resourceAgeDays >=
        policy.redactAfterDays
    ) {
      action =
        GovernanceRetentionAction.REDACT;

      reason =
        "Resource reached redaction age";
    } else if (
      policy.compressAfterDays !==
        undefined &&
      resourceAgeDays >=
        policy.compressAfterDays
    ) {
      action =
        GovernanceRetentionAction.COMPRESS;

      reason =
        "Resource reached compression age";
    } else if (
      policy.archiveAfterDays !==
        undefined &&
      resourceAgeDays >=
        policy.archiveAfterDays
    ) {
      action =
        GovernanceRetentionAction.ARCHIVE;

      reason =
        "Resource reached archive age";
    }

    const evaluation:
      GovernanceRetentionEvaluation = {
      id:
        randomUUID(),
      policyId:
        policy.id,
      resourceType:
        input.resourceType,
      resourceId:
        input.resourceId,
      resourceCreatedAt:
        input.resourceCreatedAt,
      resourceAgeDays,
      classification:
        input.classification,
      action,
      reason,
      evaluatedAt:
        new Date().toISOString(),
    };

    return this.store
      .saveGovernanceRetentionEvaluation(
        evaluation,
      );
  }

  updateStatus(
    id: string,
    dto:
      UpdateGovernanceRetentionPolicyStatusDto,
  ): GovernanceRetentionPolicy {
    const policy =
      this.get(id);

    const now =
      new Date().toISOString();

    policy.status =
      dto.status;

    policy.updatedAt =
      now;

    if (
      dto.status ===
      GovernanceRetentionStatus.ACTIVE
    ) {
      policy.activatedAt =
        now;
    }

    if (
      dto.status ===
      GovernanceRetentionStatus.DISABLED
    ) {
      policy.disabledAt =
        now;
    }

    if (
      dto.status ===
      GovernanceRetentionStatus.ARCHIVED
    ) {
      policy.archivedAt =
        now;
    }

    policy.metadata = {
      ...policy.metadata,
      lastStatusReason:
        dto.reason,
      lastStatusActorId:
        dto.actor.id,
    };

    return this.store
      .saveGovernanceRetentionPolicy(
        policy,
      );
  }

  list():
    GovernanceRetentionPolicy[] {
    return this.store
      .listGovernanceRetentionPolicies();
  }

  listEvaluations():
    GovernanceRetentionEvaluation[] {
    return this.store
      .listGovernanceRetentionEvaluations();
  }

  get(
    id: string,
  ): GovernanceRetentionPolicy {
    const policy =
      this.store
        .getGovernanceRetentionPolicy(
          id,
        );

    if (!policy) {
      throw new NotFoundException(
        `Governance retention policy ${id} was not found`,
      );
    }

    return policy;
  }
}

