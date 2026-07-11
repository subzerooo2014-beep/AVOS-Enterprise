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
exports.DealsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DealsService = class DealsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
        return this.prisma.dealRoom.create({ data });
    }
    findAll() {
        return this.prisma.dealRoom.findMany({ orderBy: { createdAt: "desc" } });
    }
    async findOne(id) {
        const item = await this.prisma.dealRoom.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException("Deal room not found");
        return item;
    }
    async calculateDealScore(id) {
        const deal = await this.findOne(id);
        let score = 50;
        if (deal.vehicleId)
            score += 10;
        if (deal.sellerId)
            score += 10;
        if (deal.buyerId)
            score += 10;
        if (deal.dealType === "export")
            score += 5;
        score = Math.max(0, Math.min(100, score));
        const riskScore = 100 - score;
        return this.prisma.dealRoom.update({
            where: { id },
            data: {
                aiDealScore: score,
                riskScore,
                metadata: {
                    ...(deal.metadata || {}),
                    aiDealReason: "Calculated from vehicle, seller, buyer and deal type readiness.",
                },
            },
        });
    }
    async calculateCommission(id, amount, percent = 1.5) {
        await this.findOne(id);
        const commission = Number(((amount * percent) / 100).toFixed(2));
        return this.prisma.dealRoom.update({
            where: { id },
            data: {
                commission,
                metadata: {
                    saleAmount: amount,
                    commissionPercent: percent,
                    commissionReason: "Success fee calculated only when deal is completed through AVOS.",
                },
            },
        });
    }
};
exports.DealsService = DealsService;
exports.DealsService = DealsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DealsService);
//# sourceMappingURL=deals.service.js.map