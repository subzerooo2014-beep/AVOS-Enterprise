"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenTemplateExpressionResolverV2 = void 0;
class CodeGenTemplateExpressionResolverV2 {
    resolve(expression, scope) {
        const normalized = expression.trim();
        if (!normalized) {
            return undefined;
        }
        if (normalized === "true") {
            return true;
        }
        if (normalized === "false") {
            return false;
        }
        if (normalized === "null") {
            return null;
        }
        if (/^-?\d+(?:\.\d+)?$/.test(normalized)) {
            return Number(normalized);
        }
        const parts = normalized
            .split(".")
            .map((part) => part.trim())
            .filter(Boolean);
        let current = scope;
        for (const part of parts) {
            if (current === null ||
                typeof current !==
                    "object" ||
                Array.isArray(current)) {
                return undefined;
            }
            current =
                current[part];
        }
        return current;
    }
    isTruthy(value) {
        if (value === undefined ||
            value === null ||
            value === false) {
            return false;
        }
        if (typeof value ===
            "string") {
            return value.length >
                0;
        }
        if (typeof value ===
            "number") {
            return value !== 0;
        }
        if (Array.isArray(value)) {
            return value.length >
                0;
        }
        return true;
    }
    stringify(value) {
        if (value === undefined ||
            value === null) {
            return "";
        }
        if (typeof value ===
            "string" ||
            typeof value ===
                "number" ||
            typeof value ===
                "boolean") {
            return String(value);
        }
        return JSON.stringify(value, null, 2);
    }
}
exports.CodeGenTemplateExpressionResolverV2 = CodeGenTemplateExpressionResolverV2;
//# sourceMappingURL=codegen-template-expression-resolver-v2.js.map