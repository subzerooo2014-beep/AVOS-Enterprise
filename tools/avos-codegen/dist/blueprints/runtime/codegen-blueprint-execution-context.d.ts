import { CodeGenJsonValue, CodeGenMetadata } from "../../core/codegen.contracts";
import { CodeGenBlueprintDefinition } from "../codegen-blueprint.contracts";
import { CodeGenBlueprintRuntimeExecution, CodeGenBlueprintRuntimeRequest } from "./codegen-blueprint-runtime.contracts";
export interface CodeGenBlueprintExecutionContext {
    executionId: string;
    blueprint: CodeGenBlueprintDefinition;
    request: CodeGenBlueprintRuntimeRequest;
    workspaceRoot: string;
    targetRoot: string;
    variables: Record<string, CodeGenJsonValue>;
    metadata: CodeGenMetadata;
    dryRun: boolean;
    strict: boolean;
    startedAt: string;
}
export declare class CodeGenBlueprintExecutionContextFactory {
    create(execution: CodeGenBlueprintRuntimeExecution, blueprint: CodeGenBlueprintDefinition): CodeGenBlueprintExecutionContext;
}
//# sourceMappingURL=codegen-blueprint-execution-context.d.ts.map