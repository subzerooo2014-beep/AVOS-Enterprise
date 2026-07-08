"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startOfDay = startOfDay;
exports.endOfDay = endOfDay;
exports.startOfMonth = startOfMonth;
exports.endOfMonth = endOfMonth;
function startOfDay(date = new Date()) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}
function endOfDay(date = new Date()) {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
}
function startOfMonth(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}
function endOfMonth(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}
//# sourceMappingURL=sales-date.helper.js.map