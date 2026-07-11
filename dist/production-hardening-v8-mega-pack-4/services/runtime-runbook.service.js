"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeRunbookService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const contracts_1 = require("../contracts");
const executors_1 = require("../executors");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
let RuntimeRunbookService = class RuntimeRunbookService {
    constructor(store, executor) {
        this.store = store;
        this.executor = executor;
    }
    create(dto) {
        const versions = this.store
            .findRunbooksByKey(dto.key);
        const version = versions.length === 0
            ? 1
            : Math.max(...versions.map((item) => item.version)) + 1;
        const now = new Date().toISOString();
        const runbook = {
            id: (0, crypto_1.randomUUID)(),
            key: dto.key,
            name: dto.name,
            description: dto.description,
            version,
            status: contracts_1.RuntimeRunbookStatus.DRAFT,
            environment: dto.environment,
            namespace: dto.namespace,
            service: dto.service,
            requestTypes: dto.requestTypes,
            minimumRiskLevel: dto.minimumRiskLevel,
            maximumRiskLevel: dto.maximumRiskLevel,
            requiresApproval: dto.requiresApproval,
            requiredRoles: dto.requiredRoles,
            steps: dto.steps
                .map((step) => ({
                id: step.id,
                name: step.name,
                description: step.description,
                type: step.type,
                order: step.order,
                required: step.required,
                timeoutSeconds: step.timeoutSeconds,
                retryLimit: step.retryLimit,
                continueOnFailure: step.continueOnFailure,
                condition: step.condition,
                parameters: step.parameters,
                rollbackStepType: step.rollbackStepType,
                rollbackParameters: step.rollbackParameters,
            }))
                .sort((a, b) => a.order - b.order),
            tags: dto.tags ?? [],
            metadata: (dto.metadata ?? {}),
            createdBy: dto.actor,
            createdAt: now,
            updatedAt: now,
        };
        return this.store
            .saveRunbookDefinition(runbook);
    }
    list() {
        return this.store
            .listRunbookDefinitions();
    }
    get(id) {
        const runbook = this.store
            .getRunbookDefinition(id);
        if (!runbook) {
            throw new common_1.NotFoundException(`Runtime runbook ${id} was not found`);
        }
        return runbook;
    }
    updateStatus(id, dto) {
        const runbook = this.get(id);
        const now = new Date().toISOString();
        runbook.status =
            dto.status;
        runbook.updatedAt =
            now;
        if (dto.status ===
            contracts_1.RuntimeRunbookStatus.ACTIVE) {
            runbook.activatedAt =
                now;
        }
        if (dto.status ===
            contracts_1.RuntimeRunbookStatus.DISABLED) {
            runbook.disabledAt =
                now;
        }
        if (dto.status ===
            contracts_1.RuntimeRunbookStatus.ARCHIVED) {
            runbook.archivedAt =
                now;
        }
        runbook.metadata = {
            ...runbook.metadata,
            lastStatusReason: dto.reason,
            lastStatusActorId: dto.actor.id,
        };
        return this.store
            .saveRunbookDefinition(runbook);
    }
    async execute(id, dto) {
        const runbook = this.get(id);
        if (runbook.status !==
            contracts_1.RuntimeRunbookStatus.ACTIVE) {
            throw new common_1.BadRequestException(`Runbook is not active. Current status: ${runbook.status}`);
        }
        const now = new Date().toISOString();
        let execution = {
            id: (0, crypto_1.randomUUID)(),
            runbookId: runbook.id,
            runbookVersion: runbook.version,
            governanceRequestId: dto.governanceRequestId,
            decisionRecordId: dto.decisionRecordId,
            changeExecutionId: dto.changeExecutionId,
            status: contracts_1.RuntimeRunbookExecutionStatus.RUNNING,
            currentStepOrder: 0,
            stepExecutions: [],
            runtimeContext: (dto.runtimeContext ?? {}),
            dryRun: dto.dryRun ?? true,
            startedBy: dto.actor,
            startedAt: now,
            updatedAt: now,
        };
        execution =
            this.store
                .saveRunbookExecution(execution);
        try {
            for (const step of runbook.steps) {
                execution.currentStepOrder =
                    step.order;
                let succeeded = false;
                let lastError;
                for (let attempt = 1; attempt <=
                    step.retryLimit + 1; attempt += 1) {
                    const startedAt = new Date().toISOString();
                    const result = await this.executor
                        .execute({
                        step,
                        dryRun: execution.dryRun,
                        runtimeContext: execution
                            .runtimeContext,
                    });
                    const stepExecution = {
                        id: (0, crypto_1.randomUUID)(),
                        runbookExecutionId: execution.id,
                        stepDefinitionId: step.id,
                        status: result.succeeded
                            ? contracts_1.RuntimeRunbookStepStatus.SUCCEEDED
                            : contracts_1.RuntimeRunbookStepStatus.FAILED,
                        attempt,
                        startedAt,
                        completedAt: new Date().toISOString(),
                        output: result.output,
                        error: result.error,
                    };
                    execution
                        .stepExecutions
                        .push(stepExecution);
                    if (result.succeeded) {
                        succeeded =
                            true;
                        break;
                    }
                    lastError =
                        result.error;
                }
                execution.updatedAt =
                    new Date().toISOString();
                this.store
                    .saveRunbookExecution(execution);
                if (!succeeded &&
                    step.required &&
                    !step.continueOnFailure) {
                    throw new Error(lastError ??
                        `Runbook step ${step.name} failed`);
                }
            }
            execution.status =
                contracts_1.RuntimeRunbookExecutionStatus.SUCCEEDED;
            execution.completedAt =
                new Date().toISOString();
            execution.updatedAt =
                execution.completedAt;
            return this.store
                .saveRunbookExecution(execution);
        }
        catch (error) {
            execution.status =
                contracts_1.RuntimeRunbookExecutionStatus.FAILED;
            execution.failedAt =
                new Date().toISOString();
            execution.updatedAt =
                execution.failedAt;
            execution.error =
                error instanceof Error
                    ? error.message
                    : "Unknown runbook execution failure";
            return this.store
                .saveRunbookExecution(execution);
        }
    }
    listExecutions() {
        return this.store
            .listRunbookExecutions();
    }
    getExecution(id) {
        const execution = this.store
            .getRunbookExecution(id);
        if (!execution) {
            throw new common_1.NotFoundException(`Runtime runbook execution ${id} was not found`);
        }
        return execution;
    }
};
exports.RuntimeRunbookService = RuntimeRunbookService;
exports.RuntimeRunbookService = RuntimeRunbookService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore,
        executors_1.RuntimeRunbookStepExecutor])
], RuntimeRunbookService);
//# sourceMappingURL=runtime-runbook.service.js.map