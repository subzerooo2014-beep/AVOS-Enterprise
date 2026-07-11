import { CodeGenOutputManifest, CodeGenOutputManifestEntry } from "../codegen-output.contracts";
export declare class CodeGenOutputManifestEngine {
    create(input: {
        sessionId: string;
        workspaceRoot: string;
        targetRoot: string;
        entries: readonly CodeGenOutputManifestEntry[];
    }): CodeGenOutputManifest;
    write(manifest: CodeGenOutputManifest, filePath?: string): Promise<string>;
}
//# sourceMappingURL=codegen-output-manifest-engine.d.ts.map