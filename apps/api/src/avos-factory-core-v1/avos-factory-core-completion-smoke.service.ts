import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryCoreCompletionSmokeReport
} from "./avos-factory-core-completion.contracts";
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
import {
  AvosFactoryCoreCompletionValidationService
} from "./avos-factory-core-completion-validation.service";
import {
  AvosFactoryCoreCompletionCertificationService
} from "./avos-factory-core-completion-certification.service";
import {
  AvosFactoryCoreCompletionHealthService
} from "./avos-factory-core-completion-health.service";

@Injectable()
export class AvosFactoryCoreCompletionSmokeService {
  constructor(
    private readonly certificates: AvosFactoryCertificateRegistryService,
    private readonly plans: AvosFactoryDeploymentPlanService,
    private readonly approvals: AvosFactoryPromotionApprovalService,
    private readonly executions: AvosFactoryDeploymentExecutionService,
    private readonly health: AvosFactoryReleaseHealthService,
    private readonly intelligence: AvosFactoryReleaseIntelligenceService,
    private readonly improvements: AvosFactoryContinuousImprovementService,
    private readonly memory: AvosFactoryReleaseLearningMemoryService,
    private readonly validation: AvosFactoryCoreCompletionValidationService,
    private readonly certification: AvosFactoryCoreCompletionCertificationService,
    private readonly finalHealth: AvosFactoryCoreCompletionHealthService
  ) {}

  run(): AvosFactoryCoreCompletionSmokeReport {
    const checks: Record<string, boolean> = {
      baseCertificateAvailable: false,
      deploymentGovernance: false,
      deploymentExecution: false,
      releaseHealth: false,
      releaseIntelligence: false,
      continuousImprovement: false,
      releaseLearningMemory: false,
      finalValidation: false,
      finalCertification: false,
      finalHealth: false,
      humanFinalAuthority: false
    };

    const certificate = this.certificates
      .list(1000)
      .find((candidate) => candidate.status === "certified");

    checks.baseCertificateAvailable = Boolean(certificate);

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
        requestedBy: "system:part-20-smoke"
      });

      this.approvals.decide({
        planId: plan.id,
        decision: "approved",
        actor: "system:part-20-smoke",
        approvedBy: "human:part-20-smoke",
        humanApproved: true,
        reason: "Part 20 final certification smoke approval."
      });

      checks.deploymentGovernance =
        this.plans.get(plan.id)?.status === "approved";

      const execution = this.executions.execute({
        planId: plan.id,
        actor: "system:part-20-smoke"
      });

      checks.deploymentExecution =
        execution.status === "completed";

      const releaseHealth = this.health.evaluate({
        deploymentExecutionId: execution.id,
        environment: "production",
        availability: 100,
        latency: 100,
        errorRate: 100,
        smokeSuccess: 100,
        rollbackReadiness: 100,
        actor: "system:part-20-smoke"
      });

      checks.releaseHealth =
        releaseHealth.score === 100 &&
        releaseHealth.level === "excellent";

      const intelligence = this.intelligence.analyze({
        releaseHealthReportId: releaseHealth.id,
        actor: "system:part-20-smoke"
      });

      checks.releaseIntelligence =
        intelligence.score === 100 &&
        intelligence.level === "excellent";

      const actions = this.improvements.propose({
        intelligenceReportId: intelligence.id,
        actor: "system:part-20-smoke"
      });

      checks.continuousImprovement = actions.length > 0;

      const memory = this.memory.capture({
        intelligenceReportId: intelligence.id,
        actor: "system:part-20-smoke"
      });

      checks.releaseLearningMemory =
        memory.outcome === "successful" &&
        memory.lessons.length > 0;

      const validation = this.validation.run({
        subjectId: certificate.subjectId,
        version: certificate.version,
        actor: "system:part-20-smoke"
      });

      checks.finalValidation =
        validation.status === "passed" &&
        validation.score === 100 &&
        validation.blockingFindings.length === 0;

      const finalCertification = this.certification.certify({
        validationReportId: validation.id,
        certifiedBy: "system:factory-final-certification",
        approvedBy: "human:part-20-smoke",
        humanApproved: true
      });

      checks.finalCertification =
        finalCertification.status === "certified" &&
        finalCertification.score === 100;

      checks.humanFinalAuthority =
        finalCertification.humanApproved &&
        Boolean(finalCertification.approvedBy);

      const healthReport = this.finalHealth.calculate();

      checks.finalHealth =
        healthReport.score === 100 &&
        healthReport.level === "excellent";
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
