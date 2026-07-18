import { BadRequestException, Injectable } from "@nestjs/common";
import {
  GenesisHumanDecision,
  GenesisSession,
} from "../types/genesis-platform.types";

@Injectable()
export class HumanApprovalService {
  applyDecision(
    session: GenesisSession,
    input: GenesisHumanDecision,
  ): GenesisSession {
    if (!input.decidedBy?.trim()) {
      throw new BadRequestException("decidedBy is required.");
    }

    if (!input.reason?.trim()) {
      throw new BadRequestException("A decision reason is required.");
    }

    const approved = input.decision === "approve";
    const timestamp = new Date().toISOString();

    return {
      ...session,
      stage: approved ? "approved" : "failed",
      approvalState: approved ? "approved" : "rejected",
      updatedAt: timestamp,
      events: [
        ...session.events,
        {
          id: `event:human-decision:${timestamp}`,
          sessionId: session.id,
          type: "human-decision",
          message: approved
            ? `Approved by ${input.decidedBy}.`
            : `Rejected by ${input.decidedBy}.`,
          timestamp,
          metadata: {
            decidedBy: input.decidedBy,
            decision: input.decision,
            reason: input.reason,
          },
        },
      ],
    };
  }
}
