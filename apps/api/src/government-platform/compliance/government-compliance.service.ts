import { Injectable } from "@nestjs/common";
import { GovernmentCompliancePolicy } from "../policies/government-compliance.policy";
@Injectable()
export class GovernmentComplianceService {
  constructor(private readonly policy: GovernmentCompliancePolicy) {}
  evaluate(input: {
    consentValid: boolean;
    auditPresent: boolean;
    evidencePresent: boolean;
  }) {
    return this.policy.evaluate(input);
  }
}
