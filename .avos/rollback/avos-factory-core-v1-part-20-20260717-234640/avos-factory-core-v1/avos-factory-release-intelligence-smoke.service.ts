import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryReleaseIntelligenceSmokeReport
} from "./avos-factory-release-intelligence.contracts";
import {
  AvosFactoryCertificateRegistryService
} from "./avos-factory-certificate-registry.service";
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
  AvosFactoryReleaseHealthService
} from "./avos-factory-release-health.service";
import {
  AvosFactoryReleaseIntelligenceService
} from "./avos-factory-release-intelligence.service";
import {
  AvosFactoryContinuousImprovementService
} from "./avos-factory-continuous-improvement.service";
import {
  AvosFactoryReleaseLearningMemoryService
} from "./avos-factory-release-learning-memory.service";

@Injectable()
export class AvosFactoryReleaseIntelligenceSmokeService {
  constructor(
    private readonly certificates: AvosFactoryCertificateRegistryService,
    private readonly plans: AvosFactoryDeploymentPlanService,
    private readonly approvals: AvosFactoryPromotionApprovalService,
    private readonly executions: AvosFactoryDeploymentExecutionService,
    private readonly health: AvosFactoryReleaseHealthService,
    private readonly intelligence: AvosFactoryReleaseIntelligenceService,
    private readonly improvement: AvosFactoryContinuousImprovementService,
    private readonly memory: AvosFactoryReleaseLearningMemoryService
  ) {}

  run(): AvosFactoryReleaseIntelligenceSmokeReport {
    const checks: Record<string, boolean> = {
      certifiedReleaseAvailable: false,
      deploymentExecutionAvailable: false,
      releaseHealthAvailable: false,
      releaseIntelligence: false,
      deploymentLearning: false,
      continuousImprovement: false,
      learningMemory: false,
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
        requestedBy: "system:part-19-smoke"
      });

      this.approvals.decide({
        planId: plan.id,
        decision: "approved",
        actor: "system:part-19-smoke",
        approvedBy: "human:part-19-smoke",
        humanApproved: true,
        reason: "Part 19 smoke approval."
      });

      const execution = this.executions.execute({
        planId: plan.id,
        actor: "system:part-19-smoke"
      });

      checks.deploymentExecutionAvailable =
        execution.status === "completed";

      const health = this.health.evaluate({
        deploymentExecutionId: execution.id,
        environment: "production",
        availability: 100,
        latency: 96,
        errorRate: 100,
        smokeSuccess: 100,
        rollbackReadiness: 100,
        actor: "system:part-19-smoke"
      });

      checks.releaseHealthAvailable =
        health.score >= 95 &&
        health.blockingFindings.length === 0;

      const intelligence = this.intelligence.analyze({
        releaseHealthReportId: health.id,
        actor: "system:part-19-smoke"
      });

      checks.releaseIntelligence =
        intelligence.score >= 95 &&
        intelligence.level === "excellent";

      checks.deploymentLearning =
        intelligence.learningSignals.length > 0;

      const actions = this.improvement.propose({
        intelligenceReportId: intelligence.id,
        actor: "system:part-19-smoke"
      });

      checks.continuousImprovement = actions.length > 0;

      const lowPriorityAction = actions.find(
        (candidate) => !candidate.humanApprovalRequired
      );

      if (lowPriorityAction) {
        const implemented = this.improvement.implement({
          actionId: lowPriorityAction.id,
          actor: "system:part-19-smoke"
        });

        checks.humanFinalAuthority =
          implemented.status === "implemented";
      }
      else {
        const firstAction = actions[0];

        if (firstAction) {
          this.improvement.approve({
            actionId: firstAction.id,
            actor: "system:part-19-smoke",
            approvedBy: "human:part-19-smoke",
            humanApproved: true
          });

          const implemented = this.improvement.implement({
            actionId: firstAction.id,
            actor: "system:part-19-smoke"
          });

          checks.humanFinalAuthority =
            implemented.status === "implemented";
        }
      }

      const memory = this.memory.capture({
        intelligenceReportId: intelligence.id,
        actor: "system:part-19-smoke"
      });

      checks.learningMemory =
        memory.outcome === "successful" &&
        memory.lessons.length > 0;
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
