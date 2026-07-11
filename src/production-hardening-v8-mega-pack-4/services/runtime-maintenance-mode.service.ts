import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GovernanceAuditEventType,
  GovernanceJsonValue,
  GovernanceMaintenanceMode,
  MaintenanceModeStatus,
} from "../contracts";
import {
  CreateMaintenanceModeDto,
  UpdateMaintenanceModeStatusDto,
} from "../dto";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  RuntimeGovernanceAuditService,
} from "./runtime-governance-audit.service";

@Injectable()
export class RuntimeMaintenanceModeService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
    private readonly audit:
      RuntimeGovernanceAuditService,
  ) {}

  create(
    dto:
      CreateMaintenanceModeDto,
  ): GovernanceMaintenanceMode {
    const startsAt =
      new Date(dto.startsAt);

    const endsAt =
      dto.endsAt
        ? new Date(dto.endsAt)
        : undefined;

    if (
      Number.isNaN(
        startsAt.getTime(),
      )
    ) {
      throw new BadRequestException(
        "Invalid maintenance start date",
      );
    }

    if (
      endsAt &&
      (
        Number.isNaN(
          endsAt.getTime(),
        ) ||
        endsAt.getTime() <=
          startsAt.getTime()
      )
    ) {
      throw new BadRequestException(
        "Maintenance end must be after start",
      );
    }

    const activeConflict =
      this.store
        .listMaintenanceModes()
        .find(
          (mode) =>
            mode.environment ===
              dto.environment &&
            mode.namespace ===
              dto.namespace &&
            [
              MaintenanceModeStatus
                .SCHEDULED,
              MaintenanceModeStatus
                .ACTIVE,
            ].includes(mode.status),
        );

    if (activeConflict) {
      throw new BadRequestException(
        `Maintenance mode already exists for ${dto.environment}/${dto.namespace}`,
      );
    }

    const now =
      new Date().toISOString();

    const item:
      GovernanceMaintenanceMode = {
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
      status:
        MaintenanceModeStatus
          .INACTIVE,
      startsAt:
        startsAt.toISOString(),
      endsAt:
        endsAt?.toISOString(),
      affectedServices:
        dto.affectedServices,
      allowReadOperations:
        dto.allowReadOperations,
      allowWriteOperations:
        dto.allowWriteOperations,
      allowBackgroundJobs:
        dto.allowBackgroundJobs,
      allowDeployments:
        dto.allowDeployments,
      publicMessage:
        dto.publicMessage,
      internalMessage:
        dto.internalMessage,
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
        .saveMaintenanceMode(item);

    this.audit.append({
      type:
        GovernanceAuditEventType
          .MAINTENANCE_MODE_CREATED,
      aggregateType:
        "governance_maintenance_mode",
      aggregateId:
        saved.id,
      actor:
        dto.actor,
      payload: {
        maintenanceModeId:
          saved.id,
        key:
          saved.key,
        environment:
          saved.environment,
        namespace:
          saved.namespace,
        status:
          saved.status,
        startsAt:
          saved.startsAt,
        endsAt:
          saved.endsAt ?? null,
        affectedServices:
          saved.affectedServices,
      },
    });

    return saved;
  }

  list():
    GovernanceMaintenanceMode[] {
    return this.store
      .listMaintenanceModes()
      .map((mode) =>
        this.normalizeStatus(mode),
      );
  }

  get(
    id: string,
  ): GovernanceMaintenanceMode {
    const item =
      this.store
        .getMaintenanceMode(id);

    if (!item) {
      throw new NotFoundException(
        `Maintenance mode ${id} was not found`,
      );
    }

    return this.normalizeStatus(item);
  }

  updateStatus(
    id: string,
    dto:
      UpdateMaintenanceModeStatusDto,
  ): GovernanceMaintenanceMode {
    const item =
      this.get(id);

    this.validateTransition(
      item.status,
      dto.status,
    );

    const now =
      new Date().toISOString();

    item.status =
      dto.status;

    item.updatedAt =
      now;

    if (
      dto.status ===
      MaintenanceModeStatus.ACTIVE
    ) {
      item.activatedAt =
        now;
    }

    if (
      dto.status ===
      MaintenanceModeStatus.COMPLETED
    ) {
      item.completedAt =
        now;
    }

    if (
      dto.status ===
      MaintenanceModeStatus.CANCELLED
    ) {
      item.cancelledAt =
        now;
    }

    const saved =
      this.store
        .saveMaintenanceMode(item);

    this.audit.append({
      type:
        GovernanceAuditEventType
          .MAINTENANCE_MODE_UPDATED,
      aggregateType:
        "governance_maintenance_mode",
      aggregateId:
        saved.id,
      actor:
        dto.actor,
      payload: {
        maintenanceModeId:
          saved.id,
        status:
          saved.status,
        reason:
          dto.reason,
        updatedAt:
          saved.updatedAt,
      },
    });

    return saved;
  }

  getAccessPolicy(
    environment: string,
    namespace: string,
    service?: string,
  ): {
    maintenanceActive: boolean;
    allowReadOperations: boolean;
    allowWriteOperations: boolean;
    allowBackgroundJobs: boolean;
    allowDeployments: boolean;
    publicMessage?: string;
  } {
    const active =
      this.list().find(
        (mode) =>
          mode.environment ===
            environment &&
          mode.namespace ===
            namespace &&
          mode.status ===
            MaintenanceModeStatus.ACTIVE &&
          (
            !service ||
            mode.affectedServices.length === 0 ||
            mode.affectedServices.includes(
              service,
            )
          ),
      );

    if (!active) {
      return {
        maintenanceActive:
          false,
        allowReadOperations:
          true,
        allowWriteOperations:
          true,
        allowBackgroundJobs:
          true,
        allowDeployments:
          true,
      };
    }

    return {
      maintenanceActive:
        true,
      allowReadOperations:
        active.allowReadOperations,
      allowWriteOperations:
        active.allowWriteOperations,
      allowBackgroundJobs:
        active.allowBackgroundJobs,
      allowDeployments:
        active.allowDeployments,
      publicMessage:
        active.publicMessage,
    };
  }

  private normalizeStatus(
    item:
      GovernanceMaintenanceMode,
  ): GovernanceMaintenanceMode {
    const now =
      Date.now();

    const startsAt =
      new Date(
        item.startsAt,
      ).getTime();

    const endsAt =
      item.endsAt
        ? new Date(
            item.endsAt,
          ).getTime()
        : undefined;

    if (
      item.status ===
        MaintenanceModeStatus.SCHEDULED &&
      now >= startsAt &&
      (
        endsAt === undefined ||
        now < endsAt
      )
    ) {
      item.status =
        MaintenanceModeStatus.ACTIVE;

      item.activatedAt =
        new Date().toISOString();

      item.updatedAt =
        item.activatedAt;

      return this.store
        .saveMaintenanceMode(item);
    }

    if (
      item.status ===
        MaintenanceModeStatus.ACTIVE &&
      endsAt !== undefined &&
      now >= endsAt
    ) {
      item.status =
        MaintenanceModeStatus.COMPLETED;

      item.completedAt =
        new Date().toISOString();

      item.updatedAt =
        item.completedAt;

      return this.store
        .saveMaintenanceMode(item);
    }

    return item;
  }

  private validateTransition(
    current:
      MaintenanceModeStatus,
    next:
      MaintenanceModeStatus,
  ): void {
    if (current === next) {
      return;
    }

    const transitions:
      Record<
        MaintenanceModeStatus,
        MaintenanceModeStatus[]
      > = {
      [MaintenanceModeStatus.INACTIVE]: [
        MaintenanceModeStatus.SCHEDULED,
        MaintenanceModeStatus.ACTIVE,
        MaintenanceModeStatus.CANCELLED,
      ],
      [MaintenanceModeStatus.SCHEDULED]: [
        MaintenanceModeStatus.ACTIVE,
        MaintenanceModeStatus.CANCELLED,
      ],
      [MaintenanceModeStatus.ACTIVE]: [
        MaintenanceModeStatus.COMPLETED,
        MaintenanceModeStatus.CANCELLED,
      ],
      [MaintenanceModeStatus.COMPLETED]: [],
      [MaintenanceModeStatus.CANCELLED]: [],
    };

    if (
      !transitions[current].includes(next)
    ) {
      throw new BadRequestException(
        `Invalid maintenance mode transition from ${current} to ${next}`,
      );
    }
  }
}
