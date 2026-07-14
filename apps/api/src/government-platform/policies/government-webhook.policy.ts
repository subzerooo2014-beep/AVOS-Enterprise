import { Injectable } from "@nestjs/common";
@Injectable()
export class GovernmentWebhookPolicy {
  validate(eventId: string, eventType: string, signature: string) {
    if (!eventId || !eventType || !signature) throw new Error("Invalid webhook payload");
    return true;
  }
}
