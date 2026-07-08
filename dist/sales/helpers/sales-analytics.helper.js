"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safePercent = safePercent;
exports.safeMoney = safeMoney;
exports.sumMoney = sumMoney;
function safePercent(part, total) {
    if (!total || total <= 0)
        return 0;
    return Number(((part / total) * 100).toFixed(2));
}
function safeMoney(value) {
    const n = Number(value ?? 0);
    return Number.isFinite(n) ? Number(n.toFixed(2)) : 0;
}
function sumMoney(items, field = 'total') {
    return safeMoney(items.reduce((sum, item) => sum + Number(item?.[field] ?? 0), 0));
}
//# sourceMappingURL=sales-analytics.helper.js.map