import { Injectable } from "@nestjs/common";
import { AdaptiveGrowthApprovalGovernanceService } from "./adaptive-growth-approval-governance.service";

@Injectable()
export class AdaptiveGrowthApprovalGovernanceVerificationService {
  private latest:
    | Record<string, unknown>
    | undefined;

  constructor(
    private readonly governance:
      AdaptiveGrowthApprovalGovernanceService,
  ) {}

  run() {
    const status =
      this.governance.status();

    const checks = {
      approvalGovernanceEngine:
        status.components
          .approvalGovernanceEngine,
      humanFinalAuthority:
        status.components
          .humanFinalAuthority,
      decisionAudit:
        status.components.decisionAudit,
      approvalQueue:
        status.components.approvalQueue,
      policyEngine:
        status.components.policyEngine,
      decisionSignature:
        status.components
          .decisionSignature,
      explainability:
        status.components.explainability,
      evidenceEngine:
        status.components.evidenceEngine,
      executionCoreIntegration:
        status.components
          .executionCoreIntegration,
      foundationApprovalBridgeRemoved:
        status.foundationApprovalBridgeRemoved,
      machineFinalApprovalDenied:
        !status.machineFinalApprovalAllowed,
    };

    const passed = Object.values(checks).every(
      Boolean,
    );

    this.latest = {
      id: `ags-mp2b-verification:${Date.now()}`,
      status: passed ? "passed" : "failed",
      score:
        (Object.values(checks).filter(Boolean)
          .length /
          Object.keys(checks).length) *
        100,
      checks,
      verifiedAt:
        new Date().toISOString(),
    };

    return this.latest;
  }

  status() {
    return (
      this.latest ?? {
        status: "not-run",
      }
    );
  }
}