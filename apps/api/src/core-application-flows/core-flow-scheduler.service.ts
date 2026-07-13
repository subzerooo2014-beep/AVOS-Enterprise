import { Injectable, NotFoundException } from "@nestjs/common";
import type { FlowSchedule } from "./core-flow-saga.types";
import { CoreFlowOutboxService } from "./core-flow-outbox.service";
import { CoreFlowAuditService } from "./core-flow-audit.service";

@Injectable()
export class CoreFlowSchedulerService {
  private readonly schedules = new Map<string, FlowSchedule>();

  constructor(
    private readonly outbox: CoreFlowOutboxService,
    private readonly audit: CoreFlowAuditService,
  ) {}

  schedule(operationId: string, executeAt: string) {
    this.outbox.findOne(operationId);
    const schedule: FlowSchedule = {
      id: `schedule_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      operationId,
      executeAt: new Date(executeAt).toISOString(),
      status: "scheduled",
      createdAt: new Date().toISOString(),
    };
    this.schedules.set(schedule.id, schedule);
    this.audit.write(operationId, "operation.scheduled", {
      scheduleId: schedule.id,
      executeAt: schedule.executeAt,
    });
    return schedule;
  }

  findAll() {
    return Array.from(this.schedules.values()).slice().reverse();
  }

  findOne(id: string) {
    const schedule = this.schedules.get(id);
    if (!schedule) throw new NotFoundException("Flow schedule not found");
    return schedule;
  }

  cancel(id: string) {
    const schedule = this.findOne(id);
    schedule.status = "cancelled";
    this.audit.write(schedule.operationId, "operation.schedule.cancelled", {
      scheduleId: id,
    });
    return schedule;
  }

  dispatchDue() {
    const now = Date.now();
    const due = this.findAll().filter(
      (item) =>
        item.status === "scheduled" &&
        new Date(item.executeAt).getTime() <= now,
    );

    for (const schedule of due) {
      const operation = this.outbox.findOne(schedule.operationId);
      operation.status = "queued";
      operation.nextAttemptAt = new Date().toISOString();
      operation.updatedAt = new Date().toISOString();
      schedule.status = "dispatched";
      this.audit.write(operation.id, "operation.schedule.dispatched", {
        scheduleId: schedule.id,
      });
    }

    return {
      dispatched: due.length,
      schedules: due,
      executedAt: new Date().toISOString(),
    };
  }
}
