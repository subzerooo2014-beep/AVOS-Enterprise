import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GovernanceJsonValue,
  GovernanceSchedule,
  GovernanceScheduleRun,
  GovernanceScheduleRunStatus,
  GovernanceScheduleStatus,
  GovernanceScheduleType,
  GovernanceTimelineEventType,
} from "../contracts";
import {
  CreateGovernanceScheduleDto,
  UpdateGovernanceScheduleStatusDto,
} from "../dto";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  RuntimeGovernanceTimelineService,
} from "./runtime-governance-timeline.service";

@Injectable()
export class RuntimeGovernanceSchedulerService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
    private readonly timeline:
      RuntimeGovernanceTimelineService,
  ) {}

  create(
    dto:
      CreateGovernanceScheduleDto,
  ): GovernanceSchedule {
    if (
      !dto.runAt &&
      !dto.intervalSeconds
    ) {
      throw new BadRequestException(
        "Schedule requires runAt or intervalSeconds",
      );
    }

    const duplicate =
      this.store
        .listGovernanceSchedules()
        .find(
          (schedule) =>
            schedule.key === dto.key &&
            ![
              GovernanceScheduleStatus.CANCELLED,
              GovernanceScheduleStatus.COMPLETED,
              GovernanceScheduleStatus.EXPIRED,
            ].includes(schedule.status),
        );

    if (duplicate) {
      throw new BadRequestException(
        `Active schedule already exists for key ${dto.key}`,
      );
    }

    const now =
      new Date().toISOString();

    const schedule:
      GovernanceSchedule = {
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
        dto.enabled === false
          ? GovernanceScheduleStatus.PAUSED
          : GovernanceScheduleStatus.ACTIVE,
      environment:
        dto.environment,
      namespace:
        dto.namespace,
      service:
        dto.service,
      targetId:
        dto.targetId,
      runAt:
        dto.runAt,
      intervalSeconds:
        dto.intervalSeconds,
      maximumRuns:
        dto.maximumRuns,
      runCount:
        0,
      retryLimit:
        dto.retryLimit ?? 0,
      retryDelaySeconds:
        dto.retryDelaySeconds ?? 0,
      enabled:
        dto.enabled ?? true,
      payload:
        (dto.payload ?? {}) as Record<
          string,
          GovernanceJsonValue
        >,
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
        dto.enabled === false
          ? undefined
          : now,
      expiresAt:
        dto.expiresAt,
      nextRunAt:
        this.calculateNextRun(
          dto.runAt,
          dto.intervalSeconds,
          now,
        ),
    };

    return this.store
      .saveGovernanceSchedule(
        schedule,
      );
  }

  list():
    GovernanceSchedule[] {
    this.normalizeSchedules();

    return this.store
      .listGovernanceSchedules();
  }

  get(
    id: string,
  ): GovernanceSchedule {
    const schedule =
      this.store
        .getGovernanceSchedule(id);

    if (!schedule) {
      throw new NotFoundException(
        `Governance schedule ${id} was not found`,
      );
    }

    return schedule;
  }

  updateStatus(
    id: string,
    dto:
      UpdateGovernanceScheduleStatusDto,
  ): GovernanceSchedule {
    const schedule =
      this.get(id);

    const now =
      new Date().toISOString();

    schedule.status =
      dto.status;

    schedule.updatedAt =
      now;

    schedule.enabled =
      dto.status ===
      GovernanceScheduleStatus.ACTIVE;

    if (
      dto.status ===
      GovernanceScheduleStatus.ACTIVE
    ) {
      schedule.activatedAt =
        now;

      schedule.nextRunAt =
        this.calculateNextRun(
          schedule.runAt,
          schedule.intervalSeconds,
          now,
        );
    }

    if (
      dto.status ===
      GovernanceScheduleStatus.PAUSED
    ) {
      schedule.pausedAt =
        now;
    }

    if (
      dto.status ===
      GovernanceScheduleStatus.CANCELLED
    ) {
      schedule.cancelledAt =
        now;
    }

    schedule.metadata = {
      ...schedule.metadata,
      lastStatusReason:
        dto.reason,
      lastStatusActorId:
        dto.actor.id,
    };

    return this.store
      .saveGovernanceSchedule(
        schedule,
      );
  }

  runDue(
    actor: {
      id: string;
      type:
        | "user"
        | "service"
        | "system"
        | "automation";
      name?: string;
      roles: string[];
    },
  ): GovernanceScheduleRun[] {
    this.normalizeSchedules();

    const now =
      Date.now();

    const due =
      this.store
        .listGovernanceSchedules()
        .filter(
          (schedule) =>
            schedule.status ===
              GovernanceScheduleStatus.ACTIVE &&
            schedule.enabled &&
            Boolean(
              schedule.nextRunAt,
            ) &&
            new Date(
              schedule.nextRunAt as string,
            ).getTime() <= now,
        );

    return due.map(
      (schedule) =>
        this.executeSchedule(
          schedule,
          actor,
        ),
    );
  }

  listRuns():
    GovernanceScheduleRun[] {
    return this.store
      .listGovernanceScheduleRuns();
  }

  private executeSchedule(
    schedule:
      GovernanceSchedule,
    actor: {
      id: string;
      type:
        | "user"
        | "service"
        | "system"
        | "automation";
      name?: string;
      roles: string[];
    },
  ): GovernanceScheduleRun {
    const run:
      GovernanceScheduleRun = {
      id:
        randomUUID(),
      scheduleId:
        schedule.id,
      runNumber:
        schedule.runCount + 1,
      status:
        GovernanceScheduleRunStatus.RUNNING,
      startedAt:
        new Date().toISOString(),
      output: {},
    };

    this.store
      .saveGovernanceScheduleRun(
        run,
      );

    try {
      run.status =
        GovernanceScheduleRunStatus.SUCCEEDED;

      run.output = {
        scheduleType:
          schedule.type,
        targetId:
          schedule.targetId ??
          null,
        payload:
          schedule.payload,
        executedAt:
          new Date().toISOString(),
      };

      run.completedAt =
        new Date().toISOString();

      schedule.runCount +=
        1;

      schedule.lastRunAt =
        run.completedAt;

      schedule.updatedAt =
        run.completedAt;

      if (
        schedule.maximumRuns &&
        schedule.runCount >=
          schedule.maximumRuns
      ) {
        schedule.status =
          GovernanceScheduleStatus.COMPLETED;

        schedule.completedAt =
          run.completedAt;

        schedule.enabled =
          false;

        schedule.nextRunAt =
          undefined;
      } else {
        schedule.nextRunAt =
          this.calculateNextRun(
            undefined,
            schedule.intervalSeconds,
            run.completedAt,
          );

        if (
          !schedule.intervalSeconds
        ) {
          schedule.status =
            GovernanceScheduleStatus.COMPLETED;

          schedule.completedAt =
            run.completedAt;

          schedule.enabled =
            false;
        }
      }

      this.store
        .saveGovernanceSchedule(
          schedule,
        );

      const savedRun =
        this.store
          .saveGovernanceScheduleRun(
            run,
          );

      this.timeline.append({
        aggregateType:
          "governance_schedule",
        aggregateId:
          schedule.id,
        type:
          GovernanceTimelineEventType.SCHEDULE_EXECUTED,
        title:
          `Schedule executed: ${schedule.name}`,
        description:
          schedule.description,
        relatedResourceIds: [
          schedule.targetId,
          savedRun.id,
        ].filter(
          (
            value,
          ): value is string =>
            Boolean(value),
        ),
        payload: {
          scheduleId:
            schedule.id,
          scheduleRunId:
            savedRun.id,
          scheduleType:
            schedule.type,
          runNumber:
            savedRun.runNumber,
          status:
            savedRun.status,
        },
        metadata: {},
        actor,
      });

      return savedRun;
    } catch (error) {
      run.status =
        GovernanceScheduleRunStatus.FAILED;

      run.completedAt =
        new Date().toISOString();

      run.error =
        error instanceof Error
          ? error.message
          : "Unknown schedule failure";

      schedule.status =
        GovernanceScheduleStatus.FAILED;

      schedule.failedAt =
        run.completedAt;

      schedule.lastError =
        run.error;

      schedule.updatedAt =
        run.completedAt;

      this.store
        .saveGovernanceSchedule(
          schedule,
        );

      return this.store
        .saveGovernanceScheduleRun(
          run,
        );
    }
  }

  private normalizeSchedules():
    void {
    const now =
      Date.now();

    for (
      const schedule of
      this.store
        .listGovernanceSchedules()
    ) {
      if (
        schedule.expiresAt &&
        schedule.status ===
          GovernanceScheduleStatus.ACTIVE &&
        new Date(
          schedule.expiresAt,
        ).getTime() <= now
      ) {
        schedule.status =
          GovernanceScheduleStatus.EXPIRED;

        schedule.enabled =
          false;

        schedule.updatedAt =
          new Date().toISOString();

        this.store
          .saveGovernanceSchedule(
            schedule,
          );
      }
    }
  }

  private calculateNextRun(
    runAt:
      string | undefined,
    intervalSeconds:
      number | undefined,
    baseTime: string,
  ): string | undefined {
    if (runAt) {
      return new Date(
        runAt,
      ).toISOString();
    }

    if (
      intervalSeconds
    ) {
      return new Date(
        new Date(
          baseTime,
        ).getTime() +
        intervalSeconds * 1000,
      ).toISOString();
    }

    return undefined;
  }
}
