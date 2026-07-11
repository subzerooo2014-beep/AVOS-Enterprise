import { CodeGenMetadata } from "../../core/codegen.contracts";
import { CodeGenRuntimeEventHandler, CodeGenRuntimeEventV2 } from "./codegen-runtime-event-v2.contracts";
export declare class CodeGenRuntimeEventBusV2 {
    private readonly handlers;
    subscribe(eventType: string, handler: CodeGenRuntimeEventHandler): () => void;
    publish<T>(input: {
        type: string;
        source: string;
        payload: T;
        metadata?: CodeGenMetadata;
    }): Promise<CodeGenRuntimeEventV2<T>>;
    clear(): void;
}
//# sourceMappingURL=codegen-runtime-event-bus-v2.d.ts.map