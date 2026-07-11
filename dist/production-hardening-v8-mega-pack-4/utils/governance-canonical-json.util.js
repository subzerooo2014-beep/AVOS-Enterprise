"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canonicalizeGovernanceJson = canonicalizeGovernanceJson;
exports.cloneGovernanceJson = cloneGovernanceJson;
function normalizeGovernanceValue(value) {
    if (value === undefined) {
        return null;
    }
    if (value === null) {
        return null;
    }
    if (value instanceof Date) {
        return value.toISOString();
    }
    if (Array.isArray(value)) {
        return value.map((item) => normalizeGovernanceValue(item));
    }
    if (typeof value === "object") {
        const input = value;
        const output = {};
        for (const key of Object.keys(input).sort()) {
            if (input[key] !== undefined) {
                output[key] =
                    normalizeGovernanceValue(input[key]);
            }
        }
        return output;
    }
    if (typeof value === "number" &&
        !Number.isFinite(value)) {
        return String(value);
    }
    return value;
}
function canonicalizeGovernanceJson(value) {
    return JSON.stringify(normalizeGovernanceValue(value));
}
function cloneGovernanceJson(value) {
    return JSON.parse(canonicalizeGovernanceJson(value));
}
//# sourceMappingURL=governance-canonical-json.util.js.map