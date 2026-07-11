"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenCapabilityResolver = void 0;
class CodeGenCapabilityResolver {
    resolve(required, available) {
        const matched = required.filter((capability) => available.includes(capability));
        const missing = required.filter((capability) => !available.includes(capability));
        const extra = available.filter((capability) => !required.includes(capability));
        return {
            compatible: missing.length === 0,
            matched,
            missing,
            extra,
            score: required.length === 0
                ? 100
                : Math.round(matched.length /
                    required.length *
                    100),
        };
    }
}
exports.CodeGenCapabilityResolver = CodeGenCapabilityResolver;
//# sourceMappingURL=codegen-capability-resolver.js.map