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
exports.TrustEngineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TrustEngineService = class TrustEngineService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    clamp(value) {
        return Math.max(0, Math.min(100, Math.round(value)));
    }
    calculateScore(factors = {}) {
        let score = 50;
        if (factors.verified)
            score += 15;
        if (factors.fastResponse)
            score += 8;
        if (factors.documentsReady)
            score += 8;
        if (factors.completedDeals)
            score += Math.min(20, factors.completedDeals * 2);
        if (factors.positiveReviews)
            score += Math.min(12, factors.positiveReviews);
        if (factors.yearsActive)
            score += Math.min(10, factors.yearsActive * 2);
        if (factors.disputes)
            score -= Math.min(30, factors.disputes * 10);
        if (factors.cancelledDeals)
            score -= Math.min(20, factors.cancelledDeals * 5);
        if (factors.lateDelivery)
            score -= Math.min(20, factors.lateDelivery * 5);
        if (factors.negativeReviews)
            score -= Math.min(20, factors.negativeReviews * 4);
        const trustScore = this.clamp(score);
        const riskScore = this.clamp(100 - trustScore);
        const reputationScore = this.clamp((trustScore * 0.7) + ((100 - riskScore) * 0.3));
        const dealScore = this.clamp((trustScore + reputationScore + (100 - riskScore)) / 3);
        return { trustScore, riskScore, reputationScore, dealScore };
    }
    async buildProfile(entityType, entityId, factors = {}) {
        const scores = this.calculateScore(factors);
        const summary = `AI Trust calculated for ${entityType}. Trust=${scores.trustScore}, Risk=${scores.riskScore}, Reputation=${scores.reputationScore}.`;
        const existing = await this.prisma.trustProfile.findFirst({
            where: { entityType, entityId },
        });
        const data = {
            entityType,
            entityId,
            ...scores,
            verified: !!factors.verified,
            summary,
            factors,
            status: scores.riskScore >= 70 ? "warning" : "active",
        };
        if (existing) {
            return this.prisma.trustProfile.update({
                where: { id: existing.id },
                data,
            });
        }
        return this.prisma.trustProfile.create({ data });
    }
    async explain(entityType, entityId) {
        const profile = await this.prisma.trustProfile.findFirst({
            where: { entityType, entityId },
            orderBy: { updatedAt: "desc" },
        });
        if (!profile) {
            return {
                entityType,
                entityId,
                message: "No trust profile found yet.",
            };
        }
        return {
            entityType,
            entityId,
            trustScore: profile.trustScore,
            riskScore: profile.riskScore,
            reputationScore: profile.reputationScore,
            dealScore: profile.dealScore,
            summary: profile.summary,
            explanation: [
                "Verification increases trust.",
                "Completed deals and positive reviews increase reputation.",
                "Disputes, cancellations and delays increase risk.",
                "The final score is calculated from trust, risk and reputation together.",
            ],
            factors: profile.factors,
        };
    }
    listProfiles() {
        return this.prisma.trustProfile.findMany({
            orderBy: { updatedAt: "desc" },
        });
    }
};
exports.TrustEngineService = TrustEngineService;
exports.TrustEngineService = TrustEngineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TrustEngineService);
//# sourceMappingURL=trust-engine.service.js.map