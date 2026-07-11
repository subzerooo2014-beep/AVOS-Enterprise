"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canonicalizeJson = canonicalizeJson;
exports.cloneJson = cloneJson;
function normalizeValue(value) {
    if (value === null || value === undefined) {
        return value ?? null;
    }
    if (value instanceof Date) {
        return value.toISOString();
    }
    if (Array.isArray(value)) {
        return value.map((item) => normalizeValue(item));
    }
    if (typeof value === "object") {
        const objectValue = value;
        const normalized = {};
        for (const key of Object.keys(objectValue).sort()) {
            const entry = objectValue[key];
            if (entry !== undefined) {
                normalized[key] = normalizeValue(entry);
            }
        }
        return normalized;
    }
    if (typeof value === "number" && !Number.isFinite(value)) {
        return String(value);
    }
    return value;
}
function canonicalizeJson(value) {
    return JSON.stringify(normalizeValue(value));
}
function cloneJson(value) {
    return JSON.parse(canonicalizeJson(value));
}
//# sourceMappingURL=canonical-json.util.js.map