"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingEngine = void 0;
class PricingEngine {
    static calculate(price, tax, discount) {
        const subtotal = price - discount;
        return {
            subtotal,
            tax: subtotal * tax,
            total: subtotal + (subtotal * tax),
        };
    }
}
exports.PricingEngine = PricingEngine;
//# sourceMappingURL=pricing.engine.js.map