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
exports.RuntimeAutonomousRecoveryService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const runtime_governance_audit_service_1 = require("./runtime-governance-audit.service");
let RuntimeAutonomousRecoveryService = class RuntimeAutonomousRecoveryService {
    constructor(store, audit) {
        this.store = store;
        this.audit = audit;
    }
    create(dto) {
        if (dto.sourceNodeId &&
            !this.store.getDependencyNode(dto.sourceNodeId)) {
            throw new common_1.NotFoundException(`Dependency node ${dto.sourceNodeId} was not found`);
        }
        if (dto.cascadeAnalysisId &&
            !this.store.getCascadeAnalysis(dto.cascadeAnalysisId)) {
            throw new common_1.NotFoundException(`Cascade analysis ${dto.cascadeAnalysisId} was not found`);
        }
        if (dto.governanceRequestId &&
            !this.store.getGovernanceRequest(dto.governanceRequestId)) {
            throw new common_1.NotFoundException(`Governance request ${dto.governanceRequestId} was not found`);
        }
        const now = new Date().toISOString();
        const actions = dto.actions
            .map((action) => ({
            id: (0, crypto_1.randomUUID)(),
            planId: "",
            type: action.type,
            status: contracts_1.RecoveryActionStatus.PENDING,
            name: action.name,
            description: action.description,
            target: action.target,
            order: action.order,
            required: action.required,
            timeoutSeconds: action.timeoutSeconds,
            retryLimit: action.retryLimit,
            parameters: action.parameters,
            rollbackActionType: action.rollbackActionType,
            rollbackParameters: action.rollbackParameters,
            executions: [],
        }))
            .sort((a, b) => a.order - b.order);
        const planId = (0, crypto_1.randomUUID)();
        for (const action of actions) {
            action.planId =
                planId;
        }
        const requiresApproval = dto.requiresApproval ??
            (dto.riskLevel === "high" ||
                dto.riskLevel === "critical");
        const plan = {
            id: planId,
            key: dto.key,
            name: dto.name,
            description: dto.description,
            environment: dto.environment,
            namespace: dto.namespace,
            service: dto.service,
            sourceNodeId: dto.sourceNodeId,
            cascadeAnalysisId: dto.cascadeAnalysisId,
            governanceRequestId: dto.governanceRequestId,
            status: requiresApproval
                ? contracts_1.RecoveryPlanStatus.PENDING_APPROVAL
                : contracts_1.RecoveryPlanStatus.READY,
            riskLevel: dto.riskLevel,
            requiresApproval,
            approvalsRequired: dto.approvalsRequired ??
                (dto.riskLevel === "critical"
                    ? 3
                    : dto.riskLevel === "high"
                        ? 2
                        : requiresApproval
                            ? 1
                            : 0),
            approvedBy: [],
            actions,
            metadata: (dto.metadata ?? {}),
            createdBy: dto.actor,
            createdAt: now,
            updatedAt: now,
        };
        const saved = this.store.saveRecoveryPlan(plan);
        this.audit.append({
            type: contracts_1.GovernanceAuditEventType
                .GOVERNANCE_REQUEST_CREATED,
            aggregateType: "autonomous_recovery_plan",
            aggregateId: saved.id,
            actor: dto.actor,
            payload: {
                recoveryPlanId: saved.id,
                key: saved.key,
                status: saved.status,
                riskLevel: saved.riskLevel,
                actions: saved.actions.length,
                requiresApproval: saved.requiresApproval,
                approvalsRequired: saved.approvalsRequired,
            },
        });
        return saved;
    }
    list() {
        return this.store
            .listRecoveryPlans();
    }
    get(id) {
        const plan = this.store.getRecoveryPlan(id);
        if (!plan) {
            throw new common_1.NotFoundException(`Recovery plan ${id} was not found`);
        }
        return plan;
    }
    approve(id, dto) {
        const plan = this.get(id);
        if (plan.status !==
            contracts_1.RecoveryPlanStatus.PENDING_APPROVAL) {
            throw new common_1.BadRequestException(`Recovery plan is not pending approval. Current status: ${plan.status}`);
        }
        if (plan.approvedBy.some((actor) => actor.id === dto.actor.id)) {
            throw new common_1.BadRequestException(`Actor ${dto.actor.id} already approved this recovery plan`);
        }
        plan.approvedBy.push(dto.actor);
        plan.updatedAt =
            new Date().toISOString();
        if (plan.approvedBy.length >=
            plan.approvalsRequired) {
            plan.status =
                contracts_1.RecoveryPlanStatus.APPROVED;
            plan.approvedAt =
                plan.updatedAt;
        }
        return this.store
            .saveRecoveryPlan(plan);
    }
    async execute(id, dto) {
        let plan = this.get(id);
        if (this.store.getControlMode() ===
            contracts_1.GovernanceControlMode.LOCKDOWN) {
            throw new common_1.BadRequestException("Recovery execution is blocked while governance is in lockdown");
        }
        if (![
            contracts_1.RecoveryPlanStatus.READY,
            contracts_1.RecoveryPlanStatus.APPROVED,
            contracts_1.RecoveryPlanStatus.FAILED,
        ].includes(plan.status)) {
            throw new common_1.BadRequestException(`Recovery plan cannot execute from status ${plan.status}`);
        }
        const dryRun = dto.dryRun ?? true;
        plan.status =
            contracts_1.RecoveryPlanStatus.EXECUTING;
        plan.startedAt =
            new Date().toISOString();
        plan.updatedAt =
            plan.startedAt;
        plan =
            this.store.saveRecoveryPlan(plan);
        try {
            for (let index = 0; index < plan.actions.length; index += 1) {
                const action = plan.actions[index];
                action.status =
                    contracts_1.RecoveryActionStatus.RUNNING;
                const execution = {
                    id: (0, crypto_1.randomUUID)(),
                    actionId: action.id,
                    attempt: action.executions.length + 1,
                    status: contracts_1.RecoveryActionStatus.RUNNING,
                    startedAt: new Date().toISOString(),
                    output: {},
                };
                const result = this.executeAction(action, dryRun, dto.runtimeContext ?? {});
                execution.completedAt =
                    new Date().toISOString();
                execution.status =
                    result.succeeded
                        ? contracts_1.RecoveryActionStatus.SUCCEEDED
                        : contracts_1.RecoveryActionStatus.FAILED;
                execution.output =
                    result.output;
                execution.error =
                    result.error;
                action.executions.push(execution);
                action.status =
                    execution.status;
                plan.actions[index] =
                    action;
                this.store.saveRecoveryPlan(plan);
                if (!result.succeeded &&
                    action.required) {
                    throw new Error(result.error ??
                        `Recovery action ${action.name} failed`);
                }
            }
            plan.status =
                contracts_1.RecoveryPlanStatus.SUCCEEDED;
            plan.completedAt =
                new Date().toISOString();
            plan.updatedAt =
                plan.completedAt;
            return this.store
                .saveRecoveryPlan(plan);
        }
        catch (error) {
            plan.status =
                contracts_1.RecoveryPlanStatus.FAILED;
            plan.failedAt =
                new Date().toISOString();
            plan.updatedAt =
                plan.failedAt;
            plan.error =
                error instanceof Error
                    ? error.message
                    : "Unknown recovery execution failure";
            return this.store
                .saveRecoveryPlan(plan);
        }
    }
    rollback(id, actor) {
        const plan = this.get(id);
        if (![
            contracts_1.RecoveryPlanStatus.SUCCEEDED,
            contracts_1.RecoveryPlanStatus.FAILED,
        ].includes(plan.status)) {
            throw new common_1.BadRequestException(`Recovery plan cannot be rolled back from status ${plan.status}`);
        }
        for (const action of plan.actions
            .slice()
            .sort((a, b) => b.order - a.order)) {
            if (action.status ===
                contracts_1.RecoveryActionStatus.SUCCEEDED &&
                action.rollbackActionType) {
                action.status =
                    contracts_1.RecoveryActionStatus.ROLLED_BACK;
            }
        }
        plan.status =
            contracts_1.RecoveryPlanStatus.ROLLED_BACK;
        plan.rolledBackAt =
            new Date().toISOString();
        plan.updatedAt =
            plan.rolledBackAt;
        const saved = this.store.saveRecoveryPlan(plan);
        this.audit.append({
            type: contracts_1.GovernanceAuditEventType
                .GOVERNANCE_REQUEST_EVALUATED,
            aggregateType: "autonomous_recovery_plan",
            aggregateId: saved.id,
            actor,
            payload: {
                recoveryPlanId: saved.id,
                status: saved.status,
                rolledBackAt: saved.rolledBackAt ?? null,
            },
        });
        return saved;
    }
    executeAction(action, dryRun, runtimeContext) {
        if (action.parameters
            .forceFailure === true) {
            return {
                succeeded: false,
                output: {
                    dryRun,
                    actionType: action.type,
                    target: action.target,
                },
                error: "Forced recovery action failure",
            };
        }
        return {
            succeeded: true,
            output: {
                dryRun,
                actionType: action.type,
                target: action.target,
                parameters: action.parameters,
                runtimeContext: runtimeContext,
                executedAt: new Date().toISOString(),
            },
        };
    }
};
exports.RuntimeAutonomousRecoveryService = RuntimeAutonomousRecoveryService;
exports.RuntimeAutonomousRecoveryService = RuntimeAutonomousRecoveryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore,
        runtime_governance_audit_service_1.RuntimeGovernanceAuditService])
], RuntimeAutonomousRecoveryService);
//# sourceMappingURL=runtime-autonomous-recovery.service.js.map