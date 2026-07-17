
import { Injectable } from "@nestjs/common";

@Injectable()
export class KnowledgeGovernanceMetricsService {
  private evaluations = 0;
  private allowed = 0;
  private reviewed = 0;
  private denied = 0;
  private approvalsRequested = 0;

  record(decision: "ALLOW" | "REVIEW" | "DENY", approvalRequested: boolean): void {
    this.evaluations += 1;
    if (decision === "ALLOW") this.allowed += 1;
    if (decision === "REVIEW") this.reviewed += 1;
    if (decision === "DENY") this.denied += 1;
    if (approvalRequested) this.approvalsRequested += 1;
  }

  snapshot(): Record<string, number> {
    return { evaluations: this.evaluations, allowed: this.allowed, reviewed: this.reviewed, denied: this.denied, approvalsRequested: this.approvalsRequested };
  }
}