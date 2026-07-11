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
exports.VehicleIntelligenceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let VehicleIntelligenceService = class VehicleIntelligenceService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    clamp(value) {
        return Math.max(0, Math.min(100, Math.round(value)));
    }
    async valueVehicle(data) {
        let base = Number(data.marketPrice || data.askingPrice || 50000);
        if (data.year && Number(data.year) >= 2023)
            base *= 1.12;
        if (data.year && Number(data.year) <= 2018)
            base *= 0.86;
        if (data.mileage && Number(data.mileage) > 150000)
            base *= 0.82;
        if (data.mileage && Number(data.mileage) < 30000)
            base *= 1.08;
        if (data.condition === "excellent")
            base *= 1.1;
        if (data.condition === "damaged")
            base *= 0.65;
        if (data.exportDemand)
            base *= 1.08;
        if (data.lowSupply)
            base *= 1.07;
        if (data.urgentSale)
            base *= 0.95;
        const suggestedPrice = Number(base.toFixed(2));
        let confidence = 50;
        if (data.make)
            confidence += 8;
        if (data.model)
            confidence += 8;
        if (data.year)
            confidence += 8;
        if (data.mileage)
            confidence += 8;
        if (data.condition)
            confidence += 8;
        if (data.marketPrice)
            confidence += 10;
        confidence = this.clamp(confidence);
        return this.prisma.vehicleValuation.create({
            data: {
                vehicleId: data.vehicleId,
                title: data.title || "AI Vehicle Valuation",
                make: data.make,
                model: data.model,
                year: data.year ? Number(data.year) : null,
                mileage: data.mileage ? Number(data.mileage) : null,
                condition: data.condition,
                marketPrice: Number(data.marketPrice || 0),
                suggestedPrice,
                confidence,
                reason: "AI valuation calculated from year, mileage, condition, demand, supply and market price.",
                factors: data,
            },
        });
    }
    listValuations() {
        return this.prisma.vehicleValuation.findMany({
            orderBy: { createdAt: "desc" },
        });
    }
};
exports.VehicleIntelligenceService = VehicleIntelligenceService;
exports.VehicleIntelligenceService = VehicleIntelligenceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VehicleIntelligenceService);
//# sourceMappingURL=vehicle-intelligence.service.js.map