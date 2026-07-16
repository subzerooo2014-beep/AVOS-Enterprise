import { Injectable } from "@nestjs/common";
import {
  CAPABILITY_FABRIC_REVIEW_PILLARS,
  CAPABILITY_FABRIC_REVIEW_VERSION,
} from "./capability-fabric-review.registry";
import { CapabilityFabricConsolidationService } from "./capability-fabric-consolidation.service";
import { CapabilityFabricScannerService } from "./capability-fabric-scanner.service";
import {
  ArchitectureLayerReview,
  CapabilityFabricReadinessReport,
  CapabilityFabricReviewSnapshot,
} from "./capability-fabric-review.types";

@Injectable()
export class CapabilityFabricReviewService {
  private reviews: ArchitectureLayerReview[] = [];
  private report?: CapabilityFabricReadinessReport;

  constructor(
    private readonly scanner: CapabilityFabricScannerService,
    private readonly consolidation: CapabilityFabricConsolidationService,
  ) {}

  framework() {
    return {
      success: true,
      system: "AVOS Capability Fabric",
      pack: "Architecture Review and Consolidation",
      version: CAPABILITY_FABRIC_REVIEW_VERSION,
      foundationFirst: true,
      status: "OPERATIONAL",
      pillars: [...CAPABILITY_FABRIC_REVIEW_PILLARS],
      snapshot: this.snapshot(),
    };
  }

  run(repoRoot = process.cwd()) {
    this.reviews = this.scanner.scan(repoRoot);
    const decisions = this.consolidation.decide(this.reviews);
    const findings = this.reviews.flatMap((review) => review.findings);
    const architectureScore =
      this.reviews.length === 0
        ? 0
        : this.reviews.reduce((total, review) => total + review.score, 0) /
          this.reviews.length;
    const blockingFindings = findings.filter((finding) => finding.blocking);
    const highFindings = findings.filter(
      (finding) => finding.severity === "HIGH",
    );
    const mediumFindings = findings.filter(
      (finding) => finding.severity === "MEDIUM",
    );
    const knowledgeFabricReady =
      blockingFindings.length === 0 && architectureScore >= 75;

    this.report = {
      system: "AVOS Capability Fabric",
      version: "Foundation V1",
      architectureScore: Math.round(architectureScore * 100) / 100,
      foundationFirst: true,
      layersReviewed: this.reviews.length,
      blockingFindings: blockingFindings.length,
      highFindings: highFindings.length,
      mediumFindings: mediumFindings.length,
      decisions,
      knowledgeFabricReady,
      readinessReason: knowledgeFabricReady
        ? "Capability Fabric Foundation V1 is structurally ready for Knowledge Fabric."
        : "Resolve blocking findings before starting Knowledge Fabric.",
      generatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      reviews: structuredClone(this.reviews),
      report: structuredClone(this.report),
    };
  }

  getReviews() {
    return structuredClone(this.reviews);
  }

  getReport() {
    return this.report ? structuredClone(this.report) : null;
  }

  snapshot(): CapabilityFabricReviewSnapshot {
    const findings = this.reviews.flatMap((review) => review.findings);
    return {
      reviews: this.reviews.length,
      findings: findings.length,
      blockingFindings: findings.filter((finding) => finding.blocking).length,
      decisions: this.report?.decisions.length ?? 0,
      architectureScore: this.report?.architectureScore ?? 0,
      knowledgeFabricReady: this.report?.knowledgeFabricReady ?? false,
      generatedAt: new Date().toISOString(),
    };
  }
}