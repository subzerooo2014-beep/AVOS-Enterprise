import { Injectable } from "@nestjs/common";
import { EnterpriseAutonomousDecisionService } from "./enterprise-autonomous-decision.service";
import { EnterprisePolicyGuardService } from "./enterprise-policy-guard.service";

@Injectable()
export class EnterpriseDecisionOrchestratorService {
  constructor(
    private readonly decisions: EnterpriseAutonomousDecisionService,
    private readonly policy: EnterprisePolicyGuardService,
  ) {}

  run() {
    const proposed = this.decisions.propose();
    const governance = this.policy.evaluate(proposed);

    if (!governance.policyAllowed) {
      return {
        success: false,
        status: "BLOCKED",
        decision: proposed,
        governance,
        completedAt: new Date().toISOString(),
      };
    }

    const executed = this.decisions.execute(proposed.id);

    return {
      success: executed.status === "EXECUTED",
      status: executed.status,
      decision: executed,
      governance,
      completedAt: new Date().toISOString(),
    };
  }
}