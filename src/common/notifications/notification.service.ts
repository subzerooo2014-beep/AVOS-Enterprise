import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationService {
  send(channel: string, message: string) {
    return {
      channel,
      message,
      sentAt: new Date().toISOString(),
    };
  }
}
