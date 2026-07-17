import { Injectable, PreconditionFailedException } from "@nestjs/common";
import { KnowledgeFabricCertification } from "../contracts/knowledge-fabric-production.contracts";
import { KnowledgeFabricProductionSmokeService } from "./knowledge-fabric-production-smoke.service";
import { KnowledgeFabricProductionVerificationService } from "./knowledge-fabric-production-verification.service";

@Injectable()
export class KnowledgeFabricProductionCertificationService {
  private lastCertification?: KnowledgeFabricCertification;

  constructor(
    private readonly verification: KnowledgeFabricProductionVerificationService,
    private readonly smoke: KnowledgeFabricProductionSmokeService,
  ) {}

  async certify(): Promise<KnowledgeFabricCertification> {
    const verification = await this.verification.run();
    const smoke = await this.smoke.run();
    const smokeScore =
      typeof smoke.score === "number" ? smoke.score : 0;
    const score = Math.round((verification.score + smokeScore) / 2);
    const blockingFindings = [
      ...verification.findings,
      ...(smoke.status === "passed" ? [] : ["productionSmokeTest"]),
    ];

    if (verification.status !== "passed" || smoke.status !== "passed") {
      throw new PreconditionFailedException({
        message: "Knowledge Fabric production certification rejected.",
        verification,
        smoke,
      });
    }

    this.lastCertification = {
      id: `knowledge-fabric-production-certification:${Date.now()}`,
      verificationId: verification.id,
      status: "certified",
      score,
      level:
        score >= 95 ? "excellent" : score >= 80 ? "good" : "needs-improvement",
      blockingFindings,
      certifiedAt: new Date().toISOString(),
    };

    return this.lastCertification;
  }

  latest(): KnowledgeFabricCertification | undefined {
    return this.lastCertification;
  }
}