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
exports.RiskEngineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RiskEngineService = class RiskEngineService {
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
    async assess(entityType, entityId, factors = {}) {
        let risk = 30;
        if (factors.unverified)
            risk += 20;
        if (factors.disputes)
            risk += Math.min(30, factors.disputes * 10);
        if (factors.lateDelivery)
            risk += Math.min(20, factors.lateDelivery * 5);
        if (factors.cancelledDeals)
            risk += Math.min(20, factors.cancelledDeals * 5);
        if (factors.missingDocuments)
            risk += 15;
        if (factors.highValueDeal)
            risk += 5;
        if (factors.verified)
            risk -= 15;
        if (factors.completedDeals)
            risk -= Math.min(20, factors.completedDeals * 2);
        const riskScore = this.clamp(risk);
        const level = this.level(riskScore);
        return this.prisma.riskAssessment.create({
            data: {
                entityType,
                entityId,
                riskScore,
                level,
                reason: `AI Risk Engine classified this ${entityType} as ${level} risk.`,
                factors,
            },
        });
    }
    list() {
        return this.prisma.riskAssessment.findMany({
            orderBy: { createdAt: "desc" },
        });
    }
};
exports.RiskEngineService = RiskEngineService;
exports.RiskEngineService = RiskEngineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RiskEngineService);
//# sourceMappingURL=risk-engine.service.js.map