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
exports.InventoryIntelligenceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InventoryIntelligenceService = class InventoryIntelligenceService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async overview(dto) {
        const items = await this.prisma.inventory.findMany({
            where: {
                status: dto.status || undefined,
                location: dto.location || undefined,
            },
            include: { vehicle: true },
        });
        const total = items.length;
        const available = items.filter((x) => x.status === "AVAILABLE").length;
        const reserved = items.filter((x) => x.status === "RESERVED").length;
        const sold = items.filter((x) => x.status === "SOLD").length;
        const totalValue = items.reduce((sum, x) => sum + Number(x.price || 0), 0);
        return {
            total,
            available,
            reserved,
            sold,
            totalValue,
            averagePrice: total ? Math.round(totalValue / total) : 0,
            items,
        };
    }
    async slowMoving() {
        const items = await this.prisma.inventory.findMany({
            include: { vehicle: true },
            orderBy: { createdAt: "asc" },
        });
        return items.slice(0, 20).map((item) => ({
            ...item,
            risk: "SLOW_MOVING",
            recommendation: "Review price, promote listing, or transfer location",
        }));
    }
};
exports.InventoryIntelligenceService = InventoryIntelligenceService;
exports.InventoryIntelligenceService = InventoryIntelligenceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryIntelligenceService);
//# sourceMappingURL=inventory-intelligence.service.js.map