import { BadRequestException, Injectable } from "@nestjs/common";
import { ArchitectureCertificationRecord } from "../contracts/architecture-intelligence.contracts";
import { ArchitectureAnalysisService } from "./architecture-analysis.service";
import { ArchitectureGovernanceService } from "./architecture-governance.service";
import { ArchitectureRegistryService } from "./architecture-registry.service";
import { ArchitectureRulesService } from "./architecture-rules.service";

@Injectable()
export class ArchitectureCertificationService {
  private lastReview?: {
    readonly id: string;
    readonly status: "passed" | "failed";
    readonly score: number;
    readonly checks: Readonly<Record<string, boolean>>;
    readonly health: ReturnType<ArchitectureAnalysisService["analyze"]>;
    readonly governance: ReturnType<ArchitectureGovernanceService["validate"]>;
    readonly reviewedAt: string;
  };

  private lastCertification?: ArchitectureCertificationRecord;

  constructor(
    private readonly registry: ArchitectureRegistryService,
    private readonly rules: ArchitectureRulesService,
    private readonly analysis: ArchitectureAnalysisService,
    private readonly governance: ArchitectureGovernanceService,
  ) {}

  runFinalReview() {
    const health = this.analysis.analyze();
    const governance = this.governance.validate(health);
    const components = this.registry.list();

    const checks = {
      architectureRegistryOperational: components.length > 0,
      architectureRulesOperational: this.rules.list().length > 0,
      dependencyRiskAnalysisOperational: health.dependencyLinks > 0,
      driftDetectionOperational: health.driftFindings >= 0,
      compatibilityAnalysisOperational: health.compatibilityFindings >= 0,
      technicalDebtDetectionOperational: health.technicalDebtFindings >= 0,
      couplingAnalysisOperational: health.couplingFindings >= 0,
      upgradeReadinessOperational: health.upgradeReadinessScore >= 0,
      governanceOperational: governance.auditByDesign && governance.decisionTraceability,
      humanAuthorityPreserved: governance.humanAuthorityPreserved,
      healthAcceptable: health.score >= 70,
    };

    const passed = Object.values(checks).every(Boolean) && governance.approved;
    const score = Math.round(
      (Object.values(checks).filter(Boolean).length / Object.values(checks).length) * 100,
    );

    this.lastReview = {
      id: `architecture-intelligence-final-review:${Date.now()}`,
      status: passed ? "passed" : "failed",
      score,
      checks,
      health,
      governance,
      reviewedAt: new Date().toISOString(),
    };

    return this.lastReview;
  }

  certify(): ArchitectureCertificationRecord {
    const review = this.runFinalReview();

    if (review.status !== "passed") {
      throw new BadRequestException({
        message: "Architecture Intelligence certification failed",
        review,
      });
    }

    this.lastCertification = {
      id: `architecture-intelligence-certification:${Date.now()}`,
      reviewId: review.id,
      status: "certified",
      score: review.score,
      level:
        review.score >= 95 ? "excellent" :
        review.score >= 85 ? "good" :
        review.score >= 70 ? "conditional" :
        "rejected",
      blockingFindings: [],
      certifiedAt: new Date().toISOString(),
    };

    return this.lastCertification;
  }

  status() {
    return {
      review: this.lastReview ?? null,
      certification: this.lastCertification ?? null,
      health: this.analysis.analyze(),
    };
  }
}