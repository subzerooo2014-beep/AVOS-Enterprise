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
exports.GrowthEngineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GrowthEngineService = class GrowthEngineService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    clamp(value) {
        return Math.max(0, Math.min(100, Math.round(value)));
    }
    async discoverOpportunity(data) {
        let score = 50;
        if (data.exportDemand)
            score += 20;
        if (data.lowCompetition)
            score += 15;
        if (data.highMargin)
            score += 15;
        if (data.urgentBuyerDemand)
            score += 20;
        if (data.weakSupply)
            score += 10;
        score = this.clamp(score);
        const priority = score >= 80 ? "high" : score >= 55 ? "medium" : "low";
        return this.prisma.growthOpportunity.create({
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
        return this.prisma.growthOpportunity.findMany({
            orderBy: [{ priority: "asc" }, { score: "desc" }, { createdAt: "desc" }],
        });
    }
    async markOpportunity(id, status) {
        return this.prisma.growthOpportunity.update({
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
};
exports.GrowthEngineService = GrowthEngineService;
exports.GrowthEngineService = GrowthEngineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GrowthEngineService);
//# sourceMappingURL=growth-engine.service.js.map