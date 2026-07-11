import { CodeGenBlueprintDefinition, CodeGenBlueprintExecutionInput, CodeGenBlueprintExecutionPlan, CodeGenBlueprintTemplateBinding } from "./codegen-blueprint.contracts";
import { CodeGenMetadata, CodeGenVersion } from "../core/codegen.contracts";
export interface CreateBlueprintInput {
    key: string;
    name: string;
    description?: string;
    version: CodeGenVersion;
    category: string;
    templateBindings: CodeGenBlueprintTemplateBinding[];
    dependencies?: string[];
    capabilities?: string[];
    tags?: string[];
    metadata?: CodeGenMetadata;
}
export declare class CodeGenBlueprintRegistry {
    private readonly blueprints;
    create(input: CreateBlueprintInput): CodeGenBlueprintDefinition;
    register(blueprint: CodeGenBlueprintDefinition, replace?: boolean): CodeGenBlueprintDefinition;
    get(key: string): CodeGenBlueprintDefinition;
    list(): CodeGenBlueprintDefinition[];
    createExecutionPlan(input: CodeGenBlueprintExecutionInput): CodeGenBlueprintExecutionPlan;
    verifyDependencies(key: string): {
        valid: boolean;
        missingDependencies: string[];
    };
    remove(key: string): CodeGenBlueprintDefinition;
    clear(): void;
}
//# sourceMappingURL=codegen-blueprint-registry.d.ts.map