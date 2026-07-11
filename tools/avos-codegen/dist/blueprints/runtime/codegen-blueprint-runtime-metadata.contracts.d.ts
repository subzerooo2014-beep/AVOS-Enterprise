import { CodeGenJsonValue, CodeGenMetadata, CodeGenVersion } from "../../core/codegen.contracts";
export declare enum CodeGenBlueprintRuntimeSource {
    MEMORY = "memory",
    FILESYSTEM = "filesystem",
    PLUGIN = "plugin",
    MARKETPLACE = "marketplace"
}
export interface CodeGenBlueprintRuntimeMetadata {
    key: string;
    name: string;
    description?: string;
    version: CodeGenVersion;
    source: CodeGenBlueprintRuntimeSource;
    sourcePath?: string;
    enabled: boolean;
    category: string;
    capabilities: string[];
    dependencies: string[];
    tags: string[];
    templateKeys: string[];
    metadata: CodeGenMetadata;
    discoveredAt: string;
    registeredAt?: string;
}
export interface CodeGenBlueprintRuntimeDiscoveryRecord {
    key: string;
    source: CodeGenBlueprintRuntimeSource;
    sourcePath?: string;
    valid: boolean;
    warnings: string[];
    errors: string[];
    metadata?: Record<string, CodeGenJsonValue>;
    discoveredAt: string;
}
export interface CodeGenBlueprintRuntimeRegistrySnapshot {
    registered: number;
    enabled: number;
    disabled: number;
    categories: string[];
    capabilities: string[];
    dependencies: number;
    generatedAt: string;
}
//# sourceMappingURL=codegen-blueprint-runtime-metadata.contracts.d.ts.map