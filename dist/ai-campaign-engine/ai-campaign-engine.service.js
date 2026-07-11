"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiCampaignEngineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ai_decision_service_1 = require("../ai-decision/ai-decision.service");
const publish_jobs_service_1 = require("../publish-jobs/publish-jobs.service");
const ai_action_log_service_1 = require("../ai-action-log/ai-action-log.service");
let AiCampaignEngineService = class AiCampaignEngineService {
    constructor(prisma, decision, publishJobs, logs) {
        this.prisma = prisma;
        this.decision = decision;
        this.publishJobs = publishJobs;
        this.logs = logs;
    }
    async launchVehicleCampaign(vehicleId) {
        const d = await this.decision.evaluateVehicle(vehicleId);
        const campaign = await this.prisma.aiCampaign.create({
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
    campaignTitle(d) {
        const headline = d.summary?.marketing?.headline ?? "Smart Vehicle Campaign";
        return `${headline} - AVOS AI Campaign`;
    }
    channels(d) {
        const base = d.summary?.marketing?.channels ?? ["website"];
        const channels = new Set(base);
        if ((d.summary?.buyer?.matchScore ?? 0) >= 85)
            channels.add("matched_buyers");
        if ((d.summary?.exportOpportunity?.exportScore ?? 0) >= 85)
            channels.add("gcc_export");
        channels.add("dealer_network");
        channels.add("crm_leads");
        return Array.from(channels);
    }
    audience(d) {
        return {
            primary: d.summary?.buyer?.bestSegment ?? "local_buyers",
            segments: d.summary?.marketing?.audience ?? [],
            exportCountry: d.summary?.exportOpportunity?.bestCountry ?? null,
            trustLevel: d.summary?.trust?.level ?? null,
        };
    }
    expectedReach(d) {
        return d.summary?.marketing?.estimatedReach ?? 50000;
    }
    expectedLeads(d) {
        const reach = this.expectedReach(d);
        const score = d.summary?.buyer?.matchScore ?? 50;
        return Math.round(reach * (score / 100) * 0.015);
    }
    performanceScore(d) {
        const buyer = d.summary?.buyer?.matchScore ?? 50;
        const exportScore = d.summary?.exportOpportunity?.exportScore ?? 50;
        const trust = d.summary?.trust?.trustScore ?? 50;
        return Math.round((buyer + exportScore + trust) / 3);
    }
    async createCreatives(campaignId, vehicleId, d) {
        const channels = this.channels(d);
        const price = d.recommendedPrice ?? d.summary?.valuation?.recommendedPrice ?? null;
        const headline = d.summary?.marketing?.headline ?? "Featured Vehicle";
        const rows = [];
        for (const channel of channels) {
            rows.push(await this.prisma.aiAdCreative.create({
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
    caption(vehicleId, channel, price, d) {
        return [
            `AI selected listing for ${channel}.`,
            price ? `Recommended price: ${price}.` : null,
            d.summary?.trust?.level ? `Trust level: ${d.summary.trust.level}.` : null,
            d.summary?.exportOpportunity?.bestCountry ? `Strong export demand: ${d.summary.exportOpportunity.bestCountry}.` : null,
            `Vehicle ID: ${vehicleId}.`,
        ].filter(Boolean).join(" ");
    }
    hashtags(channel, d) {
        const tags = ["#AVOS", "#Cars", "#UAE"];
        if (channel.includes("instagram") || channel.includes("tiktok"))
            tags.push("#CarDeals", "#DubaiCars");
        if ((d.summary?.exportOpportunity?.exportScore ?? 0) >= 85)
            tags.push("#ExportCars", "#GCC");
        return tags;
    }
    cta(channel) {
        if (channel === "matched_buyers")
            return "Contact matched buyers now";
        if (channel === "gcc_export")
            return "Prepare export inquiry";
        if (channel === "google_search")
            return "Launch search campaign";
        return "View vehicle now";
    }
    async createPublishJobs(vehicleId, d, creatives) {
        const jobs = [];
        for (const creative of creatives) {
            jobs.push(await this.publishJobs.createChannelJob(vehicleId, creative.channel ?? "website", creative.title, "queued", creative.body, {
                campaignId: creative.campaignId,
                creativeId: creative.id,
                hashtags: creative.metadata?.hashtags ?? [],
                cta: creative.metadata?.cta ?? null,
                decision: d.overallDecision,
            }));
        }
        return jobs;
    }
};
exports.AiCampaignEngineService = AiCampaignEngineService;
exports.AiCampaignEngineService = AiCampaignEngineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_decision_service_1.AiDecisionService,
        publish_jobs_service_1.PublishJobsService,
        ai_action_log_service_1.AiActionLogService])
], AiCampaignEngineService);
//# sourceMappingURL=ai-campaign-engine.service.js.map