import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GovernanceArchiveStatus,
  GovernanceCheckpointStatus,
  GovernanceRestorePlan,
  GovernanceRestoreStatus,
  GovernanceSnapshotSection,
  RuntimeChangeValidation,
} from "../contracts";
import {
  CreateGovernanceRestorePlanDto,
  ExecuteGovernanceRestorePlanDto,
} from "../dto";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  RuntimeGovernanceArchiveService,
} from "./runtime-governance-archive.service";
import {
  RuntimeGovernanceCheckpointService,
} from "./runtime-governance-checkpoint.service";

@Injectable()
export class RuntimeGovernanceRestoreService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
    private readonly archives:
      RuntimeGovernanceArchiveService,
    private readonly checkpoints:
      RuntimeGovernanceCheckpointService,
  ) {}

  create(
    dto:
      CreateGovernanceRestorePlanDto,
  ): GovernanceRestorePlan {
    if (
      !dto.archiveId &&
      !dto.checkpointId
    ) {
      throw new BadRequestException(
        "Restore plan requires archiveId or checkpointId",
      );
    }

    if (
      dto.archiveId &&
      dto.checkpointId
    ) {
      throw new BadRequestException(
        "Restore plan cannot use archiveId and checkpointId together",
      );
    }

    let sections:
      GovernanceSnapshotSection[] = [];

    if (
      dto.archiveId
    ) {
      const archive =
        this.archives.get(
          dto.archiveId,
        );

      sections =
        archive.sections;
    }

    if (
      dto.checkpointId
    ) {
      const checkpoint =
        this.checkpoints.get(
          dto.checkpointId,
        );

      sections =
        checkpoint.sections;
    }

    const now =
      new Date().toISOString();

    const plan:
      GovernanceRestorePlan = {
      id:
        randomUUID(),
      restoreNumber:
        this.nextRestoreNumber(),
      name:
        dto.name,
      description:
        dto.description,
      status:
        GovernanceRestoreStatus.DRAFT,
      archiveId:
        dto.archiveId,
      checkpointId:
        dto.checkpointId,
      environment:
        dto.environment,
      namespace:
        dto.namespace,
      service:
        dto.service,
      targetScope:
        dto.targetScope,
      dryRun:
        dto.dryRun,
      validations:
        [],
      restoreSections:
        dto.restoreSections ??
        sections.map(
          (section) =>
            section.key,
        ),
      conflictStrategy:
        dto.conflictStrategy,
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
    };

    return this.store
      .saveGovernanceRestorePlan(
        plan,
      );
  }

  validate(
    id: string,
  ): GovernanceRestorePlan {
    const plan =
      this.get(id);

    plan.status =
      GovernanceRestoreStatus.VALIDATING;

    const validations:
      RuntimeChangeValidation[] = [];

    const source =
      this.resolveSource(plan);

    validations.push(
      this.validation(
        "source_status",
        "Restore source is verified",
        source.verified,
        true,
        true,
        source.verified,
        "Restore source must be verified",
      ),
    );

    validations.push(
      this.validation(
        "restore_sections",
        "Restore sections exist",
        plan.restoreSections.length > 0,
        true,
        true,
        plan.restoreSections.length > 0,
        "Restore plan requires at least one section",
      ),
    );

    validations.push(
      this.validation(
        "source_sections_available",
        "Requested sections exist in source",
        plan.restoreSections.every(
          (section) =>
            source.sections.some(
              (item) =>
                item.key === section,
            ),
        ),
        true,
        true,
        plan.restoreSections.every(
          (section) =>
            source.sections.some(
              (item) =>
                item.key === section,
            ),
        ),
        "Every requested restore section must exist",
      ),
    );

    plan.validations =
      validations;

    const blocked =
      validations.some(
        (item) =>
          item.blocking &&
          !item.success,
      );

    plan.status =
      blocked
        ? GovernanceRestoreStatus.BLOCKED
        : GovernanceRestoreStatus.READY;

    plan.validatedAt =
      new Date().toISOString();

    plan.updatedAt =
      plan.validatedAt;

    return this.store
      .saveGovernanceRestorePlan(
        plan,
      );
  }

  execute(
    id: string,
    dto:
      ExecuteGovernanceRestorePlanDto,
  ): GovernanceRestorePlan {
    let plan =
      this.get(id);

    if (
      plan.status ===
      GovernanceRestoreStatus.DRAFT
    ) {
      plan =
        this.validate(id);
    }

    if (
      plan.status !==
      GovernanceRestoreStatus.READY
    ) {
      throw new BadRequestException(
        `Restore plan is not ready. Current status: ${plan.status}`,
      );
    }

    if (
      !plan.dryRun &&
      dto.confirmExecution !== true
    ) {
      throw new BadRequestException(
        "Non-dry-run restore requires confirmExecution=true",
      );
    }

    plan.status =
      GovernanceRestoreStatus.EXECUTING;

    plan.startedAt =
      new Date().toISOString();

    plan.updatedAt =
      plan.startedAt;

    plan =
      this.store
        .saveGovernanceRestorePlan(
          plan,
        );

    try {
      const source =
        this.resolveSource(
          plan,
        );

      const selectedSections =
        source.sections.filter(
          (section) =>
            plan.restoreSections
              .includes(
                section.key,
              ),
        );

      plan.metadata = {
        ...plan.metadata,
        restoredSectionCount:
          selectedSections.length,
        restoredRecordCount:
          selectedSections.reduce(
            (
              total,
              section,
            ) =>
              total +
              section.count,
            0,
          ),
        dryRun:
          plan.dryRun,
        conflictStrategy:
          plan.conflictStrategy,
        runtimeContext:
          (dto.runtimeContext ?? {}) as Record<
            string,
            import("../contracts").GovernanceJsonValue
          >,
      };

      plan.status =
        GovernanceRestoreStatus.SUCCEEDED;

      plan.completedAt =
        new Date().toISOString();

      plan.updatedAt =
        plan.completedAt;

      if (
        plan.archiveId
      ) {
        const archive =
          this.archives.get(
            plan.archiveId,
          );

        archive.status =
          GovernanceArchiveStatus.RESTORED;

        archive.restoredAt =
          plan.completedAt;

        this.store
          .saveGovernanceArchive(
            archive,
          );
      }

      if (
        plan.checkpointId
      ) {
        const checkpoint =
          this.checkpoints.get(
            plan.checkpointId,
          );

        checkpoint.status =
          GovernanceCheckpointStatus.RESTORED;

        checkpoint.restoredAt =
          plan.completedAt;

        this.store
          .saveGovernanceCheckpoint(
            checkpoint,
          );
      }

      return this.store
        .saveGovernanceRestorePlan(
          plan,
        );
    } catch (error) {
      plan.status =
        GovernanceRestoreStatus.FAILED;

      plan.failedAt =
        new Date().toISOString();

      plan.updatedAt =
        plan.failedAt;

      plan.error =
        error instanceof Error
          ? error.message
          : "Unknown restore failure";

      return this.store
        .saveGovernanceRestorePlan(
          plan,
        );
    }
  }

  list():
    GovernanceRestorePlan[] {
    return this.store
      .listGovernanceRestorePlans();
  }

  get(
    id: string,
  ): GovernanceRestorePlan {
    const plan =
      this.store
        .getGovernanceRestorePlan(id);

    if (!plan) {
      throw new NotFoundException(
        `Governance restore plan ${id} was not found`,
      );
    }

    return plan;
  }

  private resolveSource(
    plan:
      GovernanceRestorePlan,
  ): {
    verified: boolean;
    sections:
      GovernanceSnapshotSection[];
  } {
    if (
      plan.archiveId
    ) {
      const archive =
        this.archives.get(
          plan.archiveId,
        );

      return {
        verified:
          archive.status ===
          GovernanceArchiveStatus.VERIFIED,
        sections:
          archive.sections,
      };
    }

    if (
      plan.checkpointId
    ) {
      const checkpoint =
        this.checkpoints.get(
          plan.checkpointId,
        );

      return {
        verified:
          [
            GovernanceCheckpointStatus.VERIFIED,
            GovernanceCheckpointStatus.RESTORE_READY,
          ].includes(
            checkpoint.status,
          ),
        sections:
          checkpoint.sections,
      };
    }

    throw new BadRequestException(
      "Restore source is missing",
    );
  }

  private validation(
    key: string,
    name: string,
    success: boolean,
    blocking: boolean,
    expected: boolean,
    actual: boolean,
    reason: string,
  ): RuntimeChangeValidation {
    return {
      id:
        randomUUID(),
      key,
      name,
      success,
      blocking,
      expected,
      actual,
      reason,
      checkedAt:
        new Date().toISOString(),
    };
  }

  private nextRestoreNumber():
    string {
    const next =
      this.store
        .listGovernanceRestorePlans()
        .length + 1;

    return `AVOS-RST-${String(
      next,
    ).padStart(6, "0")}`;
  }
}

