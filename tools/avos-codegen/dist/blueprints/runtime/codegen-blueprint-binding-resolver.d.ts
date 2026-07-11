import { CodeGenBlueprintDefinition, CodeGenBlueprintTemplateBinding } from "../codegen-blueprint.contracts";
export interface CodeGenResolvedBlueprintBinding {
    blueprintKey: string;
    templateKey: string;
    order: number;
    enabled: boolean;
    variables: CodeGenBlueprintTemplateBinding["variables"];
}
export declare class CodeGenBlueprintBindingResolver {
    resolve(blueprint: CodeGenBlueprintDefinition): CodeGenResolvedBlueprintBinding[];
}
//# sourceMappingURL=codegen-blueprint-binding-resolver.d.ts.map