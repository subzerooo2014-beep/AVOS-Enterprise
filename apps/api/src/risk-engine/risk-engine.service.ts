import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class RiskEngineService {
  constructor(private prisma: PrismaService) {}

  private clamp(value: number) {
    return Math.max(0, Math.min(100, Math.round(value)));
  }

  private level(score: number) {
    if (score >= 75) return "high";
    if (score >= 45) return "medium";
    return "low";
  }

  async assess(entityType: string, entityId: string, factors: any = {}) {
    let risk = 30;

    if (factors.unverified) risk += 20;
    if (factors.disputes) risk += Math.min(30, factors.disputes * 10);
    if (factors.lateDelivery) risk += Math.min(20, factors.lateDelivery * 5);
    if (factors.cancelledDeals) risk += Math.min(20, factors.cancelledDeals * 5);
    if (factors.missingDocuments) risk += 15;
    if (factors.highValueDeal) risk += 5;
    if (factors.verified) risk -= 15;
    if (factors.completedDeals) risk -= Math.min(20, factors.completedDeals * 2);

    const riskScore = this.clamp(risk);
    const level = this.level(riskScore);

    return (this.prisma as any).riskAssessment.create({
      data: {
        entityType,
        entityId,
        riskScore,
        level,
        reason: `AI Risk Engine classified this ${entityType} as ${level} risk.`,
        factors,
      },
    });
  }

  list() {
    return (this.prisma as any).riskAssessment.findMany({
      orderBy: { createdAt: "desc" },
    });
  }
}
