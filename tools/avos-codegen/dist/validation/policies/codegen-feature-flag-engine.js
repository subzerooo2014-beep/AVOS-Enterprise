"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenFeatureFlagEngine = void 0;
class CodeGenFeatureFlagEngine {
    isEnabled(featureFlags, key, defaultValue = false) {
        return featureFlags[key] ??
            defaultValue;
    }
    requireEnabled(featureFlags, keys) {
        return keys.filter((key) => !this.isEnabled(featureFlags, key));
    }
}
exports.CodeGenFeatureFlagEngine = CodeGenFeatureFlagEngine;
//# sourceMappingURL=codegen-feature-flag-engine.js.map