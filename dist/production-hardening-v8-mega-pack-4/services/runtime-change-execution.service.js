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
exports.RuntimeChangeExecutionService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const runtime_autonomous_recovery_service_1 = require("./runtime-autonomous-recovery.service");
const runtime_decision_center_service_1 = require("./runtime-decision-center.service");
const runtime_execution_evidence_service_1 = require("./runtime-execution-evidence.service");
const runtime_execution_lock_service_1 = require("./runtime-execution-lock.service");
const runtime_governance_request_service_1 = require("./runtime-governance-request.service");
const runtime_runbook_service_1 = require("./runtime-runbook.service");
let RuntimeChangeExecutionService = class RuntimeChangeExecutionService {
    constructor(store, requests, decisions, locks, runbooks, recovery, evidence) {
        this.store = store;
        this.requests = requests;
        this.decisions = decisions;
        this.locks = locks;
        this.runbooks = runbooks;
        this.recovery = recovery;
        this.evidence = evidence;
    }
    create(dto) {
        const request = this.requests.get(dto.governanceRequestId);
        if (dto.decisionRecordId) {
            this.decisions.get(dto.decisionRecordId);
        }
        if (dto.recoveryPlanId) {
            this.recovery.get(dto.recoveryPlanId);
        }
        if (dto.isolationPlanId &&
            !this.store.getIsolationPlan(dto.isolationPlanId)) {
            throw new common_1.NotFoundException(`Isolation plan ${dto.isolationPlanId} was not found`);
        }
        const now = new Date().toISOString();
        const execution = {
            id: (0, crypto_1.randomUUID)(),
            executionNumber: this.nextExecutionNumber(),
            governanceRequestId: request.id,
            decisionRecordId: dto.decisionRecordId,
            recoveryPlanId: dto.recoveryPlanId,
            isolationPlanId: dto.isolationPlanId,
            status: contracts_1.RuntimeChangeExecutionStatus.CREATED,
            environment: request.environment,
            namespace: request.namespace,
            service: request.service,
            requestType: request.type,
            riskLevel: request.evaluatedRiskLevel ??
                request.requestedRiskLevel,
            dryRun: dto.dryRun ?? true,
            validations: [],
            lockIds: [],
            evidenceIds: [],
            metadata: (dto.metadata ?? {}),
            requestedBy: dto.actor,
            createdAt: now,
            updatedAt: now,
        };
        const saved = this.store
            .saveChangeExecution(execution);
        const evidence = this.evidence.append({
            changeExecutionId: saved.id,
            type: contracts_1.RuntimeExecutionEvidenceType
                .EXECUTION_CREATED,
            actor: dto.actor,
            payload: {
                executionId: saved.id,
                executionNumber: saved.executionNumber,
                governanceRequestId: saved.governanceRequestId,
                dryRun: saved.dryRun,
            },
        });
        saved.evidenceIds.push(evidence.id);
        return this.store
            .saveChangeExecution(saved);
    }
    list() {
        return this.store
            .listChangeExecutions();
    }
    get(id) {
        const execution = this.store
            .getChangeExecution(id);
        if (!execution) {
            throw new common_1.NotFoundException(`Runtime change execution ${id} was not found`);
        }
        return execution;
    }
    validate(id, actor) {
        const execution = this.get(id);
        execution.status =
            contracts_1.RuntimeChangeExecutionStatus.VALIDATING;
        execution.validations =
            this.buildValidations(execution);
        const blockingFailures = execution.validations
            .filter((item) => !item.success &&
            item.blocking);
        execution.status =
            blockingFailures.length > 0
                ? contracts_1.RuntimeChangeExecutionStatus.BLOCKED
                : contracts_1.RuntimeChangeExecutionStatus.READY;
        execution.updatedAt =
            new Date().toISOString();
        const saved = this.store
            .saveChangeExecution(execution);
        const evidence = this.evidence.append({
            changeExecutionId: saved.id,
            type: contracts_1.RuntimeExecutionEvidenceType
                .VALIDATION_COMPLETED,
            actor,
            payload: {
                executionId: saved.id,
                status: saved.status,
                validations: saved.validations.length,
                blockingFailures: blockingFailures.length,
            },
        });
        saved.evidenceIds.push(evidence.id);
        return this.store
            .saveChangeExecution(saved);
    }
    async execute(id, dto) {
        let execution = this.get(id);
        if (execution.status ===
            contracts_1.RuntimeChangeExecutionStatus.CREATED) {
            execution =
                this.validate(id, dto.actor);
        }
        if (execution.status !==
            contracts_1.RuntimeChangeExecutionStatus.READY) {
            throw new common_1.BadRequestException(`Change execution is not ready. Current status: ${execution.status}`);
        }
        const lock = this.locks.acquire({
            key: `change:${execution.environment}:${execution.namespace}:${execution.service ?? "global"}`,
            type: execution.service
                ? contracts_1.RuntimeLockType.SERVICE
                : contracts_1.RuntimeLockType.NAMESPACE,
            environment: execution.environment,
            namespace: execution.namespace,
            service: execution.service,
            changeExecutionId: execution.id,
            ttlSeconds: 3600,
            metadata: {
                executionNumber: execution.executionNumber,
            },
            actor: dto.actor,
        });
        execution.lockIds.push(lock.id);
        execution.status =
            contracts_1.RuntimeChangeExecutionStatus.EXECUTING;
        execution.startedAt =
            new Date().toISOString();
        execution.updatedAt =
            execution.startedAt;
        execution =
            this.store
                .saveChangeExecution(execution);
        try {
            const runbook = this.selectRunbook(execution);
            if (runbook) {
                const runbookExecution = await this.runbooks.execute(runbook.id, {
                    governanceRequestId: execution.governanceRequestId,
                    decisionRecordId: execution.decisionRecordId,
                    changeExecutionId: execution.id,
                    dryRun: execution.dryRun,
                    runtimeContext: dto.runtimeContext ?? {},
                    actor: dto.actor,
                });
                execution.runbookExecutionId =
                    runbookExecution.id;
                if (runbookExecution.status !==
                    "succeeded") {
                    throw new Error(runbookExecution.error ??
                        "Runbook execution failed");
                }
            }
            execution.status =
                contracts_1.RuntimeChangeExecutionStatus.SUCCEEDED;
            execution.completedAt =
                new Date().toISOString();
            execution.updatedAt =
                execution.completedAt;
            const saved = this.store
                .saveChangeExecution(execution);
            this.locks.release(lock.id, {
                reason: "Change execution completed",
                actor: dto.actor,
            });
            const evidence = this.evidence.append({
                changeExecutionId: saved.id,
                runbookExecutionId: saved.runbookExecutionId,
                type: contracts_1.RuntimeExecutionEvidenceType
                    .EXECUTION_SUCCEEDED,
                actor: dto.actor,
                payload: {
                    executionId: saved.id,
                    status: saved.status,
                    completedAt: saved.completedAt ??
                        null,
                },
            });
            saved.evidenceIds.push(evidence.id);
            return this.store
                .saveChangeExecution(saved);
        }
        catch (error) {
            execution.status =
                contracts_1.RuntimeChangeExecutionStatus.FAILED;
            execution.failedAt =
                new Date().toISOString();
            execution.updatedAt =
                execution.failedAt;
            execution.error =
                error instanceof Error
                    ? error.message
                    : "Unknown change execution failure";
            const failed = this.store
                .saveChangeExecution(execution);
            this.locks.forceRelease(lock.id, {
                reason: "Change execution failed",
                actor: dto.actor,
            });
            const evidence = this.evidence.append({
                changeExecutionId: failed.id,
                runbookExecutionId: failed.runbookExecutionId,
                type: contracts_1.RuntimeExecutionEvidenceType
                    .EXECUTION_FAILED,
                actor: dto.actor,
                payload: {
                    executionId: failed.id,
                    status: failed.status,
                    error: failed.error ?? null,
                },
            });
            failed.evidenceIds.push(evidence.id);
            return this.store
                .saveChangeExecution(failed);
        }
    }
    buildValidations(execution) {
        const request = this.requests.get(execution.governanceRequestId);
        const validations = [];
        validations.push(this.validation("request_status", "Governance request approved", [
            contracts_1.GovernanceRequestStatus.APPROVED,
            contracts_1.GovernanceRequestStatus.EXECUTED,
        ].includes(request.status), true, "approved", request.status, "Governance request must be approved"));
        if (execution.decisionRecordId) {
            const decision = this.decisions.get(execution.decisionRecordId);
            validations.push(this.validation("decision_status", "Runtime decision accepted", [
                contracts_1.RuntimeDecisionRecordStatus.ACCEPTED,
                contracts_1.RuntimeDecisionRecordStatus.EXECUTED,
            ].includes(decision.status), true, "accepted", decision.status, "Runtime decision must be accepted"));
            validations.push(this.validation("decision_not_blocked", "Runtime decision does not block execution", decision.decision !==
                contracts_1.GovernanceDecision.BLOCK, true, "not_block", decision.decision, "Runtime decision must not be block"));
        }
        validations.push(this.validation("rollback_plan", "Rollback plan available", request.rollbackPlanAvailable ||
            Boolean(execution.recoveryPlanId), execution.riskLevel ===
            "high" ||
            execution.riskLevel ===
                "critical", true, request.rollbackPlanAvailable ||
            Boolean(execution.recoveryPlanId), "High-risk changes require rollback capability"));
        return validations;
    }
    validation(key, name, success, blocking, expected, actual, reason) {
        return {
            id: (0, crypto_1.randomUUID)(),
            key,
            name,
            success,
            blocking,
            expected,
            actual,
            reason,
            checkedAt: new Date().toISOString(),
        };
    }
    selectRunbook(execution) {
        const runbooks = this.runbooks
            .list()
            .filter((runbook) => runbook.status ===
            "active" &&
            (!runbook.environment ||
                runbook.environment ===
                    execution.environment) &&
            (!runbook.namespace ||
                runbook.namespace ===
                    execution.namespace) &&
            (!runbook.service ||
                runbook.service ===
                    execution.service) &&
            (runbook.requestTypes
                .length === 0 ||
                runbook.requestTypes
                    .includes(execution.requestType)))
            .sort((a, b) => b.version - a.version);
        return runbooks[0];
    }
    nextExecutionNumber() {
        const next = this.store
            .listChangeExecutions()
            .length + 1;
        return `AVOS-EXEC-${String(next).padStart(6, "0")}`;
    }
};
exports.RuntimeChangeExecutionService = RuntimeChangeExecutionService;
exports.RuntimeChangeExecutionService = RuntimeChangeExecutionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore,
        runtime_governance_request_service_1.RuntimeGovernanceRequestService,
        runtime_decision_center_service_1.RuntimeDecisionCenterService,
        runtime_execution_lock_service_1.RuntimeExecutionLockService,
        runtime_runbook_service_1.RuntimeRunbookService,
        runtime_autonomous_recovery_service_1.RuntimeAutonomousRecoveryService,
        runtime_execution_evidence_service_1.RuntimeExecutionEvidenceService])
], RuntimeChangeExecutionService);
//# sourceMappingURL=runtime-change-execution.service.js.map