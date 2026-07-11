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
exports.RuntimeGovernanceEscalationService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const runtime_governance_notification_service_1 = require("./runtime-governance-notification.service");
const runtime_governance_timeline_service_1 = require("./runtime-governance-timeline.service");
let RuntimeGovernanceEscalationService = class RuntimeGovernanceEscalationService {
    constructor(store, notifications, timeline) {
        this.store = store;
        this.notifications = notifications;
        this.timeline = timeline;
    }
    create(dto) {
        const now = new Date().toISOString();
        const escalation = {
            id: (0, crypto_1.randomUUID)(),
            escalationNumber: this.nextEscalationNumber(),
            status: contracts_1.GovernanceEscalationStatus.OPEN,
            severity: dto.severity,
            reason: dto.reason,
            title: dto.title,
            description: dto.description,
            environment: dto.environment,
            namespace: dto.namespace,
            service: dto.service,
            governanceRequestId: dto.governanceRequestId,
            decisionRecordId: dto.decisionRecordId,
            changeExecutionId: dto.changeExecutionId,
            runbookExecutionId: dto.runbookExecutionId,
            recoveryPlanId: dto.recoveryPlanId,
            isolationPlanId: dto.isolationPlanId,
            dependencyNodeId: dto.dependencyNodeId,
            sloEvaluationId: dto.sloEvaluationId,
            capacityEvaluationId: dto.capacityEvaluationId,
            assignedRoles: dto.assignedRoles,
            assignedActors: dto.assignedActors ?? [],
            acknowledgementRequired: dto.acknowledgementRequired,
            metadata: (dto.metadata ?? {}),
            createdBy: dto.actor,
            createdAt: now,
            updatedAt: now,
            expiresAt: dto.expiresAt,
        };
        const saved = this.store
            .saveGovernanceEscalation(escalation);
        this.timeline.append({
            aggregateType: "governance_escalation",
            aggregateId: saved.id,
            type: contracts_1.GovernanceTimelineEventType.ESCALATION_CREATED,
            title: saved.title,
            description: saved.description,
            relatedResourceIds: [
                saved.governanceRequestId,
                saved.decisionRecordId,
                saved.changeExecutionId,
                saved.runbookExecutionId,
                saved.recoveryPlanId,
            ].filter((value) => Boolean(value)),
            payload: {
                escalationId: saved.id,
                severity: saved.severity,
                reason: saved.reason,
                status: saved.status,
            },
            metadata: {},
            actor: dto.actor,
        });
        return saved;
    }
    createNotification(id, actor) {
        const escalation = this.get(id);
        const recipients = escalation.assignedActors
            .map((assignedActor) => ({
            id: assignedActor.id,
            name: assignedActor.name,
            address: assignedActor.id,
            channel: contracts_1.GovernanceNotificationChannel.INTERNAL,
            roles: assignedActor.roles,
        }));
        if (recipients.length === 0) {
            recipients.push({
                id: "avos-governance-operations",
                name: "AVOS Governance Operations",
                address: "governance-operations",
                channel: contracts_1.GovernanceNotificationChannel.INTERNAL,
                roles: escalation.assignedRoles,
            });
        }
        return this.notifications.create({
            channel: contracts_1.GovernanceNotificationChannel.INTERNAL,
            subject: `[${escalation.severity}] ${escalation.title}`,
            message: escalation.description,
            recipients,
            escalationId: escalation.id,
            governanceRequestId: escalation.governanceRequestId,
            decisionRecordId: escalation.decisionRecordId,
            changeExecutionId: escalation.changeExecutionId,
            priority: this.priorityFromSeverity(escalation.severity),
            deduplicationKey: `escalation:${escalation.id}`,
            payload: {
                escalationNumber: escalation.escalationNumber,
                severity: escalation.severity,
                reason: escalation.reason,
            },
            metadata: {},
            actor,
        });
    }
    update(id, dto) {
        const escalation = this.get(id);
        this.validateTransition(escalation.status, dto.status);
        const now = new Date().toISOString();
        escalation.status =
            dto.status;
        escalation.updatedAt =
            now;
        if (dto.status ===
            contracts_1.GovernanceEscalationStatus.ACKNOWLEDGED) {
            escalation.acknowledgedBy =
                dto.actor;
            escalation.acknowledgedAt =
                now;
        }
        if (dto.status ===
            contracts_1.GovernanceEscalationStatus.RESOLVED) {
            escalation.resolvedAt =
                now;
            escalation.resolution =
                dto.resolution ??
                    dto.reason;
        }
        if (dto.status ===
            contracts_1.GovernanceEscalationStatus.CANCELLED) {
            escalation.cancelledAt =
                now;
        }
        const saved = this.store
            .saveGovernanceEscalation(escalation);
        this.timeline.append({
            aggregateType: "governance_escalation",
            aggregateId: saved.id,
            type: contracts_1.GovernanceTimelineEventType.ESCALATION_UPDATED,
            title: `Escalation updated: ${saved.title}`,
            description: dto.reason,
            relatedResourceIds: [
                saved.governanceRequestId,
                saved.changeExecutionId,
            ].filter((value) => Boolean(value)),
            payload: {
                escalationId: saved.id,
                status: saved.status,
                resolution: saved.resolution ?? null,
            },
            metadata: {},
            actor: dto.actor,
        });
        return saved;
    }
    list() {
        this.expireEscalations();
        return this.store
            .listGovernanceEscalations();
    }
    get(id) {
        const escalation = this.store
            .getGovernanceEscalation(id);
        if (!escalation) {
            throw new common_1.NotFoundException(`Governance escalation ${id} was not found`);
        }
        return escalation;
    }
    expireEscalations() {
        const now = Date.now();
        for (const escalation of this.store
            .listGovernanceEscalations()) {
            if (escalation.expiresAt &&
                ![
                    contracts_1.GovernanceEscalationStatus.RESOLVED,
                    contracts_1.GovernanceEscalationStatus.CANCELLED,
                    contracts_1.GovernanceEscalationStatus.EXPIRED,
                ].includes(escalation.status) &&
                new Date(escalation.expiresAt).getTime() <= now) {
                escalation.status =
                    contracts_1.GovernanceEscalationStatus.EXPIRED;
                escalation.updatedAt =
                    new Date().toISOString();
                this.store
                    .saveGovernanceEscalation(escalation);
            }
        }
    }
    validateTransition(current, next) {
        if (current === next) {
            return;
        }
        const transitions = {
            [contracts_1.GovernanceEscalationStatus.OPEN]: [
                contracts_1.GovernanceEscalationStatus.ACKNOWLEDGED,
                contracts_1.GovernanceEscalationStatus.IN_PROGRESS,
                contracts_1.GovernanceEscalationStatus.RESOLVED,
                contracts_1.GovernanceEscalationStatus.CANCELLED,
                contracts_1.GovernanceEscalationStatus.EXPIRED,
            ],
            [contracts_1.GovernanceEscalationStatus.ACKNOWLEDGED]: [
                contracts_1.GovernanceEscalationStatus.IN_PROGRESS,
                contracts_1.GovernanceEscalationStatus.RESOLVED,
                contracts_1.GovernanceEscalationStatus.CANCELLED,
                contracts_1.GovernanceEscalationStatus.EXPIRED,
            ],
            [contracts_1.GovernanceEscalationStatus.IN_PROGRESS]: [
                contracts_1.GovernanceEscalationStatus.RESOLVED,
                contracts_1.GovernanceEscalationStatus.CANCELLED,
                contracts_1.GovernanceEscalationStatus.EXPIRED,
            ],
            [contracts_1.GovernanceEscalationStatus.RESOLVED]: [],
            [contracts_1.GovernanceEscalationStatus.CANCELLED]: [],
            [contracts_1.GovernanceEscalationStatus.EXPIRED]: [],
        };
        if (!transitions[current].includes(next)) {
            throw new common_1.BadRequestException(`Invalid escalation transition from ${current} to ${next}`);
        }
    }
    nextEscalationNumber() {
        const next = this.store
            .listGovernanceEscalations()
            .length + 1;
        return `AVOS-ESC-${String(next).padStart(6, "0")}`;
    }
    priorityFromSeverity(severity) {
        switch (severity) {
            case "emergency":
                return 100;
            case "critical":
                return 90;
            case "high":
                return 75;
            case "warning":
                return 50;
            default:
                return 25;
        }
    }
};
exports.RuntimeGovernanceEscalationService = RuntimeGovernanceEscalationService;
exports.RuntimeGovernanceEscalationService = RuntimeGovernanceEscalationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore,
        runtime_governance_notification_service_1.RuntimeGovernanceNotificationService,
        runtime_governance_timeline_service_1.RuntimeGovernanceTimelineService])
], RuntimeGovernanceEscalationService);
//# sourceMappingURL=runtime-governance-escalation.service.js.map