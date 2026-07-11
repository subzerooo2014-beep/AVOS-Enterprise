import { CodeGenBlueprintDefinition } from "../codegen-blueprint.contracts";
import { CodeGenBlueprintRuntimeMetadata, CodeGenBlueprintRuntimeRegistrySnapshot, CodeGenBlueprintRuntimeSource } from "./codegen-blueprint-runtime-metadata.contracts";
export declare class CodeGenBlueprintRuntimeRegistry {
    private readonly definitions;
    private readonly metadata;
    register(definition: CodeGenBlueprintDefinition, options?: {
        source?: CodeGenBlueprintRuntimeSource;
        sourcePath?: string;
        replace?: boolean;
    }): CodeGenBlueprintDefinition;
    get(key: string): CodeGenBlueprintDefinition;
    find(key: string): CodeGenBlueprintDefinition | undefined;
    getMetadata(key: string): CodeGenBlueprintRuntimeMetadata;
    list(enabledOnly?: boolean): CodeGenBlueprintDefinition[];
    listMetadata(): CodeGenBlueprintRuntimeMetadata[];
    verifyDependencies(key: string): {
        valid: boolean;
        missingDependencies: string[];
    };
    snapshot(): CodeGenBlueprintRuntimeRegistrySnapshot;
    remove(key: string): CodeGenBlueprintDefinition;
    clear(): void;
}
//# sourceMappingURL=codegen-blueprint-runtime-registry.d.ts.map