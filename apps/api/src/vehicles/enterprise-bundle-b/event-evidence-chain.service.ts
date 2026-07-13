import { Injectable } from "@nestjs/common";

@Injectable()
export class EventEvidenceChainService {
  build(input: {
    eventId: string;
    payloadHash: string;
    previousHash?: string;
  }) {
    return {
      eventId: input.eventId,
      payloadHash: input.payloadHash,
      previousHash: input.previousHash ?? null,
      linked: true,
      createdAt: new Date().toISOString(),
    };
  }
}
