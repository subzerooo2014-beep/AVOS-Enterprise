"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvosCodeGenKernel = void 0;
const node_crypto_1 = require("node:crypto");
const codegen_contracts_1 = require("../core/codegen.contracts");
const codegen_errors_1 = require("../core/codegen.errors");
const codegen_version_1 = require("../core/codegen-version");
const codegen_engine_registry_1 = require("../registry/codegen-engine-registry");
const codegen_event_bus_1 = require("../runtime/codegen-event-bus");
class AvosCodeGenKernel {
    registry;
    events;
    name = "AVOS CodeGen OS";
    version = (0, codegen_version_1.formatCodeGenVersion)(codegen_version_1.AVOS_CODEGEN_VERSION);
    statusValue = codegen_contracts_1.CodeGenKernelStatus.CREATED;
    contextValue;
    initializedAt;
    startedAt;
    stoppedAt;
    lastError;
    constructor(registry = new codegen_engine_registry_1.CodeGenEngineRegistry(), events = new codegen_event_bus_1.CodeGenEventBus()) {
        this.registry = registry;
        this.events = events;
    }
    get status() {
        return this.statusValue;
    }
    get context() {
        return this.contextValue
            ? structuredClone(this.contextValue)
            : undefined;
    }
    async initialize(input) {
        if (![
            codegen_contracts_1.CodeGenKernelStatus.CREATED,
            codegen_contracts_1.CodeGenKernelStatus.STOPPED,
            codegen_contracts_1.CodeGenKernelStatus.FAILED,
        ].includes(this.statusValue)) {
            throw new codegen_errors_1.CodeGenKernelStateError(`Kernel cannot initialize from status ${this.statusValue}`);
        }
        this.statusValue =
            codegen_contracts_1.CodeGenKernelStatus.INITIALIZING;
        const now = new Date().toISOString();
        const context = {
            executionId: (0, node_crypto_1.randomUUID)(),
            workspaceRoot: input.workspaceRoot,
            codegenRoot: input.codegenRoot,
            environment: input.environment ??
                "development",
            dryRun: input.dryRun ??
                false,
            startedAt: now,
            variables: input.variables ?? {},
            metadata: input.metadata ?? {},
        };
        this.contextValue =
            context;
        await this.events.emit({
            type: codegen_contracts_1.CodeGenEventType.KERNEL_INITIALIZING,
            source: "avos-codegen-kernel",
            executionId: context.executionId,
            payload: {
                version: this.version,
                workspaceRoot: context.workspaceRoot,
                codegenRoot: context.codegenRoot,
                environment: context.environment,
                dryRun: context.dryRun,
            },
        });
        try {
            for (const engine of this.resolveEngineOrder()) {
                await engine.initialize?.(context);
            }
            this.statusValue =
                codegen_contracts_1.CodeGenKernelStatus.READY;
            this.initializedAt =
                new Date().toISOString();
            this.lastError =
                undefined;
            await this.events.emit({
                type: codegen_contracts_1.CodeGenEventType.KERNEL_READY,
                source: "avos-codegen-kernel",
                executionId: context.executionId,
                payload: {
                    version: this.version,
                    engines: this.registry.count(),
                    initializedAt: this.initializedAt,
                },
            });
            return structuredClone(context);
        }
        catch (error) {
            await this.fail(error);
            throw error;
        }
    }
    async start() {
        const context = this.requireContext();
        if (this.statusValue !==
            codegen_contracts_1.CodeGenKernelStatus.READY) {
            throw new codegen_errors_1.CodeGenKernelStateError(`Kernel cannot start from status ${this.statusValue}`);
        }
        this.statusValue =
            codegen_contracts_1.CodeGenKernelStatus.RUNNING;
        this.startedAt =
            new Date().toISOString();
        try {
            for (const engine of this.resolveEngineOrder()) {
                await engine.start?.(context);
            }
        }
        catch (error) {
            await this.fail(error);
            throw error;
        }
    }
    async stop() {
        const context = this.requireContext();
        if (![
            codegen_contracts_1.CodeGenKernelStatus.READY,
            codegen_contracts_1.CodeGenKernelStatus.RUNNING,
        ].includes(this.statusValue)) {
            throw new codegen_errors_1.CodeGenKernelStateError(`Kernel cannot stop from status ${this.statusValue}`);
        }
        this.statusValue =
            codegen_contracts_1.CodeGenKernelStatus.STOPPING;
        await this.events.emit({
            type: codegen_contracts_1.CodeGenEventType.KERNEL_STOPPING,
            source: "avos-codegen-kernel",
            executionId: context.executionId,
            payload: {
                engines: this.registry.count(),
            },
        });
        const engines = [...this.resolveEngineOrder()]
            .reverse();
        for (const engine of engines) {
            await engine.stop?.(context);
        }
        this.statusValue =
            codegen_contracts_1.CodeGenKernelStatus.STOPPED;
        this.stoppedAt =
            new Date().toISOString();
        await this.events.emit({
            type: codegen_contracts_1.CodeGenEventType.KERNEL_STOPPED,
            source: "avos-codegen-kernel",
            executionId: context.executionId,
            payload: {
                stoppedAt: this.stoppedAt,
            },
        });
    }
    registerEngine(engine, replace = false) {
        const previous = this.registry.find(engine.descriptor.key);
        const registered = this.registry.register(engine, {
            replace,
        });
        void this.events.emit({
            type: previous
                ? codegen_contracts_1.CodeGenEventType.ENGINE_REPLACED
                : codegen_contracts_1.CodeGenEventType.ENGINE_REGISTERED,
            source: "avos-codegen-kernel",
            ...(this.contextValue
                ? {
                    executionId: this.contextValue.executionId,
                }
                : {}),
            payload: {
                key: registered.descriptor.key,
                name: registered.descriptor.name,
                type: registered.descriptor.type,
                enabled: registered.descriptor.enabled,
            },
        });
        return registered;
    }
    snapshot() {
        return {
            name: this.name,
            version: this.version,
            status: this.statusValue,
            engines: this.registry.count(),
            enabledEngines: this.registry
                .listEnabled()
                .length,
            events: this.events
                .list()
                .length,
            ...(this.contextValue
                ? {
                    executionId: this.contextValue
                        .executionId,
                }
                : {}),
            ...(this.initializedAt
                ? {
                    initializedAt: this.initializedAt,
                }
                : {}),
            ...(this.startedAt
                ? {
                    startedAt: this.startedAt,
                }
                : {}),
            ...(this.stoppedAt
                ? {
                    stoppedAt: this.stoppedAt,
                }
                : {}),
            ...(this.lastError
                ? {
                    lastError: this.lastError,
                }
                : {}),
        };
    }
    resolveEngineOrder() {
        const ordered = [];
        const visiting = new Set();
        const visited = new Set();
        const visit = (engine) => {
            const key = engine.descriptor.key;
            if (visited.has(key)) {
                return;
            }
            if (visiting.has(key)) {
                throw new codegen_errors_1.CodeGenKernelStateError(`Circular engine dependency detected at ${key}`);
            }
            visiting.add(key);
            for (const dependencyKey of engine.descriptor
                .dependencies) {
                const dependency = this.registry.get(dependencyKey);
                visit(dependency);
            }
            visiting.delete(key);
            visited.add(key);
            if (engine.descriptor.enabled) {
                ordered.push(engine);
            }
        };
        for (const engine of this.registry.listEnabled()) {
            visit(engine);
        }
        return ordered;
    }
    requireContext() {
        if (!this.contextValue) {
            throw new codegen_errors_1.CodeGenKernelStateError("CodeGen kernel has not been initialized");
        }
        return this.contextValue;
    }
    async fail(error) {
        const message = error instanceof Error
            ? error.message
            : "Unknown CodeGen kernel failure";
        this.lastError =
            message;
        this.statusValue =
            codegen_contracts_1.CodeGenKernelStatus.FAILED;
        await this.events.emit({
            type: codegen_contracts_1.CodeGenEventType.KERNEL_FAILED,
            severity: codegen_contracts_1.CodeGenEventSeverity.CRITICAL,
            source: "avos-codegen-kernel",
            ...(this.contextValue
                ? {
                    executionId: this.contextValue.executionId,
                }
                : {}),
            payload: {
                error: message,
            },
        });
    }
}
exports.AvosCodeGenKernel = AvosCodeGenKernel;
//# sourceMappingURL=avos-codegen-kernel.js.map