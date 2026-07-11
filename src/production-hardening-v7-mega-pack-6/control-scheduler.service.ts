import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  MEGA_PACK_6_COLLECTIONS,
} from "./constants/mega-pack-6.constants";
import { CreateControlScheduleDto } from "./dto/create-control-schedule.dto";
import { MegaPack6StorageService } from "./mega-pack-6-storage.service";
import { PlatformEventBusService } from "./platform-event-bus.service";
import {
  ControlSchedule,
  SchedulerRun,
} from "./automation.types";

@Injectable()
export class ControlSchedulerService {
  constructor(
    private readonly storage:
      MegaPack6StorageService,
    private readonly events:
      PlatformEventBusService,
  ) {}

  async create(
    dto: CreateControlScheduleDto,
  ): Promise<ControlSchedule> {
    const schedules =
      await this.storage.readCollection<ControlSchedule>(
        MEGA_PACK_6_COLLECTIONS.controlSchedules,
      );

    if (
      schedules.some(
        (schedule) =>
          schedule.scheduleCode ===
          dto.scheduleCode,
      )
    ) {
      throw new BadRequestException(
        `Schedule code ${dto.scheduleCode} already exists`,
      );
    }

    const now =
      new Date().toISOString();

    const schedule: ControlSchedule = {
      id: randomUUID(),
      scheduleCode:
        dto.scheduleCode,
      name: dto.name,
      description:
        dto.description,
      controlType:
        dto.controlType,
      handler:
        dto.handler,
      frequency:
        dto.frequency,
      hour:
        dto.hour,
      minute:
        dto.minute,
      dayOfWeek:
        dto.dayOfWeek,
      dayOfMonth:
        dto.dayOfMonth,
      enabled:
        dto.enabled ?? true,
      configuration:
        dto.configuration ?? {},
      nextRunAt:
        this.calculateNextRun(
          {
            frequency:
              dto.frequency,
            hour:
              dto.hour,
            minute:
              dto.minute,
            dayOfWeek:
              dto.dayOfWeek,
            dayOfMonth:
              dto.dayOfMonth,
          },
          new Date(),
        ),
      runCount: 0,
      failureCount: 0,
      createdAt:
        now,
      updatedAt:
        now,
    };

    schedules.push(schedule);

    await this.storage.writeCollection(
      MEGA_PACK_6_COLLECTIONS.controlSchedules,
      schedules,
    );

    return schedule;
  }

  async list():
    Promise<ControlSchedule[]> {
    const schedules =
      await this.storage.readCollection<ControlSchedule>(
        MEGA_PACK_6_COLLECTIONS.controlSchedules,
      );

    return schedules.sort(
      (a, b) =>
        a.scheduleCode.localeCompare(
          b.scheduleCode,
        ),
    );
  }

  async get(
    id: string,
  ): Promise<ControlSchedule> {
    const schedule =
      await this.storage.findById<ControlSchedule>(
        MEGA_PACK_6_COLLECTIONS.controlSchedules,
        id,
      );

    if (!schedule) {
      throw new NotFoundException(
        `Control schedule ${id} was not found`,
      );
    }

    return schedule;
  }

  async runDue(): Promise<{
    evaluated: number;
    due: number;
    completed: number;
    failed: number;
    runs: SchedulerRun[];
  }> {
    const schedules =
      await this.list();

    const now = new Date();

    const dueSchedules =
      schedules.filter(
        (schedule) =>
          schedule.enabled &&
          schedule.frequency !==
            "manual" &&
          schedule.nextRunAt &&
          new Date(
            schedule.nextRunAt,
          ).getTime() <=
            now.getTime(),
      );

    const runs:
      SchedulerRun[] = [];

    let completed = 0;
    let failed = 0;

    for (
      const schedule of dueSchedules
    ) {
      const run =
        await this.executeSchedule(
          schedule,
        );

      runs.push(run);

      if (
        run.status ===
        "completed"
      ) {
        completed += 1;
      } else if (
        run.status === "failed"
      ) {
        failed += 1;
      }
    }

    return {
      evaluated:
        schedules.length,
      due:
        dueSchedules.length,
      completed,
      failed,
      runs,
    };
  }

  async runNow(
    id: string,
  ): Promise<SchedulerRun> {
    const schedule =
      await this.get(id);

    return this.executeSchedule(
      schedule,
    );
  }

