import {
  BadRequestException,
  Injectable,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  HumanApprovalDecision,
} from "../contracts/adaptive-growth-engine.contracts";

@Injectable()
export class HumanGrowthAuthorityService {
  private readonly decisions: HumanApprovalDecision[] = [];

  decide(input: {
    subjectType: string;
    subjectId: string;
    decision: "approved" | "rejected";
    decidedBy: string;
    reason?: string;
  }): HumanApprovalDecision {
    if (!input.decidedBy?.trim()) {
      throw new BadRequestException("decidedBy is required.");
    }
    const decision: HumanApprovalDecision = {
      id: `aage-human-decision:${randomUUID()}`,
      subjectType: input.subjectType,
      subjectId: input.subjectId,
      decision: input.decision,
      decidedBy: input.decidedBy,
      reason: input.reason,
      decidedAt: new Date().toISOString(),
    };
    this.decisions.push(decision);
    return { ...decision };
  }

  list() {
    return this.decisions.map((item) => ({ ...item }));
  }

  health() {
    return {
      status: "operational",
      decisions: this.decisions.length,
      humanFinalAuthority: true,
      immutableDecisionHistory: true,
      score: 100,
      generatedAt: new Date().toISOString(),
    };
  }
}