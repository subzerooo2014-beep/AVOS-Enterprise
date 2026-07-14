import { Injectable } from "@nestjs/common";
import { RequestSigningService } from "./request-signing.service";

@Injectable()
export class WebhookSecurityService {
  private readonly replay = new Set<string>();
  constructor(private readonly signing: RequestSigningService) {}

  validate(input: { eventId: string; payload: Record<string, unknown>; secret: string; signature: string }) {
    const replayRejected = this.replay.has(input.eventId);
    if (!replayRejected) this.replay.add(input.eventId);
    return {
      signatureValid: this.signing.verify(input.payload, input.secret, input.signature),
      replayRejected,
    };
  }
}
