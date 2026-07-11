import { CodeGenMetadata } from "../../core/codegen.contracts";
export interface CodeGenRuntimeEventV2<T = unknown> {
    id: string;
    type: string;
    source: string;
    payload: T;
    metadata: CodeGenMetadata;
    createdAt: string;
}
export type CodeGenRuntimeEventHandler<T = unknown> = (event: CodeGenRuntimeEventV2<T>) => Promise<void> | void;
//# sourceMappingURL=codegen-runtime-event-v2.contracts.d.ts.map