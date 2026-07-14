import { Injectable } from "@nestjs/common";
import { ParticipantPolicy } from "../policies/participant.policy";
@Injectable()
export class ParticipantService {
  private readonly participants: Array<Record<string, unknown>> = [];
  constructor(private readonly policy: ParticipantPolicy) {}
  register(input: { auctionId: string; userId: string; trustScore: number; depositAmount: number }) {
    this.policy.validate(input);
    const participant = {
      id: `participant_${Date.now()}`,
      ...input,
      status: "APPROVED",
      createdAt: new Date().toISOString(),
    };
    this.participants.push(participant);
    return participant;
  }
  list() { return [...this.participants]; }
}
