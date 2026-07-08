"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundEngine = void 0;
class RefundEngine {
    static refund(amount) {
        return {
            refunded: true,
            amount,
        };
    }
}
exports.RefundEngine = RefundEngine;
//# sourceMappingURL=refund.engine.js.map