import { CodeGenBlueprintDefinition } from "../codegen-blueprint.contracts";
import { CodeGenTemplateDefinition } from "../../templates/codegen-template.contracts";
export interface CodeGenBlueprintBootstrapResult {
    blueprints: CodeGenBlueprintDefinition[];
    templates: CodeGenTemplateDefinition[];
    warnings: string[];
    initializedAt: string;
}
//# sourceMappingURL=codegen-blueprint-bootstrap.contracts.d.ts.map