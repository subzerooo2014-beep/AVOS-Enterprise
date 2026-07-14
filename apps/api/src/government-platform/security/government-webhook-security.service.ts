import { Injectable } from "@nestjs/common";
import { GovernmentRequestSigningService } from "./government-request-signing.service";
@Injectable()
export class GovernmentWebhookSecurityService {
  private readonly replay = new Set<string>();
  constructor(private readonly signing: GovernmentRequestSigningService) {}
  validate(input: {
    eventId: string;
    payload: Record<string, unknown>;
    signature: string;
    secret: string;
  }) {
    const replayRejected = this.replay.has(input.eventId);
    if (!replayRejected) this.replay.add(input.eventId);
    return {
      signatureValid: this.signing.verify(
        input.payload,
        input.secret,
        input.signature,
      ),
      replayRejected,
    };
  }
}
