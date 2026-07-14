import { Injectable } from "@nestjs/common";
@Injectable()
export class AiNotificationService {
  notify(userId: string, title: string, message: string) {
    return { id: `ai_notification_${Date.now()}`, userId, title, message, status: "QUEUED" };
  }
}
