import { CodeGenTemplateEngine } from "../../templates/codegen-template-engine";
import { CodeGenBlueprintExecutionContextFactory } from "./codegen-blueprint-execution-context";
import { CodeGenBlueprintBindingResolver } from "./codegen-blueprint-binding-resolver";
import { CodeGenBlueprintRuntimeRegistry } from "./codegen-blueprint-runtime-registry";
import { CodeGenBlueprintRuntimeStore } from "./codegen-blueprint-runtime-store";
import { CodeGenBlueprintRuntimeValidator } from "./codegen-blueprint-runtime-validator";
import { CodeGenBlueprintVariableMergeEngine } from "./codegen-blueprint-variable-merge-engine";
import { CodeGenTemplateArtifactMapper } from "./codegen-template-artifact-mapper";
import { CodeGenBlueprintRuntimeRequest } from "./codegen-blueprint-runtime.contracts";
export declare class CodeGenBlueprintRuntimeExecutor {
    readonly registry: CodeGenBlueprintRuntimeRegistry;
    readonly templates: CodeGenTemplateEngine;
    readonly store: CodeGenBlueprintRuntimeStore;
    readonly validator: CodeGenBlueprintRuntimeValidator;
    readonly bindingResolver: CodeGenBlueprintBindingResolver;
    readonly variableMerge: CodeGenBlueprintVariableMergeEngine;
    readonly mapper: CodeGenTemplateArtifactMapper;
    readonly contextFactory: CodeGenBlueprintExecutionContextFactory;
    constructor(registry?: CodeGenBlueprintRuntimeRegistry, templates?: CodeGenTemplateEngine, store?: CodeGenBlueprintRuntimeStore, validator?: CodeGenBlueprintRuntimeValidator, bindingResolver?: CodeGenBlueprintBindingResolver, variableMerge?: CodeGenBlueprintVariableMergeEngine, mapper?: CodeGenTemplateArtifactMapper, contextFactory?: CodeGenBlueprintExecutionContextFactory);
    execute(request: CodeGenBlueprintRuntimeRequest): Promise<import("./codegen-blueprint-runtime.contracts").CodeGenBlueprintRuntimeExecution>;
}
//# sourceMappingURL=codegen-blueprint-runtime-executor.d.ts.map