import { Injectable } from "@nestjs/common";
import { NotificationRecord } from "./super-app-v5.types";

@Injectable()
export class SuperAppV5NotificationService {
  private readonly notifications: NotificationRecord[] = [];

  queue(input: {
    userId: string;
    title: string;
    message: string;
    channel?: "IN_APP" | "PUSH" | "EMAIL";
  }): NotificationRecord {
    const notification: NotificationRecord = {
      id: `notification_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      userId: input.userId,
      title: input.title,
      message: input.message,
      channel: input.channel ?? "IN_APP",
      status: "QUEUED",
      createdAt: new Date().toISOString(),
    };

    this.notifications.push(notification);
    return notification;
  }

  markSent(id: string): NotificationRecord | undefined {
    const notification = this.notifications.find((item) => item.id === id);
    if (notification) notification.status = "SENT";
    return notification;
  }

  list(): NotificationRecord[] {
    return [...this.notifications];
  }
}
