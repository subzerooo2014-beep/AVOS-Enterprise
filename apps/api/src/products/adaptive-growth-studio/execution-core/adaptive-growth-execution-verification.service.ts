import { Injectable } from "@nestjs/common";
import { AdaptiveGrowthExecutionCoreService } from "./adaptive-growth-execution-core.service";

@Injectable()
export class AdaptiveGrowthExecutionVerificationService {
  private latest:
    | Record<string, unknown>
    | undefined;

  constructor(
    private readonly core:
      AdaptiveGrowthExecutionCoreService,
  ) {}

  run() {
    const status = this.core.status();

    const checks = {
      centralExecutionEngine:
        status.components.centralExecutionEngine,
      executionStateManagement:
        status.components.executionStateManagement,
      executionHistory:
        status.components.executionHistory,
      rollbackEngine:
        status.components.rollbackEngine,
      actionRegistry:
        status.components.actionRegistry,
      executionApi:
        status.components.executionApi,
      humanFinalAuthority:
        status.humanFinalAuthority,
      approvalGovernanceReady:
        status.approvalGovernance ===
        "ready-for-mega-pack-2b",
    };

    const passed = Object.values(checks).every(
      Boolean,
    );

    this.latest = {
      id: `ags-mp2a-verification:${Date.now()}`,
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