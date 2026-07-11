"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenOutputRecoveryEngine = void 0;
const promises_1 = require("node:fs/promises");
const codegen_errors_1 = require("../../core/codegen.errors");
const codegen_output_integrity_verifier_1 = require("../integrity/codegen-output-integrity-verifier");
class CodeGenOutputRecoveryEngine {
    integrity;
    constructor(integrity = new codegen_output_integrity_verifier_1.CodeGenOutputIntegrityVerifier()) {
        this.integrity = integrity;
    }
    async inspectManifest(manifestPath) {
        let manifest;
        try {
            manifest =
                JSON.parse(await (0, promises_1.readFile)(manifestPath, "utf8"));
        }
        catch (error) {
            throw new codegen_errors_1.CodeGenValidationError(`Unable to read output manifest: ${manifestPath}`, error);
        }
        const integrity = await this.integrity.verify(manifest);
        return {
            manifest,
            integrity,
        };
    }
}
exports.CodeGenOutputRecoveryEngine = CodeGenOutputRecoveryEngine;
//# sourceMappingURL=codegen-output-recovery-engine.js.map