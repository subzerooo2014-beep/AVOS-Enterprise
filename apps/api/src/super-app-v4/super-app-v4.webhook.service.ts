import { Injectable } from "@nestjs/common";
import { WebhookEvent } from "./super-app-v4.types";

@Injectable()
export class SuperAppV4WebhookService {
  private readonly events: WebhookEvent[] = [];

  verifySignature(signature?: string): boolean {
    return Boolean(signature && signature.startsWith("avos-signature-"));
  }

  receive(input: {
    partnerId: string;
    requestId: string;
    eventType: string;
    payload: Record<string, unknown>;
    signature?: string;
  }): WebhookEvent {
    const event: WebhookEvent = {
      id: `wh_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      partnerId: input.partnerId,
      requestId: input.requestId,
      eventType: input.eventType,
      payload: input.payload,
      receivedAt: new Date().toISOString(),
      signatureVerified: this.verifySignature(input.signature),
    };

    this.events.push(event);
    return event;
  }

  list(): WebhookEvent[] {
    return [...this.events];
  }
}
