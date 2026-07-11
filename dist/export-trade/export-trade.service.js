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
exports.ExportTradeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ExportTradeService = class ExportTradeService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
        return this.prisma.exportVehicle.create({ data });
    }
    findAll() {
        return this.prisma.exportVehicle.findMany({ orderBy: { createdAt: "desc" } });
    }
    async findOne(id) {
        const item = await this.prisma.exportVehicle.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException("Export vehicle not found");
        return item;
    }
    async scoreExportReadiness(id) {
        const item = await this.findOne(id);
        let score = 40;
        if (item.shippingReady)
            score += 20;
        if (item.documentsReady)
            score += 20;
        if (item.targetCountries && Array.isArray(item.targetCountries))
            score += 10;
        if (item.condition)
            score += 10;
        score = Math.max(0, Math.min(100, score));
        return this.prisma.exportVehicle.update({
            where: { id },
            data: {
                aiScore: score,
                demandScore: Math.max(50, score - 5),
                metadata: {
                    ...(item.metadata || {}),
                    exportReadinessReason: "Calculated from shipping readiness, documents, target countries and vehicle condition.",
                },
            },
        });
    }
};
exports.ExportTradeService = ExportTradeService;
exports.ExportTradeService = ExportTradeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExportTradeService);
//# sourceMappingURL=export-trade.service.js.map