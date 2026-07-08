"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMoney = toMoney;
exports.safeNumber = safeNumber;
exports.assertNonNegative = assertNonNegative;
function toMoney(value) {
    if (!Number.isFinite(value))
        return 0;
    return Math.round(value * 100) / 100;
}
function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
}
function assertNonNegative(value, field) {
    if (value < 0) {
        throw new Error(`${field} must not be negative`);
    }
}
//# sourceMappingURL=money.helper.js.map