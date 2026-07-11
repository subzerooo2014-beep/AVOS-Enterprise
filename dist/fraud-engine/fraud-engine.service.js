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
exports.FraudEngineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FraudEngineService = class FraudEngineService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    clamp(value) {
        return Math.max(0, Math.min(100, Math.round(value)));
    }
    level(score) {
        if (score >= 75)
            return "high";
        if (score >= 45)
            return "medium";
        return "low";
    }
    async addSignal(data) {
        return this.prisma.fraudSignal.create({
            data: {
                entityType: data.entityType,
                entityId: data.entityId,
                signalType: data.signalType,
                severity: data.severity || "medium",
                score: Number(data.score || 50),
                reason: data.reason || "Fraud signal detected by AVOS AI.",
                metadata: data.metadata || {},
            },
        });
    }
    async assess(data) {
        let score = 20;
        if (data.unverified)
            score += 20;
        if (data.priceTooLow)
            score += 20;
        if (data.duplicateListing)
            score += 25;
        if (data.suspiciousContact)
            score += 20;
        if (data.missingDocuments)
            score += 15;
        if (data.manyComplaints)
            score += 25;
        if (data.verified)
            score -= 15;
        if (data.trustedHistory)
            score -= 20;
        score = this.clamp(score);
        const level = this.level(score);
        const decision = score >= 75 ? "block_or_manual_review" : score >= 45 ? "manual_review" : "allow";
        return this.prisma.fraudAssessment.create({
            data: {
                entityType: data.entityType,
                entityId: data.entityId,
                fraudScore: score,
                level,
                decision,
                reason: `AI Fraud Engine decision: ${decision}.`,
                signals: data,
            },
        });
    }
    listAssessments() {
        return this.prisma.fraudAssessment.findMany({
            orderBy: { createdAt: "desc" },
        });
    }
};
exports.FraudEngineService = FraudEngineService;
exports.FraudEngineService = FraudEngineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FraudEngineService);
//# sourceMappingURL=fraud-engine.service.js.map