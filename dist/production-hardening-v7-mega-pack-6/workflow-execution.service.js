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
exports.WorkflowExecutionService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const mega_pack_6_constants_1 = require("./constants/mega-pack-6.constants");
const enterprise_sequence_service_1 = require("./enterprise-sequence.service");
const mega_pack_6_storage_service_1 = require("./mega-pack-6-storage.service");
const platform_event_bus_service_1 = require("./platform-event-bus.service");
let WorkflowExecutionService = class WorkflowExecutionService {
    constructor(storage, sequence, events) {
        this.storage = storage;
        this.sequence = sequence;
        this.events = events;
    }
    async createDefinition(dto) {
        const definitions = await this.storage.readCollection(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.workflowDefinitions);
        const version = dto.version ?? 1;
        const duplicate = definitions.find((definition) => definition.workflowCode ===
            dto.workflowCode &&
            definition.version === version);
        if (duplicate) {
            throw new common_1.BadRequestException(`Workflow ${dto.workflowCode} version ${version} already exists`);
        }
        const now = new Date().toISOString();
        const steps = dto.steps
            .map((step) => ({
            id: (0, node_crypto_1.randomUUID)(),
            name: step.name,
            stepType: step.stepType,
            handler: step.handler,
            order: step.order,
            timeoutSeconds: step.timeoutSeconds,
            retryLimit: step.retryLimit ?? 0,
            continueOnFailure: step.continueOnFailure ??
                false,
            configuration: step.configuration ?? {},
        }))
            .sort((a, b) => a.order - b.order);
        const definition = {
            id: (0, node_crypto_1.randomUUID)(),
            workflowCode: dto.workflowCode,
            name: dto.name,
            description: dto.description,
            version,
            enabled: dto.enabled ?? true,
            triggerType: dto.triggerType,
            steps,
            metadata: dto.metadata ?? {},
            createdAt: now,
            updatedAt: now,
        };
        definitions.push(definition);
        await this.storage.writeCollection(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.workflowDefinitions, definitions);
        await this.events.publish({
            eventType: "workflow.definition.created",
            source: "WorkflowExecutionService",
            severity: "low",
            entityType: "workflow_definition",
            entityId: definition.id,
            payload: {
                workflowCode: definition.workflowCode,
                version: definition.version,
                steps: definition.steps.length,
            },
        });
        return definition;
    }
    async listDefinitions() {
        const definitions = await this.storage.readCollection(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.workflowDefinitions);
        return definitions.sort((a, b) => a.workflowCode.localeCompare(b.workflowCode) ||
            b.version - a.version);
    }
    async getDefinition(id) {
        const definition = await this.storage.findById(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.workflowDefinitions, id);
        if (!definition) {
            throw new common_1.NotFoundException(`Workflow definition ${id} was not found`);
        }
        return definition;
    }
    async start(workflowId, dto) {
        const definition = await this.getDefinition(workflowId);
        if (!definition.enabled) {
            throw new common_1.BadRequestException("Workflow definition is disabled");
        }
        const now = new Date().toISOString();
        const steps = definition.steps.map((step) => ({
            id: (0, node_crypto_1.randomUUID)(),
            stepDefinitionId: step.id,
            name: step.name,
            status: "pending",
            attempts: 0,
        }));
        const execution = {
            id: (0, node_crypto_1.randomUUID)(),
            executionCode: this.sequence.next(mega_pack_6_constants_1.EXECUTION_CODE_PREFIX),
            workflowId: definition.id,
            workflowCode: definition.workflowCode,
            workflowVersion: definition.version,
            status: "queued",
            trigger: dto.trigger,
            entityReference: dto.entityType && dto.entityId
                ? {
                    entityType: dto.entityType,
                    entityId: dto.entityId,
                }
                : undefined,
            steps,
            context: dto.context ?? {},
            createdAt: now,
            updatedAt: now,
        };
        await this.storage.append(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.workflowExecutions, execution);
        await this.events.publish({
            eventType: "workflow.execution.queued",
            source: "WorkflowExecutionService",
            severity: "low",
            entityType: "workflow_execution",
            entityId: execution.id,
            payload: {
                executionCode: execution.executionCode,
                workflowCode: execution.workflowCode,
            },
        });
        return execution;
    }
    async execute(executionId) {
        let execution = await this.getExecution(executionId);
        const definition = await this.getDefinition(execution.workflowId);
        if (["completed", "cancelled"].includes(execution.status)) {
            return execution;
        }
        const startedAt = execution.startedAt ??
            new Date().toISOString();
        execution = {
            ...execution,
            status: "running",
            startedAt,
            updatedAt: new Date().toISOString(),
        };
        await this.saveExecution(execution);
        for (let index = 0; index < definition.steps.length; index += 1) {
            const definitionStep = definition.steps[index];
            const currentStep = execution.steps.find((step) => step.stepDefinitionId ===
                definitionStep.id);
            if (!currentStep ||
                currentStep.status ===
                    "completed" ||
                currentStep.status ===
                    "skipped") {
                continue;
            }
            execution = {
                ...execution,
                currentStepId: currentStep.id,
                steps: execution.steps.map((step) => step.id ===
                    currentStep.id
                    ? {
                        ...step,
                        status: "running",
                        attempts: step.attempts +
                            1,
                        startedAt: step.startedAt ??
                            new Date().toISOString(),
                    }
                    : step),
                updatedAt: new Date().toISOString(),
            };
            await this.saveExecution(execution);
            const stepResult = await this.executeStep(definitionStep, execution.context);
            if (stepResult.waitingApproval) {
                execution = {
                    ...execution,
                    status: "waiting_approval",
                    steps: execution.steps.map((step) => step.id ===
                        currentStep.id
                        ? {
                            ...step,
                            status: "waiting",
                            output: stepResult.output,
                        }
                        : step),
                    updatedAt: new Date().toISOString(),
                };
                await this.saveExecution(execution);
                return execution;
            }
            if (!stepResult.success) {
                const attempts = currentStep.attempts + 1;
                if (attempts <=
                    definitionStep.retryLimit) {
                    execution = {
                        ...execution,
                        steps: execution.steps.map((step) => step.id ===
                            currentStep.id
                            ? {
                                ...step,
                                status: "pending",
                                attempts,
                                errorMessage: stepResult.errorMessage,
                            }
                            : step),
                        updatedAt: new Date().toISOString(),
                    };
                    await this.saveExecution(execution);
                    index -= 1;
                    continue;
                }
                if (definitionStep.continueOnFailure) {
                    execution = {
                        ...execution,
                        steps: execution.steps.map((step) => step.id ===
                            currentStep.id
                            ? {
                                ...step,
                                status: "failed",
                                attempts,
                                completedAt: new Date().toISOString(),
                                errorMessage: stepResult.errorMessage,
                            }
                            : step),
                        updatedAt: new Date().toISOString(),
                    };
                    await this.saveExecution(execution);
                    continue;
                }
                execution = {
                    ...execution,
                    status: "failed",
                    completedAt: new Date().toISOString(),
                    errorMessage: stepResult.errorMessage,
                    steps: execution.steps.map((step) => step.id ===
                        currentStep.id
                        ? {
                            ...step,
                            status: "failed",
                            attempts,
                            completedAt: new Date().toISOString(),
                            errorMessage: stepResult.errorMessage,
                        }
                        : step),
                    updatedAt: new Date().toISOString(),
                };
                await this.saveExecution(execution);
                await this.events.publish({
                    eventType: "workflow.execution.failed",
                    source: "WorkflowExecutionService",
                    severity: "high",
                    entityType: "workflow_execution",
                    entityId: execution.id,
                    payload: {
                        executionCode: execution.executionCode,
                        errorMessage: execution.errorMessage,
                    },
                });
                return execution;
            }
            execution = {
                ...execution,
                steps: execution.steps.map((step) => step.id ===
                    currentStep.id
                    ? {
                        ...step,
                        status: "completed",
                        completedAt: new Date().toISOString(),
                        output: stepResult.output,
                    }
                    : step),
                context: {
                    ...execution.context,
                    [`step_${definitionStep.order}`]: stepResult.output ?? {},
                },
                updatedAt: new Date().toISOString(),
            };
            await this.saveExecution(execution);
        }
        execution = {
            ...execution,
            status: "completed",
            currentStepId: undefined,
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        await this.saveExecution(execution);
        await this.events.publish({
            eventType: "workflow.execution.completed",
            source: "WorkflowExecutionService",
            severity: "low",
            entityType: "workflow_execution",
            entityId: execution.id,
            payload: {
                executionCode: execution.executionCode,
                workflowCode: execution.workflowCode,
            },
        });
        return execution;
    }
    async getExecution(id) {
        const execution = await this.storage.findById(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.workflowExecutions, id);
        if (!execution) {
            throw new common_1.NotFoundException(`Workflow execution ${id} was not found`);
        }
        return execution;
    }
    async listExecutions() {
        const executions = await this.storage.readCollection(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.workflowExecutions);
        return executions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    async executeStep(step, context) {
        try {
            switch (step.stepType) {
                case "approval":
                    return {
                        success: true,
                        waitingApproval: true,
                        output: {
                            approvalRequired: true,
                            handler: step.handler,
                            configuration: step.configuration,
                        },
                    };
                case "condition": {
                    const field = String(step.configuration.field ??
                        "");
                    const expected = step.configuration.expected;
                    const observed = context[field];
                    const matched = JSON.stringify(observed) ===
                        JSON.stringify(expected);
                    return {
                        success: matched ||
                            step.continueOnFailure,
                        output: {
                            field,
                            expected,
                            observed,
                            matched,
                        },
                        errorMessage: matched
                            ? undefined
                            : `Condition failed for ${field}`,
                    };
                }
                case "delay":
                    return {
                        success: true,
                        output: {
                            delayed: true,
                            durationSeconds: Number(step.configuration
                                .durationSeconds ??
                                0),
                        },
                    };
                case "notification":
                    return {
                        success: true,
                        output: {
                            notificationQueued: true,
                            channel: step.configuration
                                .channel ??
                                "internal",
                            recipient: step.configuration
                                .recipient ??
                                "operations",
                        },
                    };
                case "evidence":
                    return {
                        success: true,
                        output: {
                            evidenceRequested: true,
                            evidenceType: step.configuration
                                .evidenceType ??
                                "workflow-evidence",
                        },
                    };
                case "remediation":
                    return {
                        success: true,
                        output: {
                            remediationTriggered: true,
                            handler: step.handler,
                            configuration: step.configuration,
                        },
                    };
                case "action":
                default:
                    return {
                        success: true,
                        output: {
                            executed: true,
                            handler: step.handler,
                            configuration: step.configuration,
                        },
                    };
            }
        }
        catch (error) {
            return {
                success: false,
                errorMessage: error instanceof Error
                    ? error.message
                    : "Unknown workflow step error",
            };
        }
    }
    async saveExecution(execution) {
        await this.storage.replaceById(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.workflowExecutions, execution.id, execution);
    }
};
exports.WorkflowExecutionService = WorkflowExecutionService;
exports.WorkflowExecutionService = WorkflowExecutionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mega_pack_6_storage_service_1.MegaPack6StorageService,
        enterprise_sequence_service_1.EnterpriseSequenceService,
        platform_event_bus_service_1.PlatformEventBusService])
], WorkflowExecutionService);
//# sourceMappingURL=workflow-execution.service.js.map