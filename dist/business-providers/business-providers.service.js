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
exports.BusinessProvidersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BusinessProvidersService = class BusinessProvidersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    clamp(value) {
        return Math.max(0, Math.min(100, Math.round(value)));
    }
    createProvider(data) {
        return this.prisma.businessProviderProfile.create({
            data: {
                partnerId: data.partnerId,
                name: data.name,
                type: data.type,
                country: data.country,
                city: data.city,
                serviceAreas: data.serviceAreas || [],
                supportedRoutes: data.supportedRoutes || [],
                languages: data.languages || ["ar"],
                status: data.status || "active",
                verified: !!data.verified,
                trustScore: Number(data.trustScore || 50),
                riskScore: Number(data.riskScore || 50),
                performanceScore: Number(data.performanceScore || 50),
                metadata: data.metadata || {},
            },
        });
    }
    listProviders(type) {
        return this.prisma.businessProviderProfile.findMany({
            where: type ? { type } : {},
            orderBy: [{ verified: "desc" }, { trustScore: "desc" }, { createdAt: "desc" }],
        });
    }
    async findProvider(id) {
        const item = await this.prisma.businessProviderProfile.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException("Business provider not found");
        return item;
    }
    async updateProviderScore(id, metrics = {}) {
        const provider = await this.findProvider(id);
        let trustScore = Number(provider.trustScore || 50);
        let riskScore = Number(provider.riskScore || 50);
        let performanceScore = Number(provider.performanceScore || 50);
        if (metrics.verified)
            trustScore += 10;
        if (metrics.completedJobs) {
            trustScore += Math.min(20, Number(metrics.completedJobs) * 2);
            performanceScore += Math.min(20, Number(metrics.completedJobs) * 2);
        }
        if (metrics.onTimeRate)
            performanceScore += Math.min(15, Number(metrics.onTimeRate) / 10);
        if (metrics.disputes) {
            trustScore -= Math.min(25, Number(metrics.disputes) * 8);
            riskScore += Math.min(25, Number(metrics.disputes) * 8);
        }
        if (metrics.lateJobs) {
            performanceScore -= Math.min(20, Number(metrics.lateJobs) * 5);
            riskScore += Math.min(20, Number(metrics.lateJobs) * 5);
        }
        trustScore = this.clamp(trustScore);
        riskScore = this.clamp(riskScore);
        performanceScore = this.clamp(performanceScore);
        return this.prisma.businessProviderProfile.update({
            where: { id },
            data: {
                trustScore,
                riskScore,
                performanceScore,
                metadata: {
                    ...(provider.metadata || {}),
                    lastScoreUpdate: metrics,
                    aiReason: "Provider score updated from completed jobs, disputes, delay rate and verification.",
                },
            },
        });
    }
    async createOffer(data) {
        await this.findProvider(data.providerId);
        let aiScore = 50;
        if (data.price && Number(data.price) > 0)
            aiScore += 10;
        if (data.durationDays && Number(data.durationDays) <= 14)
            aiScore += 10;
        if (data.serviceType === "shipping")
            aiScore += 5;
        if (data.serviceType === "insurance")
            aiScore += 5;
        if (data.serviceType === "finance")
            aiScore += 5;
        aiScore = this.clamp(aiScore);
        return this.prisma.providerOffer.create({
            data: {
                providerId: data.providerId,
                dealId: data.dealId,
                serviceType: data.serviceType,
                title: data.title,
                price: Number(data.price || 0),
                currency: data.currency || "AED",
                durationDays: data.durationDays ? Number(data.durationDays) : null,
                status: data.status || "active",
                aiScore,
                metadata: data.metadata || {},
            },
        });
    }
    listOffers(serviceType) {
        return this.prisma.providerOffer.findMany({
            where: serviceType ? { serviceType } : {},
            orderBy: [{ aiScore: "desc" }, { createdAt: "desc" }],
        });
    }
    async matchProvider(data) {
        const provider = await this.findProvider(data.providerId);
        let score = 50;
        if (provider.type === data.serviceType)
            score += 20;
        if (provider.verified)
            score += 10;
        if (provider.country && provider.country === data.country)
            score += 10;
        if (provider.trustScore)
            score += Math.min(20, Number(provider.trustScore) / 5);
        if (provider.performanceScore)
            score += Math.min(15, Number(provider.performanceScore) / 7);
        if (provider.riskScore && Number(provider.riskScore) > 70)
            score -= 20;
        score = this.clamp(score);
        return this.prisma.providerMatch.create({
            data: {
                dealId: data.dealId,
                providerId: data.providerId,
                serviceType: data.serviceType,
                matchScore: score,
                reason: score >= 80
                    ? "Strong provider match based on type, trust, performance and route."
                    : score >= 60
                        ? "Medium provider match, suitable for review."
                        : "Weak provider match, consider alternatives.",
                status: score >= 80 ? "recommended" : "suggested",
                metadata: {
                    providerName: provider.name,
                    providerType: provider.type,
                    aiReason: "AI matched provider using service type, trust score, performance score, country and risk.",
                },
            },
        });
    }
    listMatches() {
        return this.prisma.providerMatch.findMany({
            orderBy: [{ matchScore: "desc" }, { createdAt: "desc" }],
        });
    }
};
exports.BusinessProvidersService = BusinessProvidersService;
exports.BusinessProvidersService = BusinessProvidersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BusinessProvidersService);
//# sourceMappingURL=business-providers.service.js.map