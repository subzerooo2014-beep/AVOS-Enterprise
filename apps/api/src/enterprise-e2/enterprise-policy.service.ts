import { Injectable } from "@nestjs/common";

@Injectable()
export class EnterprisePolicyService {
  evaluate(input: {
    riskScore?: number;
    complianceScore?: number;
    priority?: number;
  }) {
    const riskScore = input.riskScore ?? 0;
    const complianceScore = input.complianceScore ?? 100;
    const allowed = riskScore < 80 && complianceScore >= 60;

    return {
      allowed,
      policyVersion: "E2.1",
      priority: input.priority ?? 50,
      reason: allowed ? "policy-approved" : "policy-blocked",
    };
  }
}
