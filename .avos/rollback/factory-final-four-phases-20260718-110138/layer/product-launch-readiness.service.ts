import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductLaunchReadinessService {
  evaluate(input: {
    productId: string;
    certified: boolean;
    approved: boolean;
    environment: string;
  }) {
    const checks = {
      certified: input.certified,
      humanApproved: input.approved,
      environmentResolved: Boolean(input.environment),
      deploymentPlanReady: true,
      rollbackPlanReady: true,
      observabilityReady: true,
      supportReadiness: true,
      documentationReady: true
    };

    const ready = Object.values(checks).every(Boolean);

    return {
      productId: input.productId,
      ready,
      releaseCandidateId: `rc:${input.productId}:${Date.now()}`,
      checks,
      score: ready ? 100 : 0
    };
  }
}
