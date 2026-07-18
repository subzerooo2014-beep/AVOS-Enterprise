import { Injectable } from "@nestjs/common";

@Injectable()
export class DeploymentReadinessEngineService {
  evaluate(input: {
    qualityPassed: boolean;
    policyAllowed: boolean;
    architectureValid: boolean;
  }) {
    const checks = {
      qualityPassed: input.qualityPassed,
      policyAllowed: input.policyAllowed,
      architectureValid: input.architectureValid,
      observabilityReady: true,
      rollbackReady: true,
      humanApprovalRequired: true
    };

    const ready =
      input.qualityPassed &&
      input.policyAllowed &&
      input.architectureValid;

    return {
      ready,
      checks,
      score: ready ? 100 : 0
    };
  }
}
