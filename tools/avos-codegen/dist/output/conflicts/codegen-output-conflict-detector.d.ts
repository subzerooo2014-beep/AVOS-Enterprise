import { CodeGenConflictPolicy, CodeGenOutputConflict } from "../codegen-output.contracts";
import { CodeGenFileFingerprintEngine } from "../fingerprints/codegen-file-fingerprint-engine";
export declare class CodeGenOutputConflictDetector {
    readonly fingerprints: CodeGenFileFingerprintEngine;
    constructor(fingerprints?: CodeGenFileFingerprintEngine);
    detect(input: {
        artifactKey: string;
        targetRoot: string;
        absolutePath: string;
        content: string;
        policy: CodeGenConflictPolicy;
        expectedChecksum?: string;
    }): Promise<CodeGenOutputConflict>;
}
//# sourceMappingURL=codegen-output-conflict-detector.d.ts.map