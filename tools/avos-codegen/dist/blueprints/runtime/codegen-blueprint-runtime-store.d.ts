import { CodeGenBlueprintRuntimeExecution, CodeGenBlueprintRuntimeRequest, CodeGenBlueprintRuntimeStatus } from "./codegen-blueprint-runtime.contracts";
export declare class CodeGenBlueprintRuntimeStore {
    private readonly executions;
    create(request: CodeGenBlueprintRuntimeRequest): CodeGenBlueprintRuntimeExecution;
    get(executionId: string): CodeGenBlueprintRuntimeExecution;
    find(executionId: string): CodeGenBlueprintRuntimeExecution | undefined;
    mutate(executionId: string, mutation: (execution: CodeGenBlueprintRuntimeExecution) => void): CodeGenBlueprintRuntimeExecution;
    setStatus(executionId: string, status: CodeGenBlueprintRuntimeStatus): CodeGenBlueprintRuntimeExecution;
    addWarning(executionId: string, warning: string): CodeGenBlueprintRuntimeExecution;
    addError(executionId: string, error: string): CodeGenBlueprintRuntimeExecution;
    list(): CodeGenBlueprintRuntimeExecution[];
    remove(executionId: string): CodeGenBlueprintRuntimeExecution;
    clear(): void;
}
//# sourceMappingURL=codegen-blueprint-runtime-store.d.ts.map