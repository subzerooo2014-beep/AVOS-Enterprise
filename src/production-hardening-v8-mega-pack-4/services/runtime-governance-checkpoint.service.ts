import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GovernanceCheckpoint,
  GovernanceCheckpointStatus,
  GovernanceCheckpointVerification,
} from "../contracts";
import {
  CreateGovernanceCheckpointDto,
} from "../dto";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  governanceSha256Json,
} from "../utils";
import {
  RuntimeGovernanceSnapshotBuilderService,
} from "./runtime-governance-snapshot-builder.service";

@Injectable()
export class RuntimeGovernanceCheckpointService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
    private readonly snapshots:
      RuntimeGovernanceSnapshotBuilderService,
  ) {}

  create(
    dto:
      CreateGovernanceCheckpointDto,
  ): GovernanceCheckpoint {
    let previousCheckpoint:
      GovernanceCheckpoint | undefined;

    if (
      dto.previousCheckpointId
    ) {
      previousCheckpoint =
        this.get(
          dto.previousCheckpointId,
        );

      if (
        previousCheckpoint.status ===
          GovernanceCheckpointStatus.INVALID ||
        previousCheckpoint.status ===
          GovernanceCheckpointStatus.DELETED
      ) {
        throw new BadRequestException(
          "Previous checkpoint is not valid for chaining",
        );
      }
    }

    const sections =
      this.snapshots.build(
        dto.scope,
      );

    const checkpoint:
      GovernanceCheckpoint = {
      id:
        randomUUID(),
      checkpointNumber:
        this.nextCheckpointNumber(),
      key:
        dto.key,
      name:
        dto.name,
      description:
        dto.description,
      type:
        dto.type,
      status:
        GovernanceCheckpointStatus.CREATED,
      scope:
        dto.scope,
      environment:
        dto.environment,
      namespace:
        dto.namespace,
      service:
        dto.service,
      governanceRequestId:
        dto.governanceRequestId,
      changeExecutionId:
        dto.changeExecutionId,
      recoveryPlanId:
        dto.recoveryPlanId,
      sections,
      rootChecksum:
        this.snapshots.rootChecksum(
          sections,
        ),
      previousCheckpointId:
        previousCheckpoint?.id,
      previousCheckpointChecksum:
        previousCheckpoint
          ?.rootChecksum,
      metadata:
        (dto.metadata ?? {}) as Record<
          string,
          import("../contracts").GovernanceJsonValue
        >,
      createdBy:
        dto.actor,
      createdAt:
        new Date().toISOString(),
      expiresAt:
        dto.expiresAt,
    };

    return this.store
      .saveGovernanceCheckpoint(
        checkpoint,
      );
  }

  verify(
    id: string,
  ): GovernanceCheckpointVerification {
    const checkpoint =
      this.get(id);

    const invalidSections:
      string[] = [];

    for (
      const section of
      checkpoint.sections
    ) {
      const actualChecksum =
        governanceSha256Json(
          section.data,
        );

      if (
        actualChecksum !==
        section.checksum
      ) {
        invalidSections.push(
          section.key,
        );
      }
    }

    const actualRootChecksum =
      this.snapshots.rootChecksum(
        checkpoint.sections,
      );

    const valid =
      invalidSections.length === 0 &&
      actualRootChecksum ===
        checkpoint.rootChecksum;

    checkpoint.status =
      valid
        ? GovernanceCheckpointStatus.VERIFIED
        : GovernanceCheckpointStatus.INVALID;

    checkpoint.verifiedAt =
      new Date().toISOString();

    checkpoint.invalidReason =
      valid
        ? undefined
        : `Invalid sections: ${invalidSections.join(", ")}`;

    this.store
      .saveGovernanceCheckpoint(
        checkpoint,
      );

    return {
      checkpointId:
        checkpoint.id,
      valid,
      checkedSections:
        checkpoint.sections.length,
      invalidSections,
      expectedRootChecksum:
        checkpoint.rootChecksum,
      actualRootChecksum,
      verifiedAt:
        checkpoint.verifiedAt,
    };
  }

  markRestoreReady(
    id: string,
  ): GovernanceCheckpoint {
    const checkpoint =
      this.get(id);

    if (
      checkpoint.status !==
      GovernanceCheckpointStatus.VERIFIED
    ) {
      throw new BadRequestException(
        "Only verified checkpoints can become restore ready",
      );
    }

    checkpoint.status =
      GovernanceCheckpointStatus.RESTORE_READY;

    return this.store
      .saveGovernanceCheckpoint(
        checkpoint,
      );
  }

  list():
    GovernanceCheckpoint[] {
    this.expireCheckpoints();

    return this.store
      .listGovernanceCheckpoints();
  }

  get(
    id: string,
  ): GovernanceCheckpoint {
    const checkpoint =
      this.store
        .getGovernanceCheckpoint(id);

    if (!checkpoint) {
      throw new NotFoundException(
        `Governance checkpoint ${id} was not found`,
      );
    }

    return checkpoint;
  }

  private expireCheckpoints():
    void {
    const now =
      Date.now();

    for (
      const checkpoint of
      this.store
        .listGovernanceCheckpoints()
    ) {
      if (
        checkpoint.expiresAt &&
        ![
          GovernanceCheckpointStatus.RESTORED,
          GovernanceCheckpointStatus.ARCHIVED,
          GovernanceCheckpointStatus.DELETED,
          GovernanceCheckpointStatus.EXPIRED,
        ].includes(
          checkpoint.status,
        ) &&
        new Date(
          checkpoint.expiresAt,
        ).getTime() <= now
      ) {
        checkpoint.status =
          GovernanceCheckpointStatus.EXPIRED;

        this.store
          .saveGovernanceCheckpoint(
            checkpoint,
          );
      }
    }
  }

  private nextCheckpointNumber():
    string {
    const next =
      this.store
        .listGovernanceCheckpoints()
        .length + 1;

    return `AVOS-CHK-${String(
      next,
    ).padStart(6, "0")}`;
  }
}

