import { Injectable } from "@nestjs/common";
@Injectable()
export class GovernmentNotificationService {
  notify(userId: string, title: string, message: string) {
    return {
      id: `gov_notification_${Date.now()}`,
      userId,
      title,
      message,
      status: "QUEUED",
    };
  }
}
