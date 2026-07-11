import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AiDecisionService } from "../ai-decision/ai-decision.service";
import { PublishJobsService } from "../publish-jobs/publish-jobs.service";
import { AiActionLogService } from "../ai-action-log/ai-action-log.service";

@Injectable()
export class AiCampaignEngineService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly decision: AiDecisionService,
    private readonly publishJobs: PublishJobsService,
    private readonly logs: AiActionLogService,
  ) {}

  async launchVehicleCampaign(vehicleId: string) {
    const d = await this.decision.evaluateVehicle(vehicleId);

    const campaign = await (this.prisma as any).aiCampaign.create({
      data: {
        title: this.campaignTitle(d),
        targetType: "vehicle",
        targetId: vehicleId,
        campaignType: "vehicle_sales",
        status: "active",
        goal: "sell_vehicle_fast",
        audience: this.audience(d),
        channels: this.channels(d),
        expectedReach: this.expectedReach(d),
        expectedLeads: this.expectedLeads(d),
        performanceScore: this.performanceScore(d),
        aiStrategy: {
          decision: d.overallDecision,
          recommendedPrice: d.recommendedPrice,
          actions: d.actions,
          strategy: "multi_channel_ai_distribution",
        },
      },
    });

    const creatives = await this.createCreatives(campaign.id, vehicleId, d);
    const jobs = await this.createPublishJobs(vehicleId, d, creatives);

    await this.logs.write(vehicleId, "AI_CAMPAIGN_CREATED", "completed");

    return {
      success: true,
      vehicleId,
      campaign,
      creativesCreated: creatives.length,
      jobsCreated: jobs.length,
      creatives,
      jobs,
    };
  }

  private campaignTitle(d: any) {
    const headline = d.summary?.marketing?.headline ?? "Smart Vehicle Campaign";
    return `${headline} - AVOS AI Campaign`;
  }

  private channels(d: any) {
    const base = d.summary?.marketing?.channels ?? ["website"];
    const channels = new Set<string>(base);
    if ((d.summary?.buyer?.matchScore ?? 0) >= 85) channels.add("matched_buyers");
    if ((d.summary?.exportOpportunity?.exportScore ?? 0) >= 85) channels.add("gcc_export");
    channels.add("dealer_network");
    channels.add("crm_leads");
    return Array.from(channels);
  }

  private audience(d: any) {
    return {
      primary: d.summary?.buyer?.bestSegment ?? "local_buyers",
      segments: d.summary?.marketing?.audience ?? [],
      exportCountry: d.summary?.exportOpportunity?.bestCountry ?? null,
      trustLevel: d.summary?.trust?.level ?? null,
    };
  }

  private expectedReach(d: any) {
    return d.summary?.marketing?.estimatedReach ?? 50000;
  }

  private expectedLeads(d: any) {
    const reach = this.expectedReach(d);
    const score = d.summary?.buyer?.matchScore ?? 50;
    return Math.round(reach * (score / 100) * 0.015);
  }

  private performanceScore(d: any) {
    const buyer = d.summary?.buyer?.matchScore ?? 50;
    const exportScore = d.summary?.exportOpportunity?.exportScore ?? 50;
    const trust = d.summary?.trust?.trustScore ?? 50;
    return Math.round((buyer + exportScore + trust) / 3);
  }

  private async createCreatives(campaignId: string, vehicleId: string, d: any) {
    const channels = this.channels(d);
    const price = d.recommendedPrice ?? d.summary?.valuation?.recommendedPrice ?? null;
    const headline = d.summary?.marketing?.headline ?? "Featured Vehicle";

    const rows = [];

    for (const channel of channels) {
      rows.push(await (this.prisma as any).aiAdCreative.create({
        data: {
          campaignId,
          title: `${headline} - ${channel}`,
          headline,
          body: this.caption(vehicleId, channel, price, d),
          language: "en",
          channel,
          format: "text",
          score: this.performanceScore(d),
          metadata: {
            vehicleId,
            channel,
            price,
            hashtags: this.hashtags(channel, d),
            cta: this.cta(channel),
          },
        },
      }));
    }

    return rows;
  }

  private caption(vehicleId: string, channel: string, price: any, d: any) {
    return [
      `AI selected listing for ${channel}.`,
      price ? `Recommended price: ${price}.` : null,
      d.summary?.trust?.level ? `Trust level: ${d.summary.trust.level}.` : null,
      d.summary?.exportOpportunity?.bestCountry ? `Strong export demand: ${d.summary.exportOpportunity.bestCountry}.` : null,
      `Vehicle ID: ${vehicleId}.`,
    ].filter(Boolean).join(" ");
  }

  private hashtags(channel: string, d: any) {
    const tags = ["#AVOS", "#Cars", "#UAE"];
    if (channel.includes("instagram") || channel.includes("tiktok")) tags.push("#CarDeals", "#DubaiCars");
    if ((d.summary?.exportOpportunity?.exportScore ?? 0) >= 85) tags.push("#ExportCars", "#GCC");
    return tags;
  }

  private cta(channel: string) {
    if (channel === "matched_buyers") return "Contact matched buyers now";
    if (channel === "gcc_export") return "Prepare export inquiry";
    if (channel === "google_search") return "Launch search campaign";
    return "View vehicle now";
  }

  private async createPublishJobs(vehicleId: string, d: any, creatives: any[]) {
    const jobs = [];
    for (const creative of creatives) {
      jobs.push(await this.publishJobs.createChannelJob(
        vehicleId,
        creative.channel ?? "website",
        creative.title,
        "queued",
        creative.body,
        {
          campaignId: creative.campaignId,
          creativeId: creative.id,
          hashtags: creative.metadata?.hashtags ?? [],
          cta: creative.metadata?.cta ?? null,
          decision: d.overallDecision,
        },
      ));
    }
    return jobs;
  }
}
