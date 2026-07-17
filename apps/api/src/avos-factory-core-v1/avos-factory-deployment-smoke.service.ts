import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryDeploymentSmokeReport
} from "./avos-factory-deployment-governance.contracts";
import {
  AvosFactoryCertificateRegistryService
} from "./avos-factory-certificate-registry.service";
import {
  AvosFactoryPromotionPolicyRegistryService
} from "./avos-factory-promotion-policy-registry.service";
import {
  AvosFactoryDeploymentPlanService
} from "./avos-factory-deployment-plan.service";
import {
  AvosFactoryPromotionApprovalService
} from "./avos-factory-promotion-approval.service";
import {
  AvosFactoryDeploymentExecutionService
} from "./avos-factory-deployment-execution.service";

@Injectable()
export class AvosFactoryDeploymentSmokeService {
  constructor(
    private readonly certificates: AvosFactoryCertificateRegistryService,
    private readonly policies: AvosFactoryPromotionPolicyRegistryService,
    private readonly plans: AvosFactoryDeploymentPlanService,
    private readonly approvals: AvosFactoryPromotionApprovalService,
    private readonly executions: AvosFactoryDeploymentExecutionService
  ) {}

  run(): AvosFactoryDeploymentSmokeReport {
    const certificate = this.certificates
      .list(1000)
      .find((candidate) => candidate.status === "certified");

    const checks: Record<string, boolean> = {
      certificateAvailable: Boolean(certificate),
      promotionPolicies: this.policies.list().length >= 3,
      deploymentPlan: false,
      humanApproval: false,
      deploymentExecution: false,
      rollbackCapability: false
    };

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
        requestedBy: "system:part-17-smoke"
      });

      checks.deploymentPlan = plan.status === "validated";

      const decision = this.approvals.decide({
        planId: plan.id,
        decision: "approved",
        actor: "system:part-17-smoke",
        approvedBy: "human:part-17-smoke",
        humanApproved: true,
        reason: "Part 17 smoke approval."
      });

      checks.humanApproval =
        decision.decision === "approved" &&
        decision.humanApproved;

      const execution = this.executions.execute({
        planId: plan.id,
        actor: "system:part-17-smoke"
      });

      checks.deploymentExecution =
        execution.status === "completed";

      const rollback = this.executions.rollback({
        executionId: execution.id,
        actor: "system:part-17-smoke",
        reason: "Part 17 controlled rollback verification."
      });

      checks.rollbackCapability = rollback.success;
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
