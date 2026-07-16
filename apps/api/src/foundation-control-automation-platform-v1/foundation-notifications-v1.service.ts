import { Injectable } from "@nestjs/common";
import type { FoundationNotificationV1 } from "./foundation-control-automation-v1.types";

@Injectable()
export class FoundationNotificationsV1Service {
  private readonly notifications: FoundationNotificationV1[] = [];

  queue(
    channel: FoundationNotificationV1["channel"],
    recipient: string,
    subject: string,
    message: string,
  ): FoundationNotificationV1 {
    const notification: FoundationNotificationV1 = {
      id: `foundation-notification-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      channel,
      recipient,
      subject,
      message,
      status: "QUEUED",
      createdAt: new Date().toISOString(),
    };

    this.notifications.unshift(notification);
    return { ...notification };
  }

  send(id: string): FoundationNotificationV1 | undefined {
    const notification = this.notifications.find((item) => item.id === id);
    if (!notification) return undefined;

    notification.status = "SENT";
    notification.sentAt = new Date().toISOString();
    return { ...notification };
  }

  list(): FoundationNotificationV1[] {
    return this.notifications.map((item) => ({ ...item }));
  }

  count(): number {
    return this.notifications.length;
  }
}
