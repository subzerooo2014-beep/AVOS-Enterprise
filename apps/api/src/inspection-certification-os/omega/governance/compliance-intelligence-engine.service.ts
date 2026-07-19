import { Injectable } from "@nestjs/common";
import { GovernancePolicyEngineService } from "./governance-policy-engine.service";

@Injectable()
export class ComplianceIntelligenceEngineService {
  constructor(
    private readonly policies: GovernancePolicyEngineService,
  ) {}

  evaluate(input: {
    readonly trust: number;
    readonly explainability: number;
    readonly traceability: number;
    readonly provenance: number;
    readonly humanFinalAuthority: boolean;
  }) {
    const results = this.policies.all().map((policy) => {
      const failures: string[] = [];

      if (input.trust < policy.minimumTrust) failures.push("trust");
      if (input.explainability < policy.minimumExplainability) {
        failures.push("explainability");
      }
      if (input.traceability < policy.minimumTraceability) {
        failures.push("traceability");
      }
      if (input.provenance < policy.minimumProvenance) {
        failures.push("provenance");
      }
      if (policy.requireHumanApproval && !input.humanFinalAuthority) {
        failures.push("human-final-authority");
      }

      return {
        policyId: policy.id,
        compliant: failures.length === 0,
        failures,
      };
    });

    const compliant = results.filter((result) => result.compliant).length;

    return {
      score: Number(
        ((compliant / Math.max(1, results.length)) * 100).toFixed(2),
      ),
      results,
    };
  }
}
