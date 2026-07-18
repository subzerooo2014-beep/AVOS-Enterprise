import { Injectable } from "@nestjs/common";
import { CodeGenerationSessionRegistry } from "../registry/code-generation-session.registry";

@Injectable()
export class CodeGenerationApprovalService {
  constructor(private readonly sessions: CodeGenerationSessionRegistry) {}

  decide(sessionId: string, approved: boolean, decidedBy: string, reason: string) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Generation session not found: ${sessionId}`);
    session.stage = approved ? "approved" : "failed";
    session.approvedBy = decidedBy;
    session.events.push(`${approved ? "approved" : "rejected"}:${decidedBy}:${reason}`);
    return this.sessions.save(session);
  }
}