  async enable(
    id: string,
    enabled: boolean,
  ): Promise<ControlSchedule> {
    const schedule =
      await this.get(id);

    const updated:
      ControlSchedule = {
      ...schedule,
      enabled,
      nextRunAt:
        enabled
          ? this.calculateNextRun(
              schedule,
              new Date(),
            )
          : schedule.nextRunAt,
      updatedAt:
        new Date().toISOString(),
    };

    await this.storage.replaceById(
      MEGA_PACK_6_COLLECTIONS.controlSchedules,
      id,
      updated,
    );

    return updated;
  }

  async seedDefaults(): Promise<{
    created: number;
    total: number;
  }> {
    const schedules =
      await this.list();

    const defaults:
      CreateControlScheduleDto[] = [
      {
        scheduleCode:
          "AVOS-SCHEDULE-ASSURANCE-HOURLY",
        name:
          "Hourly continuous assurance",
        description:
          "Runs the continuous assurance validation cycle every hour.",
        controlType:
          "continuous-assurance",
        handler:
          "run-continuous-assurance",
        frequency:
          "hourly",
        minute: 0,
        enabled: true,
        configuration: {},
      },
      {
        scheduleCode:
          "AVOS-SCHEDULE-INTEGRITY-DAILY",
        name:
          "Daily integrity verification",
        description:
          "Runs daily platform and evidence integrity verification.",
        controlType:
          "integrity-verification",
        handler:
          "verify-integrity",
        frequency:
          "daily",
        hour: 2,
        minute: 0,
        enabled: true,
        configuration: {},
      },
      {
        scheduleCode:
          "AVOS-SCHEDULE-EVIDENCE-DAILY",
        name:
          "Daily evidence chain verification",
        description:
          "Verifies the automated evidence chain every day.",
        controlType:
          "evidence-chain",
        handler:
          "verify-evidence-chain",
        frequency:
          "daily",
        hour: 3,
        minute: 0,
        enabled: true,
        configuration: {},
      },
      {
        scheduleCode:
          "AVOS-SCHEDULE-RISK-WEEKLY",
        name:
          "Weekly enterprise risk review",
        description:
          "Runs the enterprise risk treatment review workflow weekly.",
        controlType:
          "risk-treatment",
        handler:
          "review-enterprise-risks",
        frequency:
          "weekly",
        dayOfWeek: 1,
        hour: 8,
        minute: 0,
        enabled: true,
        configuration: {},
      },
    ];

    let created = 0;

    for (const dto of defaults) {
      if (
        schedules.some(
          (schedule) =>
            schedule.scheduleCode ===
            dto.scheduleCode,
        )
      ) {
        continue;
      }

      await this.create(dto);
      created += 1;
    }

    return {
      created,
      total:
        schedules.length +
        created,
    };
  }

  private async executeSchedule(
    schedule: ControlSchedule,
  ): Promise<SchedulerRun> {
    const started =
      new Date();

    const run: SchedulerRun = {
      id: randomUUID(),
      scheduleId:
        schedule.id,
      scheduleCode:
        schedule.scheduleCode,
      startedAt:
        started.toISOString(),
      status: "running",
      handler:
        schedule.handler,
      createdAt:
        started.toISOString(),
      updatedAt:
        started.toISOString(),
    };

    await this.storage.append(
      MEGA_PACK_6_COLLECTIONS.schedulerRuns,
      run,
    );

    try {
      const output =
        await this.executeHandler(
          schedule.handler,
          schedule.configuration,
        );

      const completedAt =
        new Date();

      const completedRun:
        SchedulerRun = {
        ...run,
        status: "completed",
        completedAt:
          completedAt.toISOString(),
        durationMs:
          completedAt.getTime() -
          started.getTime(),
        output,
        updatedAt:
          completedAt.toISOString(),
      };

      await this.storage.replaceById(
        MEGA_PACK_6_COLLECTIONS.schedulerRuns,
        run.id,
        completedRun,
      );

      await this.updateScheduleAfterRun(
        schedule,
        true,
        completedAt,
      );

      await this.events.publish({
        eventType:
          "scheduler.run.completed",
        source:
          "ControlSchedulerService",
        severity: "low",
        entityType:
          "scheduler_run",
        entityId:
          completedRun.id,
        payload: {
          scheduleCode:
            schedule.scheduleCode,
          handler:
            schedule.handler,
          durationMs:
            completedRun.durationMs,
        },
      });

      return completedRun;
    } catch (error) {
      const completedAt =
        new Date();

      const failedRun:
        SchedulerRun = {
        ...run,
        status: "failed",
        completedAt:
          completedAt.toISOString(),
        durationMs:
          completedAt.getTime() -
          started.getTime(),
        errorMessage:
          error instanceof Error
            ? error.message
            : "Unknown scheduler error",
        updatedAt:
          completedAt.toISOString(),
      };

      await this.storage.replaceById(
        MEGA_PACK_6_COLLECTIONS.schedulerRuns,
        run.id,
        failedRun,
      );

      await this.updateScheduleAfterRun(
        schedule,
        false,
        completedAt,
      );

      return failedRun;
    }
  }

