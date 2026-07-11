export declare enum CodeGenRuntimeLogLevel {
    DEBUG = "debug",
    INFORMATIONAL = "informational",
    WARNING = "warning",
    ERROR = "error"
}
export interface CodeGenRuntimeLogEntry {
    level: CodeGenRuntimeLogLevel;
    message: string;
    context: Record<string, string | number | boolean>;
    createdAt: string;
}
export declare class CodeGenEnterpriseRuntimeLogger {
    private readonly entries;
    log(level: CodeGenRuntimeLogLevel, message: string, context?: Record<string, string | number | boolean>): CodeGenRuntimeLogEntry;
    list(): CodeGenRuntimeLogEntry[];
    clear(): void;
}
//# sourceMappingURL=codegen-enterprise-runtime-logger.d.ts.map