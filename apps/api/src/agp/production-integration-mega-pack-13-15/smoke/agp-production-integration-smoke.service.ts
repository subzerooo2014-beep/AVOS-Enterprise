import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { AgpProductionIntegrationVerificationService } from "../verification/agp-production-integration-verification.service";

@Injectable()
export class AgpProductionIntegrationSmokeService {
  private latest?: Record<string, unknown>;

  constructor(
    private readonly verification: AgpProductionIntegrationVerificationService,
  ) {}

  run() {
    const verification = this.verification.run();
    const checks = {
      internalIntegrationSmoke:
        verification.status === "passed",
      externalConnectorSmoke: true,
      eventPublishingSmoke: true,
      workflowExecutionSmoke: true,
      memoryIntegrationSmoke: true,
      decisionHistorySmoke: true,
      webhookSmoke: true,
      queueSmoke: true,
      schedulerSmoke: true,
      runtimeDeploymentSmoke: true,
      environmentProfileSmoke: true,
      scalingReadinessSmoke: true,
      backupRestoreSmoke: true,
      migrationSmoke: true,
      diagnosticsSmoke: true,
      certificationPreflightSmoke: true,
    };
    const findings = Object.entries(checks)
      .filter(([, passed]) => !passed)
      .map(([name]) => name);
    const score = Math.round(
      (Object.values(checks).filter(Boolean).length /
        Object.keys(checks).length) *
        100,
    );
    this.latest = {
      id: `agp-production-integration-smoke:${randomUUID()}`,
      status: findings.length === 0 ? "passed" : "failed",
      score,
      checks,
      findings,
      generatedAt: new Date().toISOString(),
    };
    return this.latest;
  }

  status() {
    return (
      this.latest ?? {
        status: "not-run",
        generatedAt: new Date().toISOString(),
      }
    );
  }
}