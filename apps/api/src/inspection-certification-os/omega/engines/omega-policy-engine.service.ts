import { Injectable } from "@nestjs/common";
import { OmegaDecision, OmegaPolicy, OmegaScore } from "../omega.types";

@Injectable()
export class OmegaPolicyEngineService {
  private readonly policies: OmegaPolicy[] = [
    {
      id: "omega.policy.production-readiness",
      name: "Production Readiness",
      minimumQuality: 80,
      maximumRisk: 25,
      minimumTrust: 80,
      requireHumanApproval: true,
    },
    {
      id: "omega.policy.enterprise-certification",
      name: "Enterprise Certification",
      minimumQuality: 90,
      maximumRisk: 15,
      minimumTrust: 90,
      requireHumanApproval: true,
    },
  ];

  list(): readonly OmegaPolicy[] {
    return [...this.policies];
  }

  decide(score: OmegaScore): {
    readonly decision: OmegaDecision;
    readonly evaluated: number;
    readonly matched: number;
    readonly humanApprovalRequired: true;
  } {
    const matched = this.policies.filter(
      (policy) =>
        score.quality >= policy.minimumQuality &&
        score.risk <= policy.maximumRisk &&
        score.trust >= policy.minimumTrust,
    ).length;

    const decision: OmegaDecision =
      matched === this.policies.length
        ? "approved"
        : matched > 0
          ? "conditional"
          : "rejected";

    return {
      decision,
      evaluated: this.policies.length,
      matched,
      humanApprovalRequired: true,
    };
  }
}
