import { Injectable } from "@nestjs/common";
@Injectable()
export class MarketplaceNotificationService {
  notify(userId: string, title: string, message: string) {
    return { id: `notification_${Date.now()}`, userId, title, message, status: "QUEUED" };
  }
}
