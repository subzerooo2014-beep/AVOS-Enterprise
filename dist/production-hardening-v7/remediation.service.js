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
exports.RemediationService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const assurance_storage_service_1 = require("./assurance-storage.service");
let RemediationService = class RemediationService {
    constructor(storage) {
        this.storage = storage;
        this.collection = "remediation-plans";
    }
    async create(dto) {
        const now = new Date().toISOString();
        const plan = {
            id: (0, node_crypto_1.randomUUID)(),
            sourceType: dto.sourceType,
            sourceId: dto.sourceId,
            title: dto.title,
            description: dto.description,
            severity: dto.severity,
            status: "open",
            owner: dto.owner,
            priority: dto.priority,
            dueAt: dto.dueAt,
            actions: (dto.actions ?? []).map((description) => ({
                id: (0, node_crypto_1.randomUUID)(),
                description,
                completed: false,
            })),
            createdAt: now,
            updatedAt: now,
        };
        return this.storage.append(this.collection, plan);
    }
    async list(status) {
        const plans = await this.storage.readCollection(this.collection);
        return plans
            .filter((plan) => !status || plan.status === status)
            .sort((a, b) => a.priority - b.priority ||
            b.createdAt.localeCompare(a.createdAt));
    }
    async updateStatus(id, status) {
        const plan = await this.storage.findById(this.collection, id);
        if (!plan) {
            throw new common_1.NotFoundException(`Remediation plan ${id} was not found`);
        }
        const updated = {
            ...plan,
            status,
            updatedAt: new Date().toISOString(),
        };
        await this.storage.replaceById(this.collection, id, updated);
        return updated;
    }
    async completeAction(planId, actionId) {
        const plan = await this.storage.findById(this.collection, planId);
        if (!plan) {
            throw new common_1.NotFoundException(`Remediation plan ${planId} was not found`);
        }
        const action = plan.actions.find((item) => item.id === actionId);
        if (!action) {
            throw new common_1.NotFoundException(`Remediation action ${actionId} was not found`);
        }
        const now = new Date().toISOString();
        const actions = plan.actions.map((item) => item.id === actionId
            ? {
                ...item,
                completed: true,
                completedAt: now,
            }
            : item);
        const allCompleted = actions.length > 0 &&
            actions.every((item) => item.completed);
        const updated = {
            ...plan,
            actions,
            status: allCompleted
                ? "completed"
                : plan.status === "open"
                    ? "in_progress"
                    : plan.status,
            updatedAt: now,
        };
        await this.storage.replaceById(this.collection, planId, updated);
        return updated;
    }
    async summary() {
        const plans = await this.list();
        return {
            total: plans.length,
            open: plans.filter((plan) => plan.status === "open").length,
            inProgress: plans.filter((plan) => plan.status === "in_progress").length,
            blocked: plans.filter((plan) => plan.status === "blocked").length,
            completed: plans.filter((plan) => plan.status === "completed").length,
            criticalOpen: plans.filter((plan) => plan.status !== "completed" &&
                plan.status !== "cancelled" &&
                plan.severity === "critical").length,
        };
    }
};
exports.RemediationService = RemediationService;
exports.RemediationService = RemediationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [assurance_storage_service_1.AssuranceStorageService])
], RemediationService);
//# sourceMappingURL=remediation.service.js.map