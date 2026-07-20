import { Injectable } from "@nestjs/common";

@Injectable()
export class PolicyAwareAutomationService {
  evaluate(input: {
    action: string;
    risk: number;
    cost: number;
    reversible: boolean;
    jurisdiction?: string;
  }) {
    const violations: string[] = [];

    if (input.risk > 85) violations.push("risk-threshold-exceeded");
    if (input.cost > 90) violations.push("cost-threshold-exceeded");
    if (!input.reversible && input.risk > 50) {
      violations.push("irreversible-high-risk-action");
    }

    const requiresHumanApproval =
      input.risk >= 50 ||
      input.cost >= 60 ||
      !input.reversible ||
      violations.length > 0;

    return {
      action: input.action,
      jurisdiction: input.jurisdiction ?? "global",
      allowed: violations.length === 0,
      violations,
      requiresHumanApproval,
      policyVersion: "AEOS-POLICY-1.0",
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      evaluatedAt: new Date().toISOString(),
    };
  }
}