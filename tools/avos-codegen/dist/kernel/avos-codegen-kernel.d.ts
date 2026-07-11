import { CodeGenEngine, CodeGenKernelSnapshot, CodeGenKernelStatus, CodeGenRuntimeContext } from "../core/codegen.contracts";
import { CodeGenEngineRegistry } from "../registry/codegen-engine-registry";
import { CodeGenEventBus } from "../runtime/codegen-event-bus";
export interface CreateCodeGenContextInput {
    workspaceRoot: string;
    codegenRoot: string;
    environment?: string;
    dryRun?: boolean;
    variables?: CodeGenRuntimeContext["variables"];
    metadata?: CodeGenRuntimeContext["metadata"];
}
export declare class AvosCodeGenKernel {
    readonly registry: CodeGenEngineRegistry;
    readonly events: CodeGenEventBus;
    readonly name = "AVOS CodeGen OS";
    readonly version: string;
    private statusValue;
    private contextValue?;
    private initializedAt?;
    private startedAt?;
    private stoppedAt?;
    private lastError;
    constructor(registry?: CodeGenEngineRegistry, events?: CodeGenEventBus);
    get status(): CodeGenKernelStatus;
    get context(): CodeGenRuntimeContext | undefined;
    initialize(input: CreateCodeGenContextInput): Promise<CodeGenRuntimeContext>;
    start(): Promise<void>;
    stop(): Promise<void>;
    registerEngine(engine: CodeGenEngine, replace?: boolean): CodeGenEngine;
    snapshot(): CodeGenKernelSnapshot;
    private resolveEngineOrder;
    private requireContext;
    private fail;
}
//# sourceMappingURL=avos-codegen-kernel.d.ts.map