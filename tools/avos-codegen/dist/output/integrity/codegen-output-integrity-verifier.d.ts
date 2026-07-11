import { CodeGenIntegrityResult, CodeGenOutputManifest } from "../codegen-output.contracts";
import { CodeGenFileFingerprintEngine } from "../fingerprints/codegen-file-fingerprint-engine";
export declare class CodeGenOutputIntegrityVerifier {
    readonly fingerprints: CodeGenFileFingerprintEngine;
    constructor(fingerprints?: CodeGenFileFingerprintEngine);
    verify(manifest: CodeGenOutputManifest): Promise<CodeGenIntegrityResult>;
}
//# sourceMappingURL=codegen-output-integrity-verifier.d.ts.map