import { CodeGenBlueprintRuntimeRegistry } from "../runtime/codegen-blueprint-runtime-registry";
import { CodeGenTemplateEngine } from "../../templates/codegen-template-engine";
import { CodeGenBlueprintBootstrapResult } from "./codegen-blueprint-bootstrap.contracts";
export declare class CodeGenBlueprintBootstrapService {
    readonly blueprintRegistry: CodeGenBlueprintRuntimeRegistry;
    readonly templateEngine: CodeGenTemplateEngine;
    constructor(blueprintRegistry?: CodeGenBlueprintRuntimeRegistry, templateEngine?: CodeGenTemplateEngine);
    initialize(input: {
        codegenRoot: string;
        replace?: boolean;
    }): Promise<CodeGenBlueprintBootstrapResult>;
}
//# sourceMappingURL=codegen-blueprint-bootstrap.service.d.ts.map