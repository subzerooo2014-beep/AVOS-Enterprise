import { Injectable } from "@nestjs/common";
import { EnterpriseExecutionWave } from "./enterprise-e9.types";

@Injectable()
export class EnterpriseStrategyGovernanceService {
  evaluate(wave: EnterpriseExecutionWave) {
    const approved =
      wave.approved &&
      wave.readinessScore >= 60 &&
      wave.initiativeIds.length > 0;

    return {
      waveId: wave.id,
      approved,
      policy: "enterprise-strategy-governance-e9",
      reason: approved
        ? "Execution wave satisfies readiness and portfolio governance."
        : "Execution wave did not satisfy readiness requirements.",
      evaluatedAt: new Date().toISOString(),
    };
  }
}