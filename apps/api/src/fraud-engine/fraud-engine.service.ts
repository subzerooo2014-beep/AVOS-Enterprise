import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class FraudEngineService {
  constructor(private prisma: PrismaService) {}

  private clamp(value: number) {
    return Math.max(0, Math.min(100, Math.round(value)));
  }

  private level(score: number) {
    if (score >= 75) return "high";
    if (score >= 45) return "medium";
    return "low";
  }

  async addSignal(data: any) {
    return (this.prisma as any).fraudSignal.create({
      data: {
        entityType: data.entityType,
        entityId: data.entityId,
        signalType: data.signalType,
        severity: data.severity || "medium",
        score: Number(data.score || 50),
        reason: data.reason || "Fraud signal detected by AVOS AI.",
        metadata: data.metadata || {},
      },
    });
  }

  async assess(data: any) {
    let score = 20;

    if (data.unverified) score += 20;
    if (data.priceTooLow) score += 20;
    if (data.duplicateListing) score += 25;
    if (data.suspiciousContact) score += 20;
    if (data.missingDocuments) score += 15;
    if (data.manyComplaints) score += 25;
    if (data.verified) score -= 15;
    if (data.trustedHistory) score -= 20;

    score = this.clamp(score);
    const level = this.level(score);

    const decision = score >= 75 ? "block_or_manual_review" : score >= 45 ? "manual_review" : "allow";

    return (this.prisma as any).fraudAssessment.create({
      data: {
        entityType: data.entityType,
        entityId: data.entityId,
        fraudScore: score,
        level,
        decision,
        reason: `AI Fraud Engine decision: ${decision}.`,
        signals: data,
      },
    });
  }

  listAssessments() {
    return (this.prisma as any).fraudAssessment.findMany({
      orderBy: { createdAt: "desc" },
    });
  }
}
