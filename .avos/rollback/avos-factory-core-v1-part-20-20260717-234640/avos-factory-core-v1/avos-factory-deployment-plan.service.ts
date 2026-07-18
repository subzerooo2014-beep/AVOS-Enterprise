import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryDeploymentPlan
} from "./avos-factory-deployment-governance.contracts";
import {
  AvosFactoryCertificateRegistryService
} from "./avos-factory-certificate-registry.service";
import {
  AvosFactoryPromotionPolicyRegistryService
} from "./avos-factory-promotion-policy-registry.service";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";

@Injectable()
export class AvosFactoryDeploymentPlanService {
  private readonly plans: AvosFactoryDeploymentPlan[] = [];

  constructor(
    private readonly certificates: AvosFactoryCertificateRegistryService,
    private readonly policies: AvosFactoryPromotionPolicyRegistryService,
    private readonly audit: AvosFactoryAuditService
  ) {}

  create(input: {
    subjectId: string;
    certificateId: string;
    version: string;
    sourceEnvironment: AvosFactoryDeploymentPlan["sourceEnvironment"];
    target: AvosFactoryDeploymentPlan["target"];
    strategy: AvosFactoryDeploymentPlan["strategy"];
    riskScore: number;
    requestedBy: string;
  }): AvosFactoryDeploymentPlan {
    const certificate = this.certificates.get(input.certificateId);

    if (!certificate || certificate.status !== "certified") {
      throw new BadRequestException(
        "An active Factory certificate is required."
      );
    }

    const policy = this.policies.resolve(
      input.sourceEnvironment,
      input.target.environment
    );

    if (!policy) {
      throw new BadRequestException(
        `No enabled promotion policy exists for ${input.sourceEnvironment} -> ${input.target.environment}.`
      );
    }

    if (certificate.score < policy.minimumCertificateScore) {
      throw new BadRequestException(
        `Certificate score ${certificate.score} is below the required score ${policy.minimumCertificateScore}.`
      );
    }

    const riskScore = Math.max(
      0,
      Math.min(100, Math.round(input.riskScore))
    );

    if (riskScore > policy.maximumRiskScore) {
      throw new BadRequestException(
        `Deployment risk score ${riskScore} exceeds policy maximum ${policy.maximumRiskScore}.`
      );
    }

    const now = new Date().toISOString();

    const plan: AvosFactoryDeploymentPlan = {
      id: randomUUID(),
      subjectId: input.subjectId,
      certificateId: input.certificateId,
      version: input.version,
      sourceEnvironment: input.sourceEnvironment,
      target: structuredClone(input.target),
      strategy: input.strategy,
      riskScore,
      rollbackEnabled: policy.allowAutomaticRollback,
      status: "validated",
      requestedBy: input.requestedBy,
      humanApproved: false,
      createdAt: now,
      updatedAt: now
    };

    this.plans.unshift(plan);

    this.audit.append({
      category: "operations",
      action: "factory-deployment-plan-created",
      actor: input.requestedBy,
      success: true,
      resourceId: plan.id,
      details: {
        subjectId: plan.subjectId,
        version: plan.version,
        sourceEnvironment: plan.sourceEnvironment,
        targetEnvironment: plan.target.environment,
        strategy: plan.strategy,
        riskScore: plan.riskScore
      }
    });

    return structuredClone(plan);
  }

  update(
    planId: string,
    patch: Partial<
      Pick<
        AvosFactoryDeploymentPlan,
        "status" | "approvedBy" | "humanApproved" | "updatedAt"
      >
    >
  ): AvosFactoryDeploymentPlan {
    const plan = this.plans.find((candidate) => candidate.id === planId);

    if (!plan) {
      throw new BadRequestException(`Deployment plan not found: ${planId}`);
    }

    Object.assign(plan, patch, { updatedAt: new Date().toISOString() });
    return structuredClone(plan);
  }

  get(planId: string): AvosFactoryDeploymentPlan | undefined {
    const plan = this.plans.find((candidate) => candidate.id === planId);
    return plan ? structuredClone(plan) : undefined;
  }

  list(limit = 100): AvosFactoryDeploymentPlan[] {
    return this.plans
      .slice(0, Math.max(1, Math.min(limit, 1000)))
      .map((plan) => structuredClone(plan));
  }
}
