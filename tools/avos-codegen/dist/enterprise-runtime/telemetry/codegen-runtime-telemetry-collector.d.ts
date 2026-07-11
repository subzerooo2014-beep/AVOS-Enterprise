import { CodeGenMetadata } from "../../core/codegen.contracts";
import { CodeGenTelemetrySnapshot, CodeGenTelemetrySpan } from "./codegen-telemetry.contracts";
export declare class CodeGenRuntimeTelemetryCollector {
    private readonly spans;
    start(name: string, metadata?: CodeGenMetadata): CodeGenTelemetrySpan;
    complete(spanId: string, success?: boolean, metadata?: CodeGenMetadata): CodeGenTelemetrySpan;
    snapshot(): CodeGenTelemetrySnapshot;
    clear(): void;
}
//# sourceMappingURL=codegen-runtime-telemetry-collector.d.ts.map