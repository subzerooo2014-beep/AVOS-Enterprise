import { CodeGenOutputManifest } from "../codegen-output.contracts";
import { CodeGenOutputIntegrityVerifier } from "../integrity/codegen-output-integrity-verifier";
export declare class CodeGenOutputRecoveryEngine {
    readonly integrity: CodeGenOutputIntegrityVerifier;
    constructor(integrity?: CodeGenOutputIntegrityVerifier);
    inspectManifest(manifestPath: string): Promise<{
        manifest: CodeGenOutputManifest;
        integrity: Awaited<ReturnType<CodeGenOutputIntegrityVerifier["verify"]>>;
    }>;
}
//# sourceMappingURL=codegen-output-recovery-engine.d.ts.map