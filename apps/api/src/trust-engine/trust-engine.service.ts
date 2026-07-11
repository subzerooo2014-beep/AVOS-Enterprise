import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

type TrustFactors = {
  verified?: boolean;
  completedDeals?: number;
  cancelledDeals?: number;
  disputes?: number;
  fastResponse?: boolean;
  documentsReady?: boolean;
  lateDelivery?: number;
  positiveReviews?: number;
  negativeReviews?: number;
  yearsActive?: number;
};

@Injectable()
export class TrustEngineService {
  constructor(private prisma: PrismaService) {}

  private clamp(value: number) {
    return Math.max(0, Math.min(100, Math.round(value)));
  }

  calculateScore(factors: TrustFactors = {}) {
    let score = 50;

    if (factors.verified) score += 15;
    if (factors.fastResponse) score += 8;
    if (factors.documentsReady) score += 8;
    if (factors.completedDeals) score += Math.min(20, factors.completedDeals * 2);
    if (factors.positiveReviews) score += Math.min(12, factors.positiveReviews);
    if (factors.yearsActive) score += Math.min(10, factors.yearsActive * 2);

    if (factors.disputes) score -= Math.min(30, factors.disputes * 10);
    if (factors.cancelledDeals) score -= Math.min(20, factors.cancelledDeals * 5);
    if (factors.lateDelivery) score -= Math.min(20, factors.lateDelivery * 5);
    if (factors.negativeReviews) score -= Math.min(20, factors.negativeReviews * 4);

    const trustScore = this.clamp(score);
    const riskScore = this.clamp(100 - trustScore);
    const reputationScore = this.clamp((trustScore * 0.7) + ((100 - riskScore) * 0.3));
    const dealScore = this.clamp((trustScore + reputationScore + (100 - riskScore)) / 3);

    return { trustScore, riskScore, reputationScore, dealScore };
  }

  async buildProfile(entityType: string, entityId: string, factors: TrustFactors = {}) {
    const scores = this.calculateScore(factors);

    const summary =
      `AI Trust calculated for ${entityType}. Trust=${scores.trustScore}, Risk=${scores.riskScore}, Reputation=${scores.reputationScore}.`;

    const existing = await (this.prisma as any).trustProfile.findFirst({
      where: { entityType, entityId },
    });

    const data = {
      entityType,
      entityId,
      ...scores,
      verified: !!factors.verified,
      summary,
      factors,
      status: scores.riskScore >= 70 ? "warning" : "active",
    };

    if (existing) {
      return (this.prisma as any).trustProfile.update({
        where: { id: existing.id },
        data,
      });
    }

    return (this.prisma as any).trustProfile.create({ data });
  }

  async explain(entityType: string, entityId: string) {
    const profile = await (this.prisma as any).trustProfile.findFirst({
      where: { entityType, entityId },
      orderBy: { updatedAt: "desc" },
    });

    if (!profile) {
      return {
        entityType,
        entityId,
        message: "No trust profile found yet.",
      };
    }

    return {
      entityType,
      entityId,
      trustScore: profile.trustScore,
      riskScore: profile.riskScore,
      reputationScore: profile.reputationScore,
      dealScore: profile.dealScore,
      summary: profile.summary,
      explanation: [
        "Verification increases trust.",
        "Completed deals and positive reviews increase reputation.",
        "Disputes, cancellations and delays increase risk.",
        "The final score is calculated from trust, risk and reputation together.",
      ],
      factors: profile.factors,
    };
  }

  listProfiles() {
    return (this.prisma as any).trustProfile.findMany({
      orderBy: { updatedAt: "desc" },
    });
  }
}
