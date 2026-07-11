import { CodeGenFileFingerprint } from "../codegen-output.contracts";
export declare class CodeGenFileFingerprintEngine {
    fingerprint(absolutePath: string): Promise<CodeGenFileFingerprint>;
    fingerprintContent(absolutePath: string, content: string): CodeGenFileFingerprint;
}
//# sourceMappingURL=codegen-file-fingerprint-engine.d.ts.map