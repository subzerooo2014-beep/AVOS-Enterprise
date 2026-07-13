import { Injectable } from "@nestjs/common";

@Injectable()
export class ReplayGovernanceService {
  authorize(input: {
    integrityScore: number;
    replayCount: number;
    maxReplayCount: number;
  }) {
    const approved =
      input.integrityScore >= 80 &&
      input.replayCount < input.maxReplayCount;

    return {
      approved,
      reason: approved ? "replay-approved" : "replay-blocked",
    };
  }
}
