import { Injectable } from "@nestjs/common";
import { NotificationOrchestratorService } from "./notification-orchestrator.service";
import { SchedulerControlService } from "./scheduler-control.service";

@Injectable()
export class PlatformServicesObservabilityService {
  constructor(
    private readonly notifications: NotificationOrchestratorService,
    private readonly scheduler: SchedulerControlService,
  ) {}

  analytics() {
    const notifications = this.notifications.list();

    return {
      notifications: notifications.length,
      sentNotifications: notifications.filter((item) => item.status === "SENT")
        .length,
      failedNotifications: notifications.filter(
        (item) => item.status === "FAILED",
      ).length,
      queuedNotifications: notifications.filter(
        (item) => item.status === "QUEUED",
      ).length,
      scheduledTasks: this.scheduler.count(),
      enabledTasks: this.scheduler
        .list()
        .filter((item) => item.enabled).length,
    };
  }
}
