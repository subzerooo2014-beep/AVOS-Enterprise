import { CodeGenBlueprintDefinition } from "../codegen-blueprint.contracts";
import { CodeGenBlueprintRuntimeSource } from "./codegen-blueprint-runtime-metadata.contracts";
import { CodeGenBlueprintRuntimeRegistry } from "./codegen-blueprint-runtime-registry";
export interface CodeGenLoadedBlueprint {
    definition: CodeGenBlueprintDefinition;
    sourcePath: string;
    source: CodeGenBlueprintRuntimeSource;
    loadedAt: string;
}
export declare class CodeGenBlueprintRuntimeLoader {
    readonly registry: CodeGenBlueprintRuntimeRegistry;
    constructor(registry?: CodeGenBlueprintRuntimeRegistry);
    loadFile(filePath: string, replace?: boolean): Promise<CodeGenLoadedBlueprint>;
    loadDefinition(definition: CodeGenBlueprintDefinition, replace?: boolean): CodeGenLoadedBlueprint;
    private validateDefinition;
}
//# sourceMappingURL=codegen-blueprint-runtime-loader.d.ts.map