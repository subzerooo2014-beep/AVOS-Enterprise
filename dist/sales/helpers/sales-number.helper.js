"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSalesNumber = createSalesNumber;
function createSalesNumber(prefix = 'SALE') {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${prefix}-${yyyy}${mm}${dd}-${Date.now()}`;
}
//# sourceMappingURL=sales-number.helper.js.map