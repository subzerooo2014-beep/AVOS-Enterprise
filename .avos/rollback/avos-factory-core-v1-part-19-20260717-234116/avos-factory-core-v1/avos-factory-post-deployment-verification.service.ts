import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryPostDeploymentVerification
} from "./avos-factory-release-health.contracts";
import {
  AvosFactoryReleaseHealthService
} from "./avos-factory-release-health.service";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";

@Injectable()
export class AvosFactoryPostDeploymentVerificationService {
  private readonly verifications: AvosFactoryPostDeploymentVerification[] = [];

  constructor(
    private readonly health: AvosFactoryReleaseHealthService,
    private readonly audit: AvosFactoryAuditService
  ) {}

  verify(input: {
    reportId: string;
    verifiedBy: string;
  }): AvosFactoryPostDeploymentVerification {
    const report = this.health.get(input.reportId);

    if (!report) {
      throw new BadRequestException(
        `Release health report not found: ${input.reportId}`
      );
    }

    const checks: Record<string, boolean> = {
      releaseHealthAvailable: true,
      healthScoreAcceptable: report.score >= 85,
      noCriticalLevel: report.level !== "critical",
      noBlockingFindings: report.blockingFindings.length === 0,
      rollbackReadiness:
        report.metrics.find(
          (metric) => metric.name === "rollbackReadiness"
        )?.passed === true
    };

    const success = Object.values(checks).every(Boolean);

    const verification: AvosFactoryPostDeploymentVerification = {
      id: randomUUID(),
      deploymentExecutionId: report.deploymentExecutionId,
      deploymentPlanId: report.deploymentPlanId,
      success,
      checks,
      reportId: report.id,
      verifiedBy: input.verifiedBy,
      verifiedAt: new Date().toISOString()
    };

    this.verifications.unshift(verification);

    this.audit.append({
      category: "verification",
      action: "factory-post-deployment-verified",
      actor: input.verifiedBy,
      success,
      resourceId: verification.id,
      details: {
        reportId: report.id,
        deploymentExecutionId: report.deploymentExecutionId,
        deploymentPlanId: report.deploymentPlanId,
        checks
      }
    });

    return structuredClone(verification);
  }

  list(limit = 100): AvosFactoryPostDeploymentVerification[] {
    return this.verifications
      .slice(0, Math.max(1, Math.min(limit, 1000)))
      .map((verification) => structuredClone(verification));
  }
}
