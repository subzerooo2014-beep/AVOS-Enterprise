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
exports.ResilienceActionService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const runtime_resilience_enums_1 = require("../contracts/runtime-resilience.enums");
const resilience_action_executor_registry_1 = require("../executors/resilience-action-executor.registry");
const runtime_resilience_store_1 = require("../stores/runtime-resilience.store");
const runtime_evidence_chain_service_1 = require("./runtime-evidence-chain.service");
const runtime_incident_service_1 = require("./runtime-incident.service");
let ResilienceActionService = class ResilienceActionService {
    constructor(store, evidence, executors, incidents) {
        this.store = store;
        this.evidence = evidence;
        this.executors = executors;
        this.incidents = incidents;
    }
    create(dto) {
        if (dto.incidentId) {
            this.incidents.get(dto.incidentId);
        }
        if (dto.configurationId &&
            !this.store.getConfiguration(dto.configurationId)) {
            throw new common_1.NotFoundException(`Configuration ${dto.configurationId} was not found`);
        }
        const idempotencyKey = dto.idempotencyKey ??
            `${dto.type}:${dto.target}:${dto.incidentId ?? "none"}`;
        const duplicate = this.store
            .listActions()
            .find((action) => action.idempotencyKey === idempotencyKey &&
            ![
                runtime_resilience_enums_1.ResilienceActionStatus.FAILED,
                runtime_resilience_enums_1.ResilienceActionStatus.CANCELLED,
                runtime_resilience_enums_1.ResilienceActionStatus.ROLLED_BACK,
            ].includes(action.status));
        if (duplicate) {
            throw new common_1.ConflictException(`Active action already exists for idempotency key ${idempotencyKey}`);
        }
        const now = new Date().toISOString();
        const requiresApproval = dto.requiresApproval ?? true;
        const action = {
            id: (0, crypto_1.randomUUID)(),
            incidentId: dto.incidentId,
            configurationId: dto.configurationId,
            type: dto.type,
            status: requiresApproval
                ? runtime_resilience_enums_1.ResilienceActionStatus.PENDING_APPROVAL
                : runtime_resilience_enums_1.ResilienceActionStatus.PLANNED,
            name: dto.name,
            description: dto.description,
            target: dto.target,
            parameters: dto.parameters,
            requiresApproval,
            requestedBy: dto.actor,
            requestedAt: now,
            executions: [],
            idempotencyKey,
            dryRun: dto.dryRun ?? true,
        };
        const saved = this.store.saveAction(action);
        if (saved.incidentId) {
            this.incidents.attachAction(saved.incidentId, saved.id);
        }
        this.evidence.append({
            type: runtime_resilience_enums_1.EvidenceEntryType.ACTION_CREATED,
            aggregateType: "resilience_action",
            aggregateId: saved.id,
            actor: dto.actor,
            payload: {
                actionId: saved.id,
                incidentId: saved.incidentId ?? null,
                configurationId: saved.configurationId ?? null,
                type: saved.type,
                status: saved.status,
                target: saved.target,
                requiresApproval: saved.requiresApproval,
                idempotencyKey: saved.idempotencyKey,
                dryRun: saved.dryRun,
            },
        });
        return saved;
    }
    list() {
        return this.store.listActions();
    }
    get(id) {
        const action = this.store.getAction(id);
        if (!action) {
            throw new common_1.NotFoundException(`Resilience action ${id} was not found`);
        }
        return action;
    }
    approve(id, dto) {
        const action = this.get(id);
        if (action.status !==
            runtime_resilience_enums_1.ResilienceActionStatus.PENDING_APPROVAL) {
            throw new common_1.BadRequestException(`Action is not pending approval. Current status: ${action.status}`);
        }
        if (dto.approved === false) {
            action.status = runtime_resilience_enums_1.ResilienceActionStatus.CANCELLED;
            action.completedAt = new Date().toISOString();
            return this.store.saveAction(action);
        }
        action.status = runtime_resilience_enums_1.ResilienceActionStatus.APPROVED;
        action.approvedBy = dto.actor;
        action.approvedAt = new Date().toISOString();
        return this.store.saveAction(action);
    }
    async execute(id, dto) {
        let action = this.get(id);
        if (this.store.getControlMode() ===
            runtime_resilience_enums_1.RuntimeControlMode.OBSERVE &&
            !action.dryRun) {
            throw new common_1.BadRequestException("Non-dry-run actions are blocked in observe mode");
        }
        if (action.requiresApproval &&
            action.status ===
                runtime_resilience_enums_1.ResilienceActionStatus.PENDING_APPROVAL) {
            if (dto.approved !== true) {
                throw new common_1.BadRequestException("Action requires explicit approval");
            }
            action = this.approve(id, dto);
        }
        if (![
            runtime_resilience_enums_1.ResilienceActionStatus.PLANNED,
            runtime_resilience_enums_1.ResilienceActionStatus.APPROVED,
            runtime_resilience_enums_1.ResilienceActionStatus.FAILED,
        ].includes(action.status)) {
            throw new common_1.BadRequestException(`Action cannot be executed from status ${action.status}`);
        }
        const startedAt = new Date().toISOString();
        action.status = runtime_resilience_enums_1.ResilienceActionStatus.RUNNING;
        action.startedAt = startedAt;
        action.error = undefined;
        this.store.saveAction(action);
        const execution = {
            id: (0, crypto_1.randomUUID)(),
            actionId: action.id,
            attempt: action.executions.length + 1,
            startedAt,
            succeeded: false,
        };
        try {
            const executor = this.executors.resolve(action.type);
            const result = await executor.execute({
                action,
                runtimeContext: (dto.runtimeContext ?? {}),
            });
            execution.completedAt = new Date().toISOString();
            execution.succeeded = result.succeeded;
            execution.output = result.output;
            execution.error = result.error;
            action.executions.push(execution);
            action.completedAt = execution.completedAt;
            action.status = result.succeeded
                ? runtime_resilience_enums_1.ResilienceActionStatus.SUCCEEDED
                : runtime_resilience_enums_1.ResilienceActionStatus.FAILED;
            action.error = result.error;
            const saved = this.store.saveAction(action);
            const evidenceEntry = this.evidence.append({
                type: result.succeeded
                    ? runtime_resilience_enums_1.EvidenceEntryType.ACTION_EXECUTED
                    : runtime_resilience_enums_1.EvidenceEntryType.ACTION_FAILED,
                aggregateType: "resilience_action",
                aggregateId: saved.id,
                actor: dto.actor,
                payload: {
                    actionId: saved.id,
                    executionId: execution.id,
                    attempt: execution.attempt,
                    type: saved.type,
                    status: saved.status,
                    target: saved.target,
                    dryRun: saved.dryRun,
                    output: result.output,
                    error: result.error ?? null,
                },
            });
            execution.evidenceEntryId = evidenceEntry.id;
            saved.executions[saved.executions.length - 1] = execution;
            return this.store.saveAction(saved);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Unknown resilience action failure";
            execution.completedAt = new Date().toISOString();
            execution.succeeded = false;
            execution.error = message;
            action.executions.push(execution);
            action.completedAt = execution.completedAt;
            action.status = runtime_resilience_enums_1.ResilienceActionStatus.FAILED;
            action.error = message;
            const failed = this.store.saveAction(action);
            this.evidence.append({
                type: runtime_resilience_enums_1.EvidenceEntryType.ACTION_FAILED,
                aggregateType: "resilience_action",
                aggregateId: failed.id,
                actor: dto.actor,
                payload: {
                    actionId: failed.id,
                    executionId: execution.id,
                    attempt: execution.attempt,
                    type: failed.type,
                    status: failed.status,
                    target: failed.target,
                    dryRun: failed.dryRun,
                    error: message,
                },
            });
            return failed;
        }
    }
    cancel(id, dto) {
        const action = this.get(id);
        if ([
            runtime_resilience_enums_1.ResilienceActionStatus.SUCCEEDED,
            runtime_resilience_enums_1.ResilienceActionStatus.CANCELLED,
            runtime_resilience_enums_1.ResilienceActionStatus.ROLLED_BACK,
        ].includes(action.status)) {
            throw new common_1.BadRequestException(`Action cannot be cancelled from status ${action.status}`);
        }
        action.status = runtime_resilience_enums_1.ResilienceActionStatus.CANCELLED;
        action.completedAt = new Date().toISOString();
        return this.store.saveAction(action);
    }
};
exports.ResilienceActionService = ResilienceActionService;
exports.ResilienceActionService = ResilienceActionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_resilience_store_1.RuntimeResilienceStore,
        runtime_evidence_chain_service_1.RuntimeEvidenceChainService,
        resilience_action_executor_registry_1.ResilienceActionExecutorRegistry,
        runtime_incident_service_1.RuntimeIncidentService])
], ResilienceActionService);
//# sourceMappingURL=resilience-action.service.js.map