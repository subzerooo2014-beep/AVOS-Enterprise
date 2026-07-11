import { CodeGenDiagnosticLevel, CodeGenDiagnosticRecord, CodeGenDiagnosticsSnapshot, CodeGenMetadata } from "../core/codegen.contracts";
export interface WriteDiagnosticInput {
    level: CodeGenDiagnosticLevel;
    code: string;
    message: string;
    source: string;
    executionId?: string;
    details?: CodeGenMetadata;
}
export declare class CodeGenRuntimeDiagnostics {
    private readonly records;
    private sequence;
    write(input: WriteDiagnosticInput): CodeGenDiagnosticRecord;
    debug(code: string, message: string, source: string, details?: CodeGenMetadata): CodeGenDiagnosticRecord;
    info(code: string, message: string, source: string, details?: CodeGenMetadata): CodeGenDiagnosticRecord;
    warning(code: string, message: string, source: string, details?: CodeGenMetadata): CodeGenDiagnosticRecord;
    error(code: string, message: string, source: string, details?: CodeGenMetadata): CodeGenDiagnosticRecord;
    critical(code: string, message: string, source: string, details?: CodeGenMetadata): CodeGenDiagnosticRecord;
    list(): CodeGenDiagnosticRecord[];
    snapshot(): CodeGenDiagnosticsSnapshot;
    clear(): void;
}
//# sourceMappingURL=codegen-runtime-diagnostics.d.ts.map