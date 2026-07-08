"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesIntelligenceService = void 0;
const common_1 = require("@nestjs/common");
let SalesIntelligenceService = class SalesIntelligenceService {
    scoreDeal(dto) {
        const price = dto.vehiclePrice || 0;
        const offer = dto.offeredPrice || 0;
        const discount = price > 0 ? ((price - offer) / price) * 100 : 0;
        let score = 60;
        if (dto.paymentType?.toLowerCase() === "cash")
            score += 15;
        if (discount <= 5)
            score += 15;
        if (discount > 15)
            score -= 25;
        return {
            score: Math.max(0, Math.min(100, Math.round(score))),
            discountPercent: Math.round(discount),
            recommendation: score >= 80 ? "APPROVE_FAST" :
                score >= 60 ? "NEGOTIATE" :
                    "REVIEW_MANUALLY",
        };
    }
};
exports.SalesIntelligenceService = SalesIntelligenceService;
exports.SalesIntelligenceService = SalesIntelligenceService = __decorate([
    (0, common_1.Injectable)()
], SalesIntelligenceService);
//# sourceMappingURL=sales-intelligence.service.js.map