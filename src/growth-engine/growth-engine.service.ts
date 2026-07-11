import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class GrowthEngineService {
  constructor(private prisma: PrismaService) {}

  private clamp(value: number) {
    return Math.max(0, Math.min(100, Math.round(value)));
  }

  async discoverOpportunity(data: any) {
    let score = 50;

    if (data.exportDemand) score += 20;
    if (data.lowCompetition) score += 15;
    if (data.highMargin) score += 15;
    if (data.urgentBuyerDemand) score += 20;
    if (data.weakSupply) score += 10;

    score = this.clamp(score);

    const priority = score >= 80 ? "high" : score >= 55 ? "medium" : "low";

    return (this.prisma as any).growthOpportunity.create({
      data: {
        title: data.title || "AI Growth Opportunity",
        targetType: data.targetType,
        targetId: data.targetId,
        opportunityType: data.opportunityType || "marketing",
        priority,
        score,
        reason: data.reason || "AI detected a potential growth opportunity based on demand, competition, margin and buyer urgency.",
        actions: data.actions || [
          "Create smart campaign",
          "Generate localized ads",
          "Target high-demand countries",
          "Monitor lead quality",
        ],
        status: "new",
      },
    });
  }

  listOpportunities() {
    return (this.prisma as any).growthOpportunity.findMany({
      orderBy: [{ priority: "asc" }, { score: "desc" }, { createdAt: "desc" }],
    });
  }

  async markOpportunity(id: string, status: string) {
    return (this.prisma as any).growthOpportunity.update({
      where: { id },
      data: { status },
    });
  }

  async createSelfMarketingOpportunity() {
    return this.discoverOpportunity({
      title: "AVOS Self-Marketing Opportunity",
      targetType: "platform",
      targetId: "avos",
      opportunityType: "platform_growth",
      exportDemand: true,
      lowCompetition: true,
      highMargin: true,
      urgentBuyerDemand: true,
      reason: "If AVOS reaches sellers intelligently, sellers will trust that AVOS can reach buyers intelligently too.",
      actions: [
        "Create platform credibility campaign",
        "Show AI selling promise",
        "Target sellers and export dealers",
        "Use message: If AI found you, it can find your buyer",
      ],
    });
  }
}
