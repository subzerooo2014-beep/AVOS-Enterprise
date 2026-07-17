import { Injectable, PreconditionFailedException } from "@nestjs/common";
import { IntelligenceFoundationSmokeService } from "./intelligence-foundation-smoke.service";
import { IntelligenceFoundationVerificationService } from "./intelligence-foundation-verification.service";

@Injectable()
export class IntelligenceFoundationCertificationService {
  private certification?: Record<string, unknown>;

  constructor(
    private readonly verification: IntelligenceFoundationVerificationService,
    private readonly smoke: IntelligenceFoundationSmokeService,
  ) {}

  async certify(): Promise<Record<string, unknown>> {
    const verification = await this.verification.run();
    const smoke = await this.smoke.run();
    const smokeScore = typeof smoke.score === "number" ? smoke.score : 0;
    const score = Math.round((verification.score + smokeScore) / 2);

    if (verification.status !== "passed" || smoke.status !== "passed") {
      throw new PreconditionFailedException({
        message: "IF-1 certification rejected.",
        verification,
        smoke,
      });
    }

    this.certification = {
      id: `intelligence-fabric-if1-certification:${Date.now()}`,
      verificationId: verification.id,
      status: "certified",
      score,
      level:
        score >= 95 ? "excellent" : score >= 80 ? "good" : "needs-improvement",
      blockingFindings: [],
      certifiedAt: new Date().toISOString(),
    };

    return this.certification;
  }

  latest(): Record<string, unknown> | undefined {
    return this.certification;
  }
}