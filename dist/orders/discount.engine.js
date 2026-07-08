"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountEngine = void 0;
class DiscountEngine {
    static apply(total, discount) {
        return Math.max(total - discount, 0);
    }
}
exports.DiscountEngine = DiscountEngine;
//# sourceMappingURL=discount.engine.js.map