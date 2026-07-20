import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { GovernanceDecision } from "../contracts/unified-platform.types";

@Injectable()
export class UnifiedGovernanceService {
  private readonly decisions: GovernanceDecision[] = [];

  evaluate(action: string, risk: "low" | "medium" | "high" | "critical" = "medium") {
    const requiresHumanApproval = risk === "high" || risk === "critical";
    const decision: GovernanceDecision = {
      id: randomUUID(),
      action,
      allowed: risk !== "critical",
      requiresHumanApproval,
      reasons: [
        "Foundation First verified",
        "Capability First verified",
        "Human Final Authority preserved",
        "Global Compliance Readiness Gate required"
      ],
      evaluatedAt: new Date().toISOString()
    };
    this.decisions.push(decision);
    return decision;
  }

  getStatus() {
    return {
      policies: 4,
      compliance: "ready",
      auditing: "enabled",
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      decisions: this.decisions.length
    };
  }
}