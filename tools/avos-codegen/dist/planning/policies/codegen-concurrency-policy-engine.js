"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenConcurrencyPolicyEngine = void 0;
const codegen_scheduling_contracts_1 = require("../scheduling/codegen-scheduling.contracts");
class CodeGenConcurrencyPolicyEngine {
    normalize(input = {}) {
        const mode = input.mode ??
            codegen_scheduling_contracts_1.CodeGenConcurrencyMode.BOUNDED;
        const maxParallel = mode ===
            codegen_scheduling_contracts_1.CodeGenConcurrencyMode.SERIAL
            ? 1
            : Math.max(1, input.maxParallel ??
                4);
        return {
            mode,
            maxParallel,
            preserveStageOrder: input.preserveStageOrder ??
                true,
            failFast: input.failFast ??
                true,
        };
    }
}
exports.CodeGenConcurrencyPolicyEngine = CodeGenConcurrencyPolicyEngine;
//# sourceMappingURL=codegen-concurrency-policy-engine.js.map