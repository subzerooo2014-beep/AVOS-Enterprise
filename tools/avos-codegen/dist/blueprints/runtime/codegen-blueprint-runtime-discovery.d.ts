import { CodeGenBlueprintDefinition } from "../codegen-blueprint.contracts";
import { CodeGenBlueprintRuntimeDiscoveryRecord } from "./codegen-blueprint-runtime-metadata.contracts";
import { CodeGenBlueprintRuntimeRegistry } from "./codegen-blueprint-runtime-registry";
export interface DiscoverBlueprintDirectoryResult {
    rootPath: string;
    discovered: CodeGenBlueprintRuntimeDiscoveryRecord[];
    registered: CodeGenBlueprintDefinition[];
    warnings: string[];
    errors: string[];
    completedAt: string;
}
export declare class CodeGenBlueprintRuntimeDiscovery {
    readonly registry: CodeGenBlueprintRuntimeRegistry;
    constructor(registry?: CodeGenBlueprintRuntimeRegistry);
    discoverDirectory(rootPath: string, replace?: boolean): Promise<DiscoverBlueprintDirectoryResult>;
    private validateDefinition;
    private walk;
}
//# sourceMappingURL=codegen-blueprint-runtime-discovery.d.ts.map