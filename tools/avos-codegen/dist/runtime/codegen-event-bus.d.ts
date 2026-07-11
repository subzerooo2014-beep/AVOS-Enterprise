import { CodeGenEvent, CodeGenEventHandler, CodeGenEventSeverity, CodeGenEventType, CodeGenJsonValue, CodeGenMetadata } from "../core/codegen.contracts";
export interface EmitCodeGenEventInput<TPayload extends CodeGenJsonValue = CodeGenJsonValue> {
    type: CodeGenEventType;
    severity?: CodeGenEventSeverity;
    source: string;
    executionId?: string;
    payload: TPayload;
    metadata?: CodeGenMetadata;
}
export declare class CodeGenEventBus {
    private readonly handlers;
    private readonly history;
    private sequence;
    subscribe(type: CodeGenEventType | "*", handler: CodeGenEventHandler): () => void;
    emit<TPayload extends CodeGenJsonValue>(input: EmitCodeGenEventInput<TPayload>): Promise<CodeGenEvent<TPayload>>;
    list(): readonly CodeGenEvent[];
    clear(): void;
}
//# sourceMappingURL=codegen-event-bus.d.ts.map