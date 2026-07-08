"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleValuationService = void 0;
const common_1 = require("@nestjs/common");
let VehicleValuationService = class VehicleValuationService {
    valuate(dto) {
        const currentYear = new Date().getFullYear();
        const age = Math.max(0, currentYear - dto.year);
        const base = dto.marketPrice ?? 100000;
        const mileagePenalty = dto.mileage ? Math.min(dto.mileage / 100000, 0.45) : 0.1;
        const agePenalty = Math.min(age * 0.055, 0.55);
        const conditionFactor = dto.condition?.toLowerCase() === "excellent" ? 1.08 :
            dto.condition?.toLowerCase() === "good" ? 1.0 :
                dto.condition?.toLowerCase() === "fair" ? 0.88 :
                    dto.condition?.toLowerCase() === "poor" ? 0.72 : 0.95;
        const demandFactor = dto.demandScore ? 1 + ((dto.demandScore - 50) / 500) : 1;
        const estimated = Math.max(0, base * (1 - agePenalty) * (1 - mileagePenalty) * conditionFactor * demandFactor);
        return {
            make: dto.make,
            model: dto.model,
            year: dto.year,
            estimatedValue: Math.round(estimated),
            confidence: dto.marketPrice ? "MEDIUM" : "LOW",
            factors: {
                age,
                agePenalty,
                mileagePenalty,
                conditionFactor,
                demandFactor,
            },
        };
    }
};
exports.VehicleValuationService = VehicleValuationService;
exports.VehicleValuationService = VehicleValuationService = __decorate([
    (0, common_1.Injectable)()
], VehicleValuationService);
//# sourceMappingURL=vehicle-valuation.service.js.map