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
exports.RiskTreatmentService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const mega_pack_6_constants_1 = require("./constants/mega-pack-6.constants");
const approval_workflow_service_1 = require("./approval-workflow.service");
const enterprise_sequence_service_1 = require("./enterprise-sequence.service");
const mega_pack_6_storage_service_1 = require("./mega-pack-6-storage.service");
const platform_event_bus_service_1 = require("./platform-event-bus.service");
let RiskTreatmentService = class RiskTreatmentService {
    constructor(storage, sequence, approvals, events) {
        this.storage = storage;
        this.sequence = sequence;
        this.approvals = approvals;
        this.events = events;
    }
    async create(dto) {
        const now = new Date().toISOString();
        const plan = {
            id: (0, node_crypto_1.randomUUID)(),
            treatmentCode: this.sequence.next(mega_pack_6_constants_1.TREATMENT_CODE_PREFIX),
            riskId: dto.riskId,
            riskCode: dto.riskCode,
            title: dto.title,
            description: dto.description,
            strategy: dto.strategy,
            status: "draft",
            owner: dto.owner,
            targetResidualScore: dto.targetResidualScore,
            tasks: (dto.tasks ?? []).map((task) => ({
                id: (0, node_crypto_1.randomUUID)(),
                title: task.title,
                description: task.description,
                owner: task.owner,
                status: "planned",
                priority: task.priority,
                dueAt: task.dueAt,
                dependencies: task.dependencies ?? [],
            })),
            metadata: dto.metadata ?? {},
            createdAt: now,
            updatedAt: now,
        };
        await this.storage.append(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.riskTreatmentPlans, plan);
        await this.events.publish({
            eventType: "risk.treatment.created",
            source: "RiskTreatmentService",
            severity: "medium",
            entityType: "risk_treatment_plan",
            entityId: plan.id,
            payload: {
                treatmentCode: plan.treatmentCode,
                riskId: plan.riskId,
                strategy: plan.strategy,
            },
        });
        return plan;
    }
    async list(status) {
        const plans = await this.storage.readCollection(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.riskTreatmentPlans);
        return plans
            .filter((plan) => !status ||
            plan.status === status)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    async get(id) {
        const plan = await this.storage.findById(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.riskTreatmentPlans, id);
        if (!plan) {
            throw new common_1.NotFoundException(`Risk treatment plan ${id} was not found`);
        }
        return plan;
    }
    async submitForApproval(id, approvers, minimumApprovals) {
        const plan = await this.get(id);
        if (plan.status !== "draft") {
            throw new common_1.BadRequestException("Only draft treatment plans can be submitted for approval");
        }
        const approval = await this.approvals.create({
            title: `Approve risk treatment ${plan.treatmentCode}`,
            description: plan.description,
            requestType: "risk_treatment",
            requestedBy: plan.owner,
            requiredApprovers: approvers,
            minimumApprovals,
            entityType: "risk_treatment_plan",
            entityId: plan.id,
            metadata: {
                riskId: plan.riskId,
                strategy: plan.strategy,
            },
        });
        const updated = {
            ...plan,
            status: "pending_approval",
            approvalRequestId: approval.id,
            updatedAt: new Date().toISOString(),
        };
        await this.storage.replaceById(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.riskTreatmentPlans, id, updated);
        return updated;
    }
    async synchronizeApproval(id) {
        const plan = await this.get(id);
        if (!plan.approvalRequestId) {
            return plan;
        }
        const approval = await this.approvals.get(plan.approvalRequestId);
        let status = plan.status;
        if (approval.decision === "approved") {
            status = "approved";
        }
        else if (approval.decision === "rejected") {
            status = "rejected";
        }
        else if (approval.decision ===
            "cancelled" ||
            approval.decision === "expired") {
            status = "cancelled";
        }
        if (status === plan.status) {
            return plan;
        }
        const updated = {
            ...plan,
            status,
            updatedAt: new Date().toISOString(),
        };
        await this.storage.replaceById(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.riskTreatmentPlans, id, updated);
        return updated;
    }
    async updateStatus(id, status) {
        const plan = await this.get(id);
        this.validateStatusTransition(plan.status, status);
        const now = new Date().toISOString();
        const updated = {
            ...plan,
            status,
            startedAt: status === "executing"
                ? plan.startedAt ?? now
                : plan.startedAt,
            completedAt: status === "completed"
                ? now
                : plan.completedAt,
            updatedAt: now,
        };
        await this.storage.replaceById(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.riskTreatmentPlans, id, updated);
        await this.events.publish({
            eventType: `risk.treatment.${status}`,
            source: "RiskTreatmentService",
            severity: status === "completed"
                ? "low"
                : "medium",
            entityType: "risk_treatment_plan",
            entityId: id,
            payload: {
                treatmentCode: plan.treatmentCode,
                previousStatus: plan.status,
                currentStatus: status,
            },
        });
        return updated;
    }
    async updateTaskStatus(planId, taskId, status, output) {
        const plan = await this.get(planId);
        const task = plan.tasks.find((item) => item.id === taskId);
        if (!task) {
            throw new common_1.NotFoundException(`Risk treatment task ${taskId} was not found`);
        }
        if (status === "active" &&
            task.dependencies.length > 0) {
            const incomplete = task.dependencies.filter((dependencyId) => {
                const dependency = plan.tasks.find((item) => item.id ===
                    dependencyId);
                return (!dependency ||
                    dependency.status !==
                        "completed");
            });
            if (incomplete.length > 0) {
                throw new common_1.BadRequestException("Task dependencies are not completed");
            }
        }
        const now = new Date().toISOString();
        const tasks = plan.tasks.map((item) => item.id === taskId
            ? {
                ...item,
                status,
                completedAt: status === "completed"
                    ? now
                    : item.completedAt,
                output: output ?? item.output,
            }
            : item);
        const allCompleted = tasks.length > 0 &&
            tasks.every((item) => item.status === "completed");
        const updated = {
            ...plan,
            tasks,
            status: allCompleted
                ? "completed"
                : plan.status === "approved"
                    ? "executing"
                    : plan.status,
            startedAt: plan.startedAt ??
                (status === "active" ||
                    status === "completed"
                    ? now
                    : undefined),
            completedAt: allCompleted
                ? now
                : plan.completedAt,
            updatedAt: now,
        };
        await this.storage.replaceById(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.riskTreatmentPlans, planId, updated);
        return updated;
    }
    async summary() {
        const plans = await this.list();
        return {
            total: plans.length,
            draft: plans.filter((plan) => plan.status === "draft").length,
            pendingApproval: plans.filter((plan) => plan.status ===
                "pending_approval").length,
            approved: plans.filter((plan) => plan.status === "approved").length,
            executing: plans.filter((plan) => plan.status === "executing").length,
            completed: plans.filter((plan) => plan.status === "completed").length,
            rejected: plans.filter((plan) => plan.status === "rejected").length,
        };
    }
    validateStatusTransition(current, target) {
        const transitions = {
            draft: [
                "pending_approval",
                "cancelled",
            ],
            pending_approval: [
                "approved",
                "rejected",
                "cancelled",
            ],
            approved: [
                "executing",
                "cancelled",
            ],
            executing: [
                "completed",
                "cancelled",
            ],
            completed: [],
            rejected: [],
            cancelled: [],
        };
        if (current !== target &&
            !transitions[current].includes(target)) {
            throw new common_1.BadRequestException(`Invalid risk treatment transition from ${current} to ${target}`);
        }
    }
};
exports.RiskTreatmentService = RiskTreatmentService;
exports.RiskTreatmentService = RiskTreatmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mega_pack_6_storage_service_1.MegaPack6StorageService,
        enterprise_sequence_service_1.EnterpriseSequenceService,
        approval_workflow_service_1.ApprovalWorkflowService,
        platform_event_bus_service_1.PlatformEventBusService])
], RiskTreatmentService);
//# sourceMappingURL=risk-treatment.service.js.map