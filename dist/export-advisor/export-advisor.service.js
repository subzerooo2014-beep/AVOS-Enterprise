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
exports.ExportAdvisorService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ExportAdvisorService = class ExportAdvisorService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    clamp(v) {
        return Math.max(0, Math.min(100, Math.round(v)));
    }
    async advise(data) {
        let demandScore = 50;
        let readinessScore = 50;
        if (data.highDemand)
            demandScore += 25;
        if (data.lowCompetition)
            demandScore += 15;
        if (data.targetCountry)
            demandScore += 5;
        if (data.documentsReady)
            readinessScore += 20;
        if (data.shippingReady)
            readinessScore += 20;
        if (data.inspectionReady)
            readinessScore += 10;
        if (data.missingDocuments)
            readinessScore -= 25;
        if (data.highShippingCost)
            demandScore -= 10;
        demandScore = this.clamp(demandScore);
        readinessScore = this.clamp(readinessScore);
        const estimatedCost = Number(data.estimatedCost || 0);
        const expectedSalePrice = Number(data.expectedSalePrice || 0);
        const purchasePrice = Number(data.purchasePrice || 0);
        const estimatedProfit = Number((expectedSalePrice - purchasePrice - estimatedCost).toFixed(2));
        return this.prisma.exportAdvice.create({
            data: {
                vehicleId: data.vehicleId,
                targetCountry: data.targetCountry || "unknown",
                demandScore,
                readinessScore,
                estimatedCost,
                estimatedProfit,
                recommendation: demandScore >= 75 && readinessScore >= 70
                    ? "Strong export opportunity. Start buyer targeting and shipping offers."
                    : "Needs improvement before export campaign.",
                factors: data,
            },
        });
    }
    list() {
        return this.prisma.exportAdvice.findMany({ orderBy: { createdAt: "desc" } });
    }
};
exports.ExportAdvisorService = ExportAdvisorService;
exports.ExportAdvisorService = ExportAdvisorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExportAdvisorService);
//# sourceMappingURL=export-advisor.service.js.map