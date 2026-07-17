import {
  Injectable,
  PreconditionFailedException,
} from "@nestjs/common";
import { IntelligenceEvolutionEngineService } from "./intelligence-evolution-engine.service";
import { IntelligenceFabricFinalReviewService } from "./intelligence-fabric-final-review.service";

@Injectable()
export class IntelligenceFabricFinalCertificationService {
  private certification?: Record<string, unknown>;

  constructor(
    private readonly review: IntelligenceFabricFinalReviewService,
    private readonly evolution: IntelligenceEvolutionEngineService,
  ) {}

  async certify(): Promise<Record<string, unknown>> {
    const review = await this.review.run();
    const score = typeof review.score === "number" ? review.score : 0;

    if (review.status !== "passed" || score < 100) {
      throw new PreconditionFailedException({
        message: "Intelligence Fabric final certification rejected.",
        review,
      });
    }

    this.certification = {
      id: `intelligence-fabric-if6-certification:${Date.now()}`,
      reviewId: review.id,
      status: "certified",
      score,
      level: "excellent",
      coveredStages: ["IF-3", "IF-4", "IF-5", "IF-6"],
      blockingFindings: [],
      evolution: this.evolution.snapshot("certified"),
      certifiedAt: new Date().toISOString(),
    };

    return this.certification;
  }

  status(): Record<string, unknown> {
    return {
      review: this.review.getLatest() ?? null,
      certification: this.certification ?? null,
      evolution: this.evolution.snapshot(
        this.certification ? "certified" : "not-certified",
      ),
    };
  }
}