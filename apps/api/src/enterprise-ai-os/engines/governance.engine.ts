import { Injectable } from "@nestjs/common";
import { GovernancePolicy } from "../policies/governance.policy";
@Injectable()
export class GovernanceEngine {
  constructor(private readonly policy: GovernancePolicy) {}
  evaluate(input: {
    riskScore: number;
    confidence: number;
    requiresHumanApproval?: boolean;
  }) {
    return this.policy.evaluate(input);
  }
}
