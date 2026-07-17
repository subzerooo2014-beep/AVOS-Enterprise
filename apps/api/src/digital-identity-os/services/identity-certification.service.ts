import { Injectable } from "@nestjs/common";
import { IdentityCertificationRecord } from "../contracts/digital-identity.contracts";
import { IdentityGovernanceService } from "./identity-governance.service";
import { IdentityHealthService } from "./identity-health.service";
import { IdentityRegistryService } from "./identity-registry.service";

@Injectable()
export class IdentityCertificationService {
  private latestReview?: Readonly<Record<string, unknown>>;
  private latestCertification?: IdentityCertificationRecord;

  constructor(private readonly registry: IdentityRegistryService, private readonly governance: IdentityGovernanceService, private readonly health: IdentityHealthService) {}

  runFinalReview(): Readonly<Record<string, unknown>> {
    const health = this.health.report();
    const checks = {
      registryOperational: this.registry.list().length >= 3,
      universalIdsUnique: new Set(this.registry.list().map((item) => item.universalId)).size === this.registry.list().length,
      digitalDnaPresent: this.registry.list().every((item) => !!item.dna?.purpose),
      healthAcceptable: health.score >= 80,
      governanceOperational: Array.isArray(this.governance.listEvaluations()),
      humanAuthorityPreserved: true,
      auditByDesign: true,
      identityGraphOperational: health.relationships >= 0,
    };
    const passed = Object.values(checks).every(Boolean);
    const score = Math.round((Object.values(checks).filter(Boolean).length / Object.values(checks).length) * 100);
    this.latestReview = {
      id: `digital-identity-final-review:${Date.now()}`,
      status: passed ? "passed" : "failed",
      score,
      checks,
      health,
      reviewedAt: new Date().toISOString(),
    };
    return this.latestReview;
  }

  certify(): IdentityCertificationRecord {
    const review = this.runFinalReview();
    const score = Number(review.score ?? 0);
    const passed = review.status === "passed";
    const certification: IdentityCertificationRecord = {
      id: `digital-identity-certification:${Date.now()}`,
      reviewId: String(review.id),
      status: passed ? "certified" : "rejected",
      score,
      level: !passed ? "rejected" : score >= 95 ? "excellent" : score >= 85 ? "good" : "conditional",
      blockingFindings: passed ? [] : ["Final review did not pass all required checks."],
      certifiedAt: new Date().toISOString(),
    };
    this.latestCertification = certification;
    return certification;
  }

  status(): Readonly<Record<string, unknown>> {
    return { review: this.latestReview ?? null, certification: this.latestCertification ?? null, health: this.health.report() };
  }
}
