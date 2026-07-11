"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenEnterpriseRecoveryManagerV2 = void 0;
const codegen_enterprise_recovery_contracts_1 = require("./codegen-enterprise-recovery.contracts");
class CodeGenEnterpriseRecoveryManagerV2 {
    async recover(request) {
        const startedAt = new Date().toISOString();
        const warnings = [];
        const errors = [];
        let restoredArtifacts = 0;
        let restoredCacheEntries = 0;
        try {
            if (request.restoreArtifacts) {
                restoredArtifacts =
                    request.session.artifacts.length;
            }
            if (request.restoreCache) {
                restoredCacheEntries =
                    request.session.metrics.cacheHits +
                        request.session.metrics.cacheMisses;
            }
            if (request.validateAfterRestore &&
                request.session.errors.length > 0) {
                warnings.push("Recovered session contains previous errors");
            }
            const completedAt = new Date().toISOString();
            return {
                success: true,
                status: codegen_enterprise_recovery_contracts_1.CodeGenEnterpriseRecoveryStatus.COMPLETED,
                restoredArtifacts,
                restoredCacheEntries,
                warnings,
                errors,
                startedAt,
                completedAt,
                durationMs: Date.parse(completedAt) -
                    Date.parse(startedAt),
            };
        }
        catch (error) {
            errors.push(error instanceof Error
                ? error.message
                : String(error));
            const completedAt = new Date().toISOString();
            return {
                success: false,
                status: codegen_enterprise_recovery_contracts_1.CodeGenEnterpriseRecoveryStatus.FAILED,
                restoredArtifacts,
                restoredCacheEntries,
                warnings,
                errors,
                startedAt,
                completedAt,
                durationMs: Date.parse(completedAt) -
                    Date.parse(startedAt),
            };
        }
    }
}
exports.CodeGenEnterpriseRecoveryManagerV2 = CodeGenEnterpriseRecoveryManagerV2;
//# sourceMappingURL=codegen-enterprise-recovery-manager-v2.js.map