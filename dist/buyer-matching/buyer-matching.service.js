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
exports.BuyerMatchingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BuyerMatchingService = class BuyerMatchingService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    clamp(value) {
        return Math.max(0, Math.min(100, Math.round(value)));
    }
    async createLead(data) {
        let qualityScore = 50;
        if (data.phone)
            qualityScore += 10;
        if (data.email)
            qualityScore += 10;
        if (data.country)
            qualityScore += 10;
        if (data.interest)
            qualityScore += 10;
        if (data.readyToBuy)
            qualityScore += 20;
        if (data.exportBuyer)
            qualityScore += 10;
        qualityScore = this.clamp(qualityScore);
        return this.prisma.buyerLead.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                country: data.country,
                city: data.city,
                interest: data.interest,
                targetType: data.targetType,
                targetId: data.targetId,
                qualityScore,
                status: qualityScore >= 75 ? "qualified" : "new",
                metadata: data.metadata || {},
            },
        });
    }
    listLeads() {
        return this.prisma.buyerLead.findMany({ orderBy: { createdAt: "desc" } });
    }
    async matchBuyer(leadId, data) {
        const lead = await this.prisma.buyerLead.findUnique({ where: { id: leadId } });
        if (!lead)
            throw new common_1.NotFoundException("Buyer lead not found");
        let score = Number(lead.qualityScore || 50);
        if (lead.targetType === data.targetType)
            score += 10;
        if (lead.targetId === data.targetId)
            score += 20;
        if (data.sameCountry)
            score += 10;
        if (data.exportMatch)
            score += 15;
        if (data.budgetMatch)
            score += 15;
        if (data.urgentDemand)
            score += 10;
        score = this.clamp(score);
        return this.prisma.buyerMatch.create({
            data: {
                buyerLeadId: leadId,
                targetType: data.targetType,
                targetId: data.targetId,
                matchScore: score,
                reason: score >= 80
                    ? "Strong buyer match detected by AVOS AI."
                    : score >= 60
                        ? "Medium buyer match; recommended for follow-up."
                        : "Weak buyer match; collect more data before sending to seller.",
                status: score >= 75 ? "high_match" : "suggested",
                metadata: {
                    leadCountry: lead.country,
                    buyerInterest: lead.interest,
                    aiReason: "Calculated from lead quality, target match, export demand and budget fit.",
                },
            },
        });
    }
    listMatches() {
        return this.prisma.buyerMatch.findMany({ orderBy: { createdAt: "desc" } });
    }
};
exports.BuyerMatchingService = BuyerMatchingService;
exports.BuyerMatchingService = BuyerMatchingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BuyerMatchingService);
//# sourceMappingURL=buyer-matching.service.js.map