import { Injectable } from "@nestjs/common";
import { GovernmentWebhookPolicy } from "../policies/government-webhook.policy";
import { GovernmentWebhookSecurityService } from "../security/government-webhook-security.service";
@Injectable()
export class GovernmentWebhookService {
  private readonly events: Array<Record<string, unknown>> = [];
  constructor(
    private readonly policy: GovernmentWebhookPolicy,
    private readonly security: GovernmentWebhookSecurityService,
  ) {}
  receive(input: {
    provider: string;
    eventId: string;
    eventType: string;
    payload: Record<string, unknown>;
    signature: string;
  }) {
    this.policy.validate(input.eventId, input.eventType, input.signature);
    const validation = this.security.validate({
      eventId: input.eventId,
      payload: input.payload,
      signature: input.signature,
      secret: "sandbox-secret",
    });
    const event = {
      id: `gov_webhook_${Date.now()}`,
      ...input,
      ...validation,
      receivedAt: new Date().toISOString(),
    };
    this.events.push(event);
    return event;
  }
  list() { return [...this.events]; }
}
