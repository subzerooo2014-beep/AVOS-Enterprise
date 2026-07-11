import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TrustService {
  constructor(private prisma: PrismaService) {}

  async calculate(entityType: string, entityId: string, factors: any = {}) {
    let score = 50;

    if (factors.verified) score += 15;
    if (factors.completedDeals) score += Math.min(20, factors.completedDeals);
    if (factors.fastResponse) score += 10;
    if (factors.disputes) score -= Math.min(30, factors.disputes * 10);
    if (factors.cancelRateHigh) score -= 15;

    score = Math.max(0, Math.min(100, score));
    const riskScore = 100 - score;

    return (this.prisma as any).trustScore.create({
      data: {
        entityType,
        entityId,
        score,
        riskScore,
        reason: `Trust calculated from verification, completed deals, response speed, disputes and cancellation behavior.`,
        factors,
      },
    });
  }

  list() {
    return (this.prisma as any).trustScore.findMany({ orderBy: { createdAt: "desc" } });
  }
}
