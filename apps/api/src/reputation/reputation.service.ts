import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ReputationService {
  constructor(private prisma: PrismaService) {}

  private clamp(value: number) {
    return Math.max(0, Math.min(100, Math.round(value)));
  }

  async snapshot(entityType: string, entityId: string, metrics: any = {}) {
    let score = 50;

    if (metrics.completedDeals) score += Math.min(20, metrics.completedDeals * 2);
    if (metrics.positiveReviews) score += Math.min(15, metrics.positiveReviews);
    if (metrics.onTimeRate) score += Math.min(15, metrics.onTimeRate / 10);
    if (metrics.responseRate) score += Math.min(10, metrics.responseRate / 10);

    if (metrics.disputes) score -= Math.min(25, metrics.disputes * 8);
    if (metrics.refunds) score -= Math.min(15, metrics.refunds * 5);
    if (metrics.lateDelivery) score -= Math.min(20, metrics.lateDelivery * 5);

    score = this.clamp(score);

    return (this.prisma as any).reputationSnapshot.create({
      data: {
        entityType,
        entityId,
        score,
        period: metrics.period || "current",
        reason: "AI reputation snapshot created from real performance metrics.",
        metrics,
      },
    });
  }

  timeline(entityType: string, entityId: string) {
    return (this.prisma as any).reputationSnapshot.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: "asc" },
    });
  }

  list() {
    return (this.prisma as any).reputationSnapshot.findMany({
      orderBy: { createdAt: "desc" },
    });
  }
}
