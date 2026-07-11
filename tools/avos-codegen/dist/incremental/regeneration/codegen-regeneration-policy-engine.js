"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenRegenerationPolicyEngine = void 0;
const codegen_incremental_contracts_1 = require("../contracts/codegen-incremental.contracts");
class CodeGenRegenerationPolicyEngine {
    normalize(input = {}) {
        return {
            regenerateModified: input.regenerateModified ??
                true,
            generateCreated: input.generateCreated ??
                true,
            deleteRemoved: input.deleteRemoved ??
                false,
            skipUnchanged: input.skipUnchanged ??
                true,
            failOnConflict: input.failOnConflict ??
                true,
        };
    }
    decide(change, policy) {
        switch (change.type) {
            case codegen_incremental_contracts_1.CodeGenArtifactChangeType.CREATED:
                return policy.generateCreated
                    ? codegen_incremental_contracts_1.CodeGenRegenerationDecision.GENERATE
                    : codegen_incremental_contracts_1.CodeGenRegenerationDecision.SKIP;
            case codegen_incremental_contracts_1.CodeGenArtifactChangeType.MODIFIED:
            case codegen_incremental_contracts_1.CodeGenArtifactChangeType.MOVED:
                return policy.regenerateModified
                    ? codegen_incremental_contracts_1.CodeGenRegenerationDecision.REGENERATE
                    : codegen_incremental_contracts_1.CodeGenRegenerationDecision.SKIP;
            case codegen_incremental_contracts_1.CodeGenArtifactChangeType.DELETED:
                return policy.deleteRemoved
                    ? codegen_incremental_contracts_1.CodeGenRegenerationDecision.DELETE
                    : codegen_incremental_contracts_1.CodeGenRegenerationDecision.SKIP;
            case codegen_incremental_contracts_1.CodeGenArtifactChangeType.CONFLICTED:
                return policy.failOnConflict
                    ? codegen_incremental_contracts_1.CodeGenRegenerationDecision.CONFLICT
                    : codegen_incremental_contracts_1.CodeGenRegenerationDecision.SKIP;
            case codegen_incremental_contracts_1.CodeGenArtifactChangeType.UNCHANGED:
            default:
                return policy.skipUnchanged
                    ? codegen_incremental_contracts_1.CodeGenRegenerationDecision.SKIP
                    : codegen_incremental_contracts_1.CodeGenRegenerationDecision.REGENERATE;
        }
    }
}
exports.CodeGenRegenerationPolicyEngine = CodeGenRegenerationPolicyEngine;
//# sourceMappingURL=codegen-regeneration-policy-engine.js.map