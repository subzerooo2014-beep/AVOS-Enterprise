import { Injectable } from "@nestjs/common";
@Injectable()
export class JourneyNotificationService {
  notify(userId: string, title: string, message: string) {
    return { id: `notice_${Date.now()}`, userId, title, message, status: "QUEUED" };
  }
}
