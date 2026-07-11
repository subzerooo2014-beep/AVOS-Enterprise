"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenOutputIntegrityVerifier = void 0;
const codegen_file_fingerprint_engine_1 = require("../fingerprints/codegen-file-fingerprint-engine");
class CodeGenOutputIntegrityVerifier {
    fingerprints;
    constructor(fingerprints = new codegen_file_fingerprint_engine_1.CodeGenFileFingerprintEngine()) {
        this.fingerprints = fingerprints;
    }
    async verify(manifest) {
        const missing = [];
        const mismatched = [];
        for (const entry of manifest.entries) {
            if (entry.status !==
                "written") {
                continue;
            }
            const fingerprint = await this.fingerprints
                .fingerprint(entry.absolutePath);
            if (!fingerprint.exists) {
                missing.push(entry.absolutePath);
                continue;
            }
            if (fingerprint.checksum !==
                entry.checksum) {
                mismatched.push({
                    absolutePath: entry.absolutePath,
                    expectedChecksum: entry.checksum,
                    ...(fingerprint.checksum
                        ? {
                            actualChecksum: fingerprint.checksum,
                        }
                        : {}),
                });
            }
        }
        return {
            valid: missing.length === 0 &&
                mismatched.length === 0,
            checked: manifest.entries.filter((entry) => entry.status ===
                "written").length,
            missing,
            mismatched,
            verifiedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenOutputIntegrityVerifier = CodeGenOutputIntegrityVerifier;
//# sourceMappingURL=codegen-output-integrity-verifier.js.map