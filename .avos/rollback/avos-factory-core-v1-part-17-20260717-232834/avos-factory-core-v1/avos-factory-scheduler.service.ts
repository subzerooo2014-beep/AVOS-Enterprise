import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactorySchedule
} from "./avos-factory-operations.contracts";
import {
  AvosFactoryJobQueueService
} from "./avos-factory-job-queue.service";

@Injectable()
export class AvosFactorySchedulerService {
  private readonly schedules: AvosFactorySchedule[] = [];

  constructor(
    private readonly queue: AvosFactoryJobQueueService
  ) {}

  create(input: {
    name: string;
    jobType: AvosFactorySchedule["jobType"];
    subjectId: string;
    actor: string;
    approvedBy?: string;
    humanApproved: boolean;
    payload?: Record<string, unknown>;
    runAt: string;
  }): AvosFactorySchedule {
    if (!Number.isFinite(new Date(input.runAt).getTime())) {
      throw new BadRequestException("Invalid schedule date.");
    }

    const schedule: AvosFactorySchedule = {
      id: randomUUID(),
      name: input.name,
      jobType: input.jobType,
      subjectId: input.subjectId,
      actor: input.actor,
      approvedBy: input.approvedBy,
      humanApproved: input.humanApproved,
      payload: structuredClone(input.payload ?? {}),
      runAt: input.runAt,
      enabled: true,
      createdAt: new Date().toISOString()
    };

    this.schedules.unshift(schedule);
    return structuredClone(schedule);
  }

  dispatchDue(): {
    dispatched: number;
    scheduleIds: string[];
  } {
    const now = Date.now();
    const due = this.schedules.filter(
      (schedule) =>
        schedule.enabled &&
        new Date(schedule.runAt).getTime() <= now
    );

    for (const schedule of due) {
      this.queue.enqueue({
        type: schedule.jobType,
        subjectId: schedule.subjectId,
        actor: schedule.actor,
        approvedBy: schedule.approvedBy,
        humanApproved: schedule.humanApproved,
        payload: schedule.payload,
        scheduledFor: schedule.runAt
      });

      schedule.enabled = false;
    }

    return {
      dispatched: due.length,
      scheduleIds: due.map((schedule) => schedule.id)
    };
  }

  list(limit = 100): AvosFactorySchedule[] {
    return this.schedules
      .slice(0, Math.max(1, Math.min(limit, 1000)))
      .map((schedule) => structuredClone(schedule));
  }

  count(): number {
    return this.schedules.length;
  }

  enabledCount(): number {
    return this.schedules.filter(
      (schedule) => schedule.enabled
    ).length;
  }
}
