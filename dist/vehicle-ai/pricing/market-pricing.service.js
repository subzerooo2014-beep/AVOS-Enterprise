"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketPricingService = void 0;
const common_1 = require("@nestjs/common");
let MarketPricingService = class MarketPricingService {
    estimate(input) {
        return {
            estimatedPrice: null,
            confidence: 0,
            status: "WAITING_REAL_MARKET_PROVIDER",
            input,
        };
    }
};
exports.MarketPricingService = MarketPricingService;
exports.MarketPricingService = MarketPricingService = __decorate([
    (0, common_1.Injectable)()
], MarketPricingService);
//# sourceMappingURL=market-pricing.service.js.map