"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCrmMoney = toCrmMoney;
function toCrmMoney(value) {
    const n = Number(value ?? 0);
    return Number.isFinite(n) ? Number(n.toFixed(2)) : 0;
}
//# sourceMappingURL=crm-money.helper.js.map