"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenBlueprintVariableMergeEngine = void 0;
class CodeGenBlueprintVariableMergeEngine {
    merge(...sources) {
        const result = {};
        for (const source of sources) {
            for (const [key, value] of Object.entries(source)) {
                result[key] =
                    this.cloneValue(value);
            }
        }
        return result;
    }
    cloneValue(value) {
        return structuredClone(value);
    }
}
exports.CodeGenBlueprintVariableMergeEngine = CodeGenBlueprintVariableMergeEngine;
//# sourceMappingURL=codegen-blueprint-variable-merge-engine.js.map