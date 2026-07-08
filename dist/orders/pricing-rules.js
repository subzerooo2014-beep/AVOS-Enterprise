"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingRules = void 0;
class PricingRules {
    static finalPrice(price, tax, discount) {
        return (price - discount) + (price * tax);
    }
}
exports.PricingRules = PricingRules;
//# sourceMappingURL=pricing-rules.js.map