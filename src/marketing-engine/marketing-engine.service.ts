import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class MarketingEngineService {
  constructor(private prisma: PrismaService) {}

  private clamp(value: number) {
    return Math.max(0, Math.min(100, Math.round(value)));
  }

  async createCampaign(data: any) {
    const audience = data.audience || {};
    const channels = data.channels || ["website"];

    const expectedReach =
      Number(data.expectedReach || 0) ||
      Math.max(1000, channels.length * 1500 + (audience.countries?.length || 1) * 800);

    const expectedLeads = Math.max(10, Math.round(expectedReach * 0.025));

    return (this.prisma as any).aiCampaign.create({
      data: {
        title: data.title,
        targetType: data.targetType,
        targetId: data.targetId,
        campaignType: data.campaignType || "smart",
        status: data.status || "draft",
        goal: data.goal || "sell_faster",
        audience,
        channels,
        budget: Number(data.budget || 0),
        expectedReach,
        expectedLeads,
        performanceScore: 50,
        aiStrategy: {
          strategy: "AI will test multiple channels, optimize messaging, and focus on highest quality leads.",
          channels,
          audience,
        },
      },
    });
  }

  listCampaigns() {
    return (this.prisma as any).aiCampaign.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findCampaign(id: string) {
    const item = await (this.prisma as any).aiCampaign.findUnique({ where: { id } });
    if (!item) throw new NotFoundException("AI campaign not found");
    return item;
  }

  async generateAd(campaignId: string, data: any = {}) {
    const campaign = await this.findCampaign(campaignId);

    const language = data.language || "ar";
    const channel = data.channel || "website";

    const headline =
      data.headline ||
      (language === "ar"
        ? `اعثر على المشتري المناسب بسرعة مع AVOS`
        : `Find the right buyer faster with AVOS`);

    const body =
      data.body ||
      (language === "ar"
        ? `نستخدم الذكاء الاصطناعي لتحليل السوق، اختيار الجمهور المناسب، وتحسين فرص البيع.`
        : `We use AI to analyze demand, target the right audience, and improve selling chances.`);

    const score = this.clamp(60 + (channel === "social" ? 10 : 0) + (campaign.targetType === "export_vehicle" ? 10 : 0));

    return (this.prisma as any).aiAdCreative.create({
      data: {
        campaignId,
        title: data.title || `Creative for ${campaign.title}`,
        headline,
        body,
        language,
        channel,
        format: data.format || "text",
        score,
        metadata: {
          campaignGoal: campaign.goal,
          reason: "Generated from campaign goal, target type, language and channel.",
        },
      },
    });
  }

  async optimizeCampaign(id: string, metrics: any = {}) {
    const campaign = await this.findCampaign(id);

    let score = Number(campaign.performanceScore || 50);

    if (metrics.leads) score += Math.min(20, Number(metrics.leads));
    if (metrics.clickRate) score += Math.min(15, Number(metrics.clickRate) * 10);
    if (metrics.costPerLead && Number(metrics.costPerLead) > 0) score += Math.max(-15, 15 - Number(metrics.costPerLead));
    if (metrics.weakEngagement) score -= 15;

    score = this.clamp(score);

    return (this.prisma as any).aiCampaign.update({
      where: { id },
      data: {
        performanceScore: score,
        status: score >= 70 ? "scaling" : score <= 35 ? "needs_review" : "active",
        aiStrategy: {
          ...(campaign.aiStrategy || {}),
          lastOptimization: {
            metrics,
            score,
            recommendation:
              score >= 70
                ? "Scale this campaign and increase distribution."
                : score <= 35
                  ? "Change headline, audience or channel."
                  : "Keep testing and collect more data.",
          },
        },
      },
    });
  }

  async createPublishingPlan(campaignId: string, data: any) {
    await this.findCampaign(campaignId);

    return (this.prisma as any).publishingPlan.create({
      data: {
        campaignId,
        channel: data.channel || "website",
        country: data.country,
        language: data.language || "ar",
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        status: "planned",
        metadata: data.metadata || {},
      },
    });
  }
}