  private async executeHandler(
    handler: string,
    configuration:
      Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    switch (handler) {
      case "run-continuous-assurance":
        return {
          assuranceRequested:
            true,
          requestedAt:
            new Date().toISOString(),
        };

      case "verify-integrity":
        return {
          integrityVerificationRequested:
            true,
          requestedAt:
            new Date().toISOString(),
        };

      case "verify-evidence-chain":
        return {
          evidenceChainVerificationRequested:
            true,
          requestedAt:
            new Date().toISOString(),
        };

      case "review-enterprise-risks":
        return {
          riskReviewRequested:
            true,
          requestedAt:
            new Date().toISOString(),
        };

      default:
        return {
          handler,
          executed: true,
          configuration,
          executedAt:
            new Date().toISOString(),
        };
    }
  }

  private async updateScheduleAfterRun(
    schedule: ControlSchedule,
    success: boolean,
    completedAt: Date,
  ): Promise<void> {
    const updated:
      ControlSchedule = {
      ...schedule,
      lastRunAt:
        completedAt.toISOString(),
      nextRunAt:
        this.calculateNextRun(
          schedule,
          completedAt,
        ),
      lastRunStatus:
        success
          ? "completed"
          : "failed",
      runCount:
        schedule.runCount + 1,
      failureCount:
        schedule.failureCount +
        (success ? 0 : 1),
      updatedAt:
        completedAt.toISOString(),
    };

    await this.storage.replaceById(
      MEGA_PACK_6_COLLECTIONS.controlSchedules,
      schedule.id,
      updated,
    );
  }

  private calculateNextRun(
    schedule: {
      frequency:
        | "hourly"
        | "daily"
        | "weekly"
        | "monthly"
        | "manual";
      hour?: number;
      minute?: number;
      dayOfWeek?: number;
      dayOfMonth?: number;
    },
    from: Date,
  ): string | undefined {
    if (
      schedule.frequency ===
      "manual"
    ) {
      return undefined;
    }

    const next = new Date(from);

    const minute =
      schedule.minute ?? 0;

    if (
      schedule.frequency ===
      "hourly"
    ) {
      next.setMinutes(
        minute,
        0,
        0,
      );

      if (
        next.getTime() <=
        from.getTime()
      ) {
        next.setHours(
          next.getHours() + 1,
        );
      }

      return next.toISOString();
    }

    const hour =
      schedule.hour ?? 0;

    next.setHours(
      hour,
      minute,
      0,
      0,
    );

    if (
      schedule.frequency ===
      "daily"
    ) {
      if (
        next.getTime() <=
        from.getTime()
      ) {
        next.setDate(
          next.getDate() + 1,
        );
      }

      return next.toISOString();
    }

    if (
      schedule.frequency ===
      "weekly"
    ) {
      const targetDay =
        schedule.dayOfWeek ?? 1;

      let daysAhead =
        (targetDay -
          next.getDay() +
          7) %
        7;

      if (
        daysAhead === 0 &&
        next.getTime() <=
          from.getTime()
      ) {
        daysAhead = 7;
      }

      next.setDate(
        next.getDate() +
          daysAhead,
      );

      return next.toISOString();
    }

    const dayOfMonth =
      schedule.dayOfMonth ?? 1;

    next.setDate(
      Math.min(
        dayOfMonth,
        new Date(
          next.getFullYear(),
          next.getMonth() + 1,
          0,
        ).getDate(),
      ),
    );

    if (
      next.getTime() <=
      from.getTime()
    ) {
      next.setMonth(
        next.getMonth() + 1,
      );

      next.setDate(
        Math.min(
          dayOfMonth,
          new Date(
            next.getFullYear(),
            next.getMonth() + 1,
            0,
          ).getDate(),
        ),
      );
    }

    return next.toISOString();
  }
}
