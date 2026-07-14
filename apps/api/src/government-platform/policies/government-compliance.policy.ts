import { Injectable } from "@nestjs/common";
@Injectable()
export class GovernmentCompliancePolicy {
  evaluate(input: { consentValid: boolean; auditPresent: boolean; evidencePresent: boolean }) {
    const compliant = input.consentValid && input.auditPresent && input.evidencePresent;
    return { compliant, decision: compliant ? "ALLOW" : "BLOCK" };
  }
}
