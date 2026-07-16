import { Injectable } from "@nestjs/common";
import type { NotificationRecord } from "./enterprise-platform-services-control-plane.types";

@Injectable()
export class NotificationOrchestratorService {
  private readonly notifications: NotificationRecord[] = [];

  queue(
    input: Omit<NotificationRecord, "id" | "status" | "createdAt">,
  ): NotificationRecord {
    const record: NotificationRecord = {
      ...input,
      id: `notification-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      status: "QUEUED",
      createdAt: new Date().toISOString(),
    };

    this.notifications.unshift(record);
    if (this.notifications.length > 1000) this.notifications.length = 1000;

    return { ...record };
  }

  markSent(id: string): NotificationRecord | undefined {
    const record = this.notifications.find((item) => item.id === id);
    if (!record) return undefined;

    record.status = "SENT";
    record.sentAt = new Date().toISOString();
    return { ...record };
  }

  markFailed(id: string, error: string): NotificationRecord | undefined {
    const record = this.notifications.find((item) => item.id === id);
    if (!record) return undefined;

    record.status = "FAILED";
    record.error = error;
    return { ...record };
  }

  list(): NotificationRecord[] {
    return this.notifications.map((item) => ({ ...item }));
  }

  count(): number {
    return this.notifications.length;
  }
}
