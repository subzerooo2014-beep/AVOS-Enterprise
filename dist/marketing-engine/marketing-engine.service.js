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
exports.MarketingEngineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MarketingEngineService = class MarketingEngineService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    clamp(value) {
        return Math.max(0, Math.min(100, Math.round(value)));
    }
    async createCampaign(data) {
        const audience = data.audience || {};
        const channels = data.channels || ["website"];
        const expectedReach = Number(data.expectedReach || 0) ||
            Math.max(1000, channels.length * 1500 + (audience.countries?.length || 1) * 800);
        const expectedLeads = Math.max(10, Math.round(expectedReach * 0.025));
        return this.prisma.aiCampaign.create({
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
        return this.prisma.aiCampaign.findMany({ orderBy: { createdAt: "desc" } });
    }
    async findCampaign(id) {
        const item = await this.prisma.aiCampaign.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException("AI campaign not found");
        return item;
    }
    async generateAd(campaignId, data = {}) {
        const campaign = await this.findCampaign(campaignId);
        const language = data.language || "ar";
        const channel = data.channel || "website";
        const headline = data.headline ||
            (language === "ar"
                ? `اعثر على المشتري المناسب بسرعة مع AVOS`
                : `Find the right buyer faster with AVOS`);
        const body = data.body ||
            (language === "ar"
                ? `نستخدم الذكاء الاصطناعي لتحليل السوق، اختيار الجمهور المناسب، وتحسين فرص البيع.`
                : `We use AI to analyze demand, target the right audience, and improve selling chances.`);
        const score = this.clamp(60 + (channel === "social" ? 10 : 0) + (campaign.targetType === "export_vehicle" ? 10 : 0));
        return this.prisma.aiAdCreative.create({
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
    async optimizeCampaign(id, metrics = {}) {
        const campaign = await this.findCampaign(id);
        let score = Number(campaign.performanceScore || 50);
        if (metrics.leads)
            score += Math.min(20, Number(metrics.leads));
        if (metrics.clickRate)
            score += Math.min(15, Number(metrics.clickRate) * 10);
        if (metrics.costPerLead && Number(metrics.costPerLead) > 0)
            score += Math.max(-15, 15 - Number(metrics.costPerLead));
        if (metrics.weakEngagement)
            score -= 15;
        score = this.clamp(score);
        return this.prisma.aiCampaign.update({
            where: { id },
            data: {
                performanceScore: score,
                status: score >= 70 ? "scaling" : score <= 35 ? "needs_review" : "active",
                aiStrategy: {
                    ...(campaign.aiStrategy || {}),
                    lastOptimization: {
                        metrics,
                        score,
                        recommendation: score >= 70
                            ? "Scale this campaign and increase distribution."
                            : score <= 35
                                ? "Change headline, audience or channel."
                                : "Keep testing and collect more data.",
                    },
                },
            },
        });
    }
    async createPublishingPlan(campaignId, data) {
        await this.findCampaign(campaignId);
        return this.prisma.publishingPlan.create({
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
};
exports.MarketingEngineService = MarketingEngineService;
exports.MarketingEngineService = MarketingEngineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MarketingEngineService);
//# sourceMappingURL=marketing-engine.service.js.map