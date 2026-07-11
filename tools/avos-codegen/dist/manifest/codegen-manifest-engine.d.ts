import { CodeGenManifest, CodeGenManifestType, CodeGenMetadata, CodeGenVersion } from "../core/codegen.contracts";
export interface CreateManifestInput {
    key: string;
    name: string;
    description?: string;
    type: CodeGenManifestType;
    version: CodeGenVersion;
    enabled?: boolean;
    entrypoint?: string;
    dependencies?: string[];
    capabilities?: string[];
    minimumCodeGenVersion?: string;
    maximumCodeGenVersion?: string;
    supportedAvosVersions?: string[];
    metadata?: CodeGenMetadata;
}
export declare class CodeGenManifestEngine {
    private readonly manifests;
    create(input: CreateManifestInput): CodeGenManifest;
    register(manifest: CodeGenManifest, replace?: boolean): CodeGenManifest;
    get(key: string): CodeGenManifest;
    find(key: string): CodeGenManifest | undefined;
    list(): CodeGenManifest[];
    remove(key: string): CodeGenManifest;
    verifyDependencies(key: string): {
        valid: boolean;
        missingDependencies: string[];
        checkedManifest: string;
        checkedVersion: string;
    };
    clear(): void;
}
//# sourceMappingURL=codegen-manifest-engine.d.ts.map