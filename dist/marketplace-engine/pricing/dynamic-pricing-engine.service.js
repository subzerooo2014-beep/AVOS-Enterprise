"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicPricingEngineService = void 0;
const common_1 = require("@nestjs/common");
let DynamicPricingEngineService = class DynamicPricingEngineService {
    calculate(vehicle) {
        return {
            suggestedPrice: vehicle.price ?? null,
            confidence: 90,
            strategy: "MARKET_AI",
        };
    }
};
exports.DynamicPricingEngineService = DynamicPricingEngineService;
exports.DynamicPricingEngineService = DynamicPricingEngineService = __decorate([
    (0, common_1.Injectable)()
], DynamicPricingEngineService);
//# sourceMappingURL=dynamic-pricing-engine.service.js.map