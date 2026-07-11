export type CodeGenJsonPrimitive = string | number | boolean | null;
export type CodeGenJsonValue = CodeGenJsonPrimitive | CodeGenJsonValue[] | {
    [key: string]: CodeGenJsonValue;
};
export type CodeGenMetadata = Record<string, CodeGenJsonValue>;
export declare enum CodeGenKernelStatus {
    CREATED = "created",
    INITIALIZING = "initializing",
    READY = "ready",
    RUNNING = "running",
    STOPPING = "stopping",
    STOPPED = "stopped",
    FAILED = "failed"
}
export declare enum CodeGenEngineType {
    KERNEL = "kernel",
    REGISTRY = "registry",
    TEMPLATE = "template",
    BLUEPRINT = "blueprint",
    GENERATOR = "generator",
    BUILDER = "builder",
    VALIDATOR = "validator",
    PIPELINE = "pipeline",
    PLUGIN = "plugin",
    MANIFEST = "manifest",
    DOCUMENTATION = "documentation",
    CUSTOM = "custom"
}
export declare enum CodeGenEventSeverity {
    DEBUG = "debug",
    INFORMATIONAL = "informational",
    WARNING = "warning",
    ERROR = "error",
    CRITICAL = "critical"
}
export declare enum CodeGenEventType {
    KERNEL_CREATED = "kernel_created",
    KERNEL_INITIALIZING = "kernel_initializing",
    KERNEL_READY = "kernel_ready",
    KERNEL_STOPPING = "kernel_stopping",
    KERNEL_STOPPED = "kernel_stopped",
    KERNEL_FAILED = "kernel_failed",
    ENGINE_REGISTERED = "engine_registered",
    ENGINE_REPLACED = "engine_replaced",
    ENGINE_REMOVED = "engine_removed",
    PIPELINE_STARTED = "pipeline_started",
    PIPELINE_COMPLETED = "pipeline_completed",
    PIPELINE_FAILED = "pipeline_failed",
    CUSTOM = "custom"
}
export interface CodeGenVersion {
    major: number;
    minor: number;
    patch: number;
    prerelease?: string;
}
export interface CodeGenRuntimeContext {
    executionId: string;
    workspaceRoot: string;
    codegenRoot: string;
    environment: string;
    dryRun: boolean;
    startedAt: string;
    variables: Record<string, CodeGenJsonValue>;
    metadata: CodeGenMetadata;
}
export interface CodeGenEngineDescriptor {
    id: string;
    key: string;
    name: string;
    description?: string;
    type: CodeGenEngineType;
    version: CodeGenVersion;
    enabled: boolean;
    priority: number;
    capabilities: string[];
    dependencies: string[];
    metadata: CodeGenMetadata;
    registeredAt: string;
}
export interface CodeGenEngine {
    readonly descriptor: CodeGenEngineDescriptor;
    initialize?(context: CodeGenRuntimeContext): Promise<void> | void;
    start?(context: CodeGenRuntimeContext): Promise<void> | void;
    stop?(context: CodeGenRuntimeContext): Promise<void> | void;
}
export interface CodeGenEvent<TPayload extends CodeGenJsonValue = CodeGenJsonValue> {
    id: string;
    sequence: number;
    type: CodeGenEventType;
    severity: CodeGenEventSeverity;
    source: string;
    executionId?: string;
    payload: TPayload;
    metadata: CodeGenMetadata;
    createdAt: string;
}
export type CodeGenEventHandler<TPayload extends CodeGenJsonValue = CodeGenJsonValue> = (event: CodeGenEvent<TPayload>) => Promise<void> | void;
export interface CodeGenKernelSnapshot {
    name: string;
    version: string;
    status: CodeGenKernelStatus;
    engines: number;
    enabledEngines: number;
    events: number;
    executionId?: string;
    initializedAt?: string;
    startedAt?: string;
    stoppedAt?: string;
    lastError?: string;
}
export declare enum CodeGenConfigurationSource {
    DEFAULT = "default",
    FILE = "file",
    ENVIRONMENT = "environment",
    RUNTIME = "runtime",
    PLUGIN = "plugin"
}
export declare enum CodeGenManifestType {
    SYSTEM = "system",
    ENGINE = "engine",
    PLUGIN = "plugin",
    BLUEPRINT = "blueprint",
    TEMPLATE = "template",
    GENERATOR = "generator",
    PIPELINE = "pipeline",
    CUSTOM = "custom"
}
export declare enum CodeGenPluginStatus {
    DISCOVERED = "discovered",
    REGISTERED = "registered",
    INITIALIZING = "initializing",
    READY = "ready",
    DISABLED = "disabled",
    FAILED = "failed",
    REMOVED = "removed"
}
export declare enum CodeGenDiagnosticLevel {
    DEBUG = "debug",
    INFORMATIONAL = "informational",
    WARNING = "warning",
    ERROR = "error",
    CRITICAL = "critical"
}
export interface CodeGenConfigurationEntry {
    key: string;
    value: CodeGenJsonValue;
    source: CodeGenConfigurationSource;
    readonly: boolean;
    description?: string;
    updatedAt: string;
}
export interface CodeGenConfigurationSnapshot {
    entries: CodeGenConfigurationEntry[];
    count: number;
    generatedAt: string;
}
export interface CodeGenManifest {
    id: string;
    key: string;
    name: string;
    description?: string;
    type: CodeGenManifestType;
    version: CodeGenVersion;
    enabled: boolean;
    entrypoint?: string;
    dependencies: string[];
    capabilities: string[];
    compatibility: {
        minimumCodeGenVersion?: string;
        maximumCodeGenVersion?: string;
        supportedAvosVersions: string[];
    };
    metadata: CodeGenMetadata;
    createdAt: string;
    updatedAt: string;
}
export interface CodeGenPluginDescriptor {
    id: string;
    key: string;
    name: string;
    description?: string;
    version: CodeGenVersion;
    status: CodeGenPluginStatus;
    enabled: boolean;
    entrypoint: string;
    capabilities: string[];
    dependencies: string[];
    metadata: CodeGenMetadata;
    discoveredAt: string;
    registeredAt?: string;
    initializedAt?: string;
    failedAt?: string;
    error?: string;
}
export interface CodeGenPlugin {
    readonly descriptor: CodeGenPluginDescriptor;
    initialize?(context: CodeGenRuntimeContext): Promise<void> | void;
    activate?(context: CodeGenRuntimeContext): Promise<void> | void;
    deactivate?(context: CodeGenRuntimeContext): Promise<void> | void;
}
export interface CodeGenDiagnosticRecord {
    id: string;
    sequence: number;
    level: CodeGenDiagnosticLevel;
    code: string;
    message: string;
    source: string;
    executionId?: string;
    details: CodeGenMetadata;
    createdAt: string;
}
export interface CodeGenDiagnosticsSnapshot {
    total: number;
    debug: number;
    informational: number;
    warnings: number;
    errors: number;
    critical: number;
    healthy: boolean;
    generatedAt: string;
}
//# sourceMappingURL=codegen.contracts.d.ts.map