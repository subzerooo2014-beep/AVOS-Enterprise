"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nowDate = nowDate;
exports.diffMs = diffMs;
function nowDate() {
    return new Date();
}
function diffMs(start, end = new Date()) {
    return Math.max(0, end.getTime() - start.getTime());
}
//# sourceMappingURL=publisher-time.util.js.map