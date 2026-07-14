import { Injectable } from "@nestjs/common";
@Injectable()
export class ParticipantPolicy {
  validate(input: { trustScore: number; depositAmount: number }) {
    if (input.trustScore < 40) throw new Error("Participant trust score too low");
    if (input.depositAmount <= 0) throw new Error("Deposit required");
    return true;
  }
}
