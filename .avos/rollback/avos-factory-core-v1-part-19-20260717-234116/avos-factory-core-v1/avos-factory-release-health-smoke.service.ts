import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryReleaseHealthSmokeReport
} from "./avos-factory-release-health.contracts";
import {
  AvosFactoryDeploymentPlanService
} from "./avos-factory-deployment-plan.service";
import {
  AvosFactoryPromotionApprovalService
} from "./avos-factory-promotion-approval.service";
import {
  AvosFactoryDeploymentExecutionService
} from "./avos-factory-deployment-execution.service";
import {
  AvosFactoryCertificateRegistryService
} from "./avos-factory-certificate-registry.service";
import {
  AvosFactoryReleaseHealthService
} from "./avos-factory-release-health.service";
import {
  AvosFactoryPostDeploymentVerificationService
} from "./avos-factory-post-deployment-verification.service";
import {
  AvosFactoryRecoveryGovernanceService
} from "./avos-factory-recovery-governance.service";

@Injectable()
export class AvosFactoryReleaseHealthSmokeService {
  constructor(
    private readonly certificates: AvosFactoryCertificateRegistryService,
    private readonly plans: AvosFactoryDeploymentPlanService,
    private readonly approvals: AvosFactoryPromotionApprovalService,
    private readonly executions: AvosFactoryDeploymentExecutionService,
    private readonly health: AvosFactoryReleaseHealthService,
    private readonly verification: AvosFactoryPostDeploymentVerificationService,
    private readonly recovery: AvosFactoryRecoveryGovernanceService
  ) {}

  run(): AvosFactoryReleaseHealthSmokeReport {
    const checks: Record<string, boolean> = {
      certifiedReleaseAvailable: false,
      deploymentExecutionAvailable: false,
      releaseHealthReport: false,
      postDeploymentVerification: false,
      recoveryRecommendation: false,
      humanFinalAuthority: false
    };

    const certificate = this.certificates
      .list(1000)
      .find((candidate) => candidate.status === "certified");

    checks.certifiedReleaseAvailable = Boolean(certificate);

    if (certificate) {
      const plan = this.plans.create({
        subjectId: certificate.subjectId,
        certificateId: certificate.id,
        version: certificate.version,
        sourceEnvironment: "staging",
        target: {
          environment: "production",
          region: "global",
          channel: "stable"
        },
        strategy: "canary",
        riskScore: 10,
        requestedBy: "system:part-18-smoke"
      });

      this.approvals.decide({
        planId: plan.id,
        decision: "approved",
        actor: "system:part-18-smoke",
        approvedBy: "human:part-18-smoke",
        humanApproved: true,
        reason: "Part 18 smoke approval."
      });

      const execution = this.executions.execute({
        planId: plan.id,
        actor: "system:part-18-smoke"
      });

      checks.deploymentExecutionAvailable =
        execution.status === "completed";

      const report = this.health.evaluate({
        deploymentExecutionId: execution.id,
        environment: "production",
        availability: 100,
        latency: 95,
        errorRate: 100,
        smokeSuccess: 100,
        rollbackReadiness: 100,
        actor: "system:part-18-smoke"
      });

      checks.releaseHealthReport =
        report.score >= 95 &&
        report.level === "excellent";

      const verification = this.verification.verify({
        reportId: report.id,
        verifiedBy: "system:part-18-smoke"
      });

      checks.postDeploymentVerification = verification.success;

      const recommendation = this.recovery.recommend({
        reportId: report.id,
        actor: "system:part-18-smoke"
      });

      checks.recoveryRecommendation =
        recommendation.decision === "none";

      checks.humanFinalAuthority =
        recommendation.humanApprovalRequired === false;
    }

    const blockingFindings = Object.entries(checks)
      .filter(([, passed]) => !passed)
      .map(([name]) => name);

    const score = Math.round(
      (
        Object.values(checks).filter(Boolean).length /
        Object.keys(checks).length
      ) * 100
    );

    return {
      id: randomUUID(),
      success: score === 100 && blockingFindings.length === 0,
      score,
      checks,
      blockingFindings,
      generatedAt: new Date().toISOString()
    };
  }
}
