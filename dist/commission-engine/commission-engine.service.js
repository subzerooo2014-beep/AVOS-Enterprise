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
exports.CommissionEngineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CommissionEngineService = class CommissionEngineService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    createPolicy(data) {
        return this.prisma.commissionPolicy.create({
            data: {
                name: data.name,
                dealType: data.dealType || "standard",
                percent: Number(data.percent || 1.5),
                minFee: Number(data.minFee || 0),
                maxFee: data.maxFee ? Number(data.maxFee) : null,
                active: data.active !== false,
                metadata: data.metadata || {},
            },
        });
    }
    listPolicies() {
        return this.prisma.commissionPolicy.findMany({ orderBy: { createdAt: "desc" } });
    }
    async calculate(data) {
        const saleAmount = Number(data.saleAmount || 0);
        let percent = Number(data.percent || 1.5);
        let minFee = Number(data.minFee || 0);
        let maxFee = data.maxFee ? Number(data.maxFee) : null;
        let policyId = data.policyId;
        if (policyId) {
            const policy = await this.prisma.commissionPolicy.findUnique({ where: { id: policyId } });
            if (policy) {
                percent = Number(policy.percent || percent);
                minFee = Number(policy.minFee || minFee);
                maxFee = policy.maxFee ? Number(policy.maxFee) : maxFee;
            }
        }
        let commission = (saleAmount * percent) / 100;
        if (commission < minFee)
            commission = minFee;
        if (maxFee !== null && commission > maxFee)
            commission = maxFee;
        commission = Number(commission.toFixed(2));
        return this.prisma.commissionRecord.create({
            data: {
                dealId: data.dealId,
                policyId,
                saleAmount,
                commission,
                currency: data.currency || "AED",
                status: "pending",
                reason: "Success fee calculated when AVOS contributes to completing the deal.",
            },
        });
    }
    listRecords() {
        return this.prisma.commissionRecord.findMany({ orderBy: { createdAt: "desc" } });
    }
};
exports.CommissionEngineService = CommissionEngineService;
exports.CommissionEngineService = CommissionEngineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommissionEngineService);
//# sourceMappingURL=commission-engine.service.js.map