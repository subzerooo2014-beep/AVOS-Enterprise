import { Injectable } from "@nestjs/common";
import { PartnerWebhookRecord } from "./partner-platform.types";

@Injectable()
export class PartnerWebhookService {
  private readonly records: PartnerWebhookRecord[] = [];
  private readonly replayKeys = new Set<string>();

  receive(input: {
    partnerCode: string;
    eventType: string;
    payload: Record<string, unknown>;
    signature?: string;
    eventId?: string;
  }): PartnerWebhookRecord {
    const replayKey =
      input.eventId ??
      `${input.partnerCode}:${input.eventType}:${JSON.stringify(input.payload)}`;

    const replayRejected = this.replayKeys.has(replayKey);
    if (!replayRejected) this.replayKeys.add(replayKey);

    const record: PartnerWebhookRecord = {
      id: `webhook_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      partnerCode: input.partnerCode,
      eventType: input.eventType,
      payload: input.payload,
      signatureVerified: Boolean(
        input.signature && input.signature.startsWith("avos-signature-"),
      ),
      replayRejected,
      receivedAt: new Date().toISOString(),
    };

    this.records.push(record);
    return record;
  }

  list(): PartnerWebhookRecord[] {
    return [...this.records];
  }
}
