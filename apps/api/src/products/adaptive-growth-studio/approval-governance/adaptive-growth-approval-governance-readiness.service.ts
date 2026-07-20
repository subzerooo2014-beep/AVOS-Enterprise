import { Injectable } from "@nestjs/common";
import { AdaptiveGrowthApprovalGovernanceService } from "./adaptive-growth-approval-governance.service";
import { AdaptiveGrowthApprovalGovernanceVerificationService } from "./adaptive-growth-approval-governance-verification.service";

@Injectable()
export class AdaptiveGrowthApprovalGovernanceReadinessService {
  private latest:
    | Record<string, unknown>
    | undefined;

  constructor(
    private readonly governance:
      AdaptiveGrowthApprovalGovernanceService,
    private readonly verification:
      AdaptiveGrowthApprovalGovernanceVerificationService,
  ) {}

  run() {
    const status =
      this.governance.status();

    const verification =
      this.verification.run();

    const checks = {
      governanceOperational:
        status.status === "operational",
      verificationPassed:
        verification.status === "passed",
      humanFinalAuthority:
        status.humanFinalAuthority,
      approvalBypassRemoved:
        status.foundationApprovalBridgeRemoved,
      auditReady:
        status.audit.status ===
        "operational",
      signatureIntegrity:
        status.signature
          .integrityProtected,
      executionIntegration:
        status.components
          .executionCoreIntegration,
    };

    const ready = Object.values(checks).every(
      Boolean,
    );

    this.latest = {
      id: `ags-mp2b-readiness:${Date.now()}`,
      status: ready ? "ready" : "not-ready",
      score:
        (Object.values(checks).filter(Boolean)
          .length /
          Object.keys(checks).length) *
        100,
      checks,
      persistenceAdvisory:
        "In-memory governance persistence is suitable for foundation validation; durable persistence remains required before distributed production deployment.",
      evaluatedAt:
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