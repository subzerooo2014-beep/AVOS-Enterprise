"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenBlueprintRuntimeStore = void 0;
const node_crypto_1 = require("node:crypto");
const codegen_errors_1 = require("../../core/codegen.errors");
const codegen_blueprint_runtime_contracts_1 = require("./codegen-blueprint-runtime.contracts");
class CodeGenBlueprintRuntimeStore {
    executions = new Map();
    create(request) {
        const now = new Date().toISOString();
        const execution = {
            executionId: (0, node_crypto_1.randomUUID)(),
            blueprintKey: request.blueprintKey,
            status: codegen_blueprint_runtime_contracts_1.CodeGenBlueprintRuntimeStatus.CREATED,
            request: structuredClone(request),
            templates: [],
            artifacts: [],
            warnings: [],
            errors: [],
            createdAt: now,
            updatedAt: now,
        };
        this.executions.set(execution.executionId, execution);
        return structuredClone(execution);
    }
    get(executionId) {
        const execution = this.executions.get(executionId);
        if (!execution) {
            throw new codegen_errors_1.CodeGenValidationError(`Blueprint runtime execution was not found: ${executionId}`);
        }
        return structuredClone(execution);
    }
    find(executionId) {
        const execution = this.executions.get(executionId);
        return execution
            ? structuredClone(execution)
            : undefined;
    }
    mutate(executionId, mutation) {
        const execution = this.executions.get(executionId);
        if (!execution) {
            throw new codegen_errors_1.CodeGenValidationError(`Blueprint runtime execution was not found: ${executionId}`);
        }
        mutation(execution);
        execution.updatedAt =
            new Date().toISOString();
        return structuredClone(execution);
    }
    setStatus(executionId, status) {
        return this.mutate(executionId, (execution) => {
            execution.status =
                status;
            if (status ===
                codegen_blueprint_runtime_contracts_1.CodeGenBlueprintRuntimeStatus.EXECUTING &&
                !execution.startedAt) {
                execution.startedAt =
                    new Date().toISOString();
            }
            if ([
                codegen_blueprint_runtime_contracts_1.CodeGenBlueprintRuntimeStatus.COMPLETED,
                codegen_blueprint_runtime_contracts_1.CodeGenBlueprintRuntimeStatus.FAILED,
            ].includes(status)) {
                execution.completedAt =
                    new Date().toISOString();
            }
        });
    }
    addWarning(executionId, warning) {
        return this.mutate(executionId, (execution) => {
            execution.warnings.push(warning);
        });
    }
    addError(executionId, error) {
        return this.mutate(executionId, (execution) => {
            execution.errors.push(error);
        });
    }
    list() {
        return Array.from(this.executions.values())
            .map((execution) => structuredClone(execution))
            .sort((left, right) => left.createdAt.localeCompare(right.createdAt));
    }
    remove(executionId) {
        const execution = this.get(executionId);
        this.executions.delete(executionId);
        return execution;
    }
    clear() {
        this.executions.clear();
    }
}
exports.CodeGenBlueprintRuntimeStore = CodeGenBlueprintRuntimeStore;
//# sourceMappingURL=codegen-blueprint-runtime-store.js.map