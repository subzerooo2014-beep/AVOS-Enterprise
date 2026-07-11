"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeObject = safeObject;
exports.safeString = safeString;
function safeObject(input) {
    return input && typeof input === "object" && !Array.isArray(input) ? input : {};
}
function safeString(input, fallback = "") {
    return typeof input === "string" && input.trim().length ? input.trim() : fallback;
}
//# sourceMappingURL=publisher-object.util.js.map