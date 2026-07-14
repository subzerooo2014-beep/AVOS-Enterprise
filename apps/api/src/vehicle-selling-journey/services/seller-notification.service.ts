import { Injectable } from "@nestjs/common";
@Injectable()
export class SellerNotificationService {
  notify(userId: string, title: string, message: string) {
    return { id: `notification_${Date.now()}`, userId, title, message, status: "QUEUED" };
  }
}
