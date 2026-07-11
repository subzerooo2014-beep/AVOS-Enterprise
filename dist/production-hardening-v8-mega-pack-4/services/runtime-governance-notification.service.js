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
exports.RuntimeGovernanceNotificationService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const runtime_governance_timeline_service_1 = require("./runtime-governance-timeline.service");
let RuntimeGovernanceNotificationService = class RuntimeGovernanceNotificationService {
    constructor(store, timeline) {
        this.store = store;
        this.timeline = timeline;
    }
    create(dto) {
        if (dto.deduplicationKey) {
            const duplicate = this.store
                .listGovernanceNotifications()
                .find((item) => item.deduplicationKey ===
                dto.deduplicationKey &&
                ![
                    contracts_1.GovernanceNotificationStatus.FAILED,
                    contracts_1.GovernanceNotificationStatus.CANCELLED,
                    contracts_1.GovernanceNotificationStatus.SUPPRESSED,
                ].includes(item.status));
            if (duplicate) {
                throw new common_1.BadRequestException(`Active notification already exists for deduplication key ${dto.deduplicationKey}`);
            }
        }
        const notification = {
            id: (0, crypto_1.randomUUID)(),
            notificationNumber: this.nextNotificationNumber(),
            status: contracts_1.GovernanceNotificationStatus.PENDING,
            channel: dto.channel,
            subject: dto.subject,
            message: dto.message,
            recipients: dto.recipients,
            escalationId: dto.escalationId,
            governanceRequestId: dto.governanceRequestId,
            decisionRecordId: dto.decisionRecordId,
            changeExecutionId: dto.changeExecutionId,
            scheduleRunId: dto.scheduleRunId,
            priority: dto.priority,
            deduplicationKey: dto.deduplicationKey,
            payload: (dto.payload ?? {}),
            metadata: (dto.metadata ?? {}),
            createdBy: dto.actor,
            createdAt: new Date().toISOString(),
        };
        return this.store
            .saveGovernanceNotification(notification);
    }
    send(id, actor) {
        const notification = this.get(id);
        if (![
            contracts_1.GovernanceNotificationStatus.PENDING,
            contracts_1.GovernanceNotificationStatus.QUEUED,
            contracts_1.GovernanceNotificationStatus.FAILED,
        ].includes(notification.status)) {
            throw new common_1.BadRequestException(`Notification cannot be sent from status ${notification.status}`);
        }
        notification.status =
            contracts_1.GovernanceNotificationStatus.SENT;
        notification.queuedAt =
            notification.queuedAt ??
                new Date().toISOString();
        notification.sentAt =
            new Date().toISOString();
        notification.error =
            undefined;
        const saved = this.store
            .saveGovernanceNotification(notification);
        this.timeline.append({
            aggregateType: "governance_notification",
            aggregateId: saved.id,
            type: contracts_1.GovernanceTimelineEventType.NOTIFICATION_SENT,
            title: `Notification sent: ${saved.subject}`,
            description: saved.message,
            relatedResourceIds: [
                saved.escalationId,
                saved.governanceRequestId,
                saved.decisionRecordId,
                saved.changeExecutionId,
            ].filter((value) => Boolean(value)),
            payload: {
                notificationId: saved.id,
                channel: saved.channel,
                recipients: saved.recipients.length,
                priority: saved.priority,
            },
            metadata: {},
            actor,
        });
        return saved;
    }
    markDelivered(id) {
        const notification = this.get(id);
        if (notification.status !==
            contracts_1.GovernanceNotificationStatus.SENT) {
            throw new common_1.BadRequestException("Only sent notifications can be marked delivered");
        }
        notification.status =
            contracts_1.GovernanceNotificationStatus.DELIVERED;
        notification.deliveredAt =
            new Date().toISOString();
        return this.store
            .saveGovernanceNotification(notification);
    }
    markFailed(id, error) {
        const notification = this.get(id);
        notification.status =
            contracts_1.GovernanceNotificationStatus.FAILED;
        notification.failedAt =
            new Date().toISOString();
        notification.error =
            error;
        return this.store
            .saveGovernanceNotification(notification);
    }
    list() {
        return this.store
            .listGovernanceNotifications();
    }
    get(id) {
        const notification = this.store
            .getGovernanceNotification(id);
        if (!notification) {
            throw new common_1.NotFoundException(`Governance notification ${id} was not found`);
        }
        return notification;
    }
    nextNotificationNumber() {
        const next = this.store
            .listGovernanceNotifications()
            .length + 1;
        return `AVOS-NOTIFY-${String(next).padStart(6, "0")}`;
    }
};
exports.RuntimeGovernanceNotificationService = RuntimeGovernanceNotificationService;
exports.RuntimeGovernanceNotificationService = RuntimeGovernanceNotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore,
        runtime_governance_timeline_service_1.RuntimeGovernanceTimelineService])
], RuntimeGovernanceNotificationService);
//# sourceMappingURL=runtime-governance-notification.service.js.map