"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenVersionCompatibilityEngine = void 0;
class CodeGenVersionCompatibilityEngine {
    check(request) {
        const sourceMajor = this.major(request.sourceVersion);
        const targetMajor = this.major(request.targetVersion);
        const missingCapabilities = request.requiredCapabilities
            .filter((capability) => !request.availableCapabilities.includes(capability));
        const versionCompatible = sourceMajor ===
            targetMajor;
        const warnings = [];
        if (!versionCompatible) {
            warnings.push(`Major version mismatch: ${request.sourceVersion} -> ${request.targetVersion}`);
        }
        if (missingCapabilities.length >
            0) {
            warnings.push(`Missing capabilities: ${missingCapabilities.join(", ")}`);
        }
        return {
            compatible: versionCompatible &&
                missingCapabilities.length ===
                    0,
            missingCapabilities,
            versionCompatible,
            warnings,
            checkedAt: new Date().toISOString(),
        };
    }
    major(version) {
        const first = version
            .split(".")[0];
        const parsed = Number(first);
        return Number.isFinite(parsed)
            ? parsed
            : 0;
    }
}
exports.CodeGenVersionCompatibilityEngine = CodeGenVersionCompatibilityEngine;
//# sourceMappingURL=codegen-version-compatibility-engine.js.map