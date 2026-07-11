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
exports.PublisherOperationsService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
const social_delivery_worker_service_1 = require("../social-delivery/social-delivery-worker.service");
let PublisherOperationsService = class PublisherOperationsService {
    constructor(prisma, worker) {
        this.prisma = prisma;
        this.worker = worker;
    }
    async cancel(eventId, reason) {
        const event = await this.event(eventId);
        if ([
            "delivered",
            "cancelled",
        ].includes(event.status)) {
            throw new common_1.ConflictException(`Publication cannot be cancelled from status "${event.status}".`);
        }
        const updated = await this.updateWithOperation({
            event,
            nextStatus: "cancelled",
            operation: "cancel",
            details: {
                reason: reason?.trim() ||
                    "Publication cancelled manually.",
            },
        });
        await this.audit("PUBLICATION_CANCELLED", eventId);
        return {
            success: true,
            operation: "cancel",
            eventId,
            previousStatus: event.status,
            status: updated.status,
            cancelledAt: updated.updatedAt,
        };
    }
    async retry(eventId, reason) {
        const event = await this.event(eventId);
        this.assertRetryable(event);
        const updated = await this.updateWithOperation({
            event,
            nextStatus: "queued",
            operation: "retry",
            details: {
                reason: reason?.trim() ||
                    "Publication queued for manual retry.",
            },
            resetDeliveryError: true,
        });
        await this.audit("PUBLICATION_RETRY_QUEUED", eventId);
        return {
            success: true,
            operation: "retry",
            eventId,
            previousStatus: event.status,
            status: updated.status,
            queuedAt: updated.updatedAt,
        };
    }
    async retryNow(eventId, reason) {
        const queued = await this.retry(eventId, reason ??
            "Publication queued for immediate retry.");
        const dispatch = await this.worker.processById(eventId);
        await this.appendOperation(eventId, "retry_now", {
            dispatchStatus: dispatch?.status ?? null,
            success: dispatch?.success ?? false,
        });
        await this.audit("PUBLICATION_RETRY_EXECUTED", eventId);
        return {
            success: Boolean(dispatch?.success),
            operation: "retry_now",
            queued,
            dispatch,
        };
    }
    async clone(eventId, overrides) {
        const source = await this.event(eventId);
        const now = new Date();
        const sourcePayload = this.objectOf(source.payload);
        const sourceResult = this.objectOf(source.result);
        const sourceVersion = Number(sourcePayload.contentVersion ??
            sourcePayload.version ??
            1);
        const newId = (0, node_crypto_1.randomUUID)();
        const clonedPayload = {
            ...sourcePayload,
            content: overrides?.content ??
                sourcePayload.content ??
                null,
            campaign: {
                ...this.objectOf(sourcePayload.campaign),
                ...this.objectOf(overrides?.campaign),
            },
            metadata: {
                ...this.objectOf(sourcePayload.metadata),
                ...this.objectOf(overrides?.metadata),
                clonedFromEventId: source.id,
                clonedAt: now.toISOString(),
            },
            contentVersion: sourceVersion + 1,
            parentEventId: source.id,
            operation: "clone",
        };
        const created = await this.prisma.platformEvent.create({
            data: {
                id: newId,
                type: source.type,
                source: source.source,
                entityType: source.entityType,
                entityId: source.entityId,
                status: "queued",
                payload: clonedPayload,
                result: {
                    message: "Publication cloned and queued.",
                    clonedFrom: {
                        eventId: source.id,
                        status: source.status,
                        externalId: this.externalId(sourceResult),
                    },
                    operations: [
                        this.operationRecord("clone", {
                            sourceEventId: source.id,
                        }, now),
                    ],
                },
                updatedAt: now,
            },
        });
        await this.audit("PUBLICATION_CLONED", created.id);
        return {
            success: true,
            operation: "clone",
            sourceEventId: source.id,
            eventId: created.id,
            status: created.status,
            contentVersion: clonedPayload.contentVersion,
            createdAt: created.createdAt,
        };
    }
    async replay(eventId, overrides) {
        const cloned = await this.clone(eventId, overrides);
        const dispatch = await this.worker.processById(cloned.eventId);
        await this.appendOperation(cloned.eventId, "replay", {
            sourceEventId: eventId,
            dispatchStatus: dispatch?.status ?? null,
            success: dispatch?.success ?? false,
        });
        await this.audit("PUBLICATION_REPLAYED", cloned.eventId);
        return {
            success: Boolean(dispatch?.success),
            operation: "replay",
            sourceEventId: eventId,
            cloned,
            dispatch,
        };
    }
    async operationHistory(eventId) {
        const event = await this.event(eventId);
        const result = this.objectOf(event.result);
        const operations = Array.isArray(result.operations)
            ? result.operations
            : [];
        return {
            success: true,
            eventId: event.id,
            status: event.status,
            count: operations.length,
            operations,
        };
    }
    async event(eventId) {
        const normalized = String(eventId)
            .trim();
        if (!normalized) {
            throw new common_1.BadRequestException("eventId is required.");
        }
        const event = await this.prisma.platformEvent.findUnique({
            where: {
                id: normalized,
            },
        });
        if (!event) {
            throw new common_1.NotFoundException("PlatformEvent not found.");
        }
        if (!this.supportedEventTypes()
            .includes(event.type)) {
            throw new common_1.BadRequestException(`PlatformEvent type "${event.type}" does not support publication operations.`);
        }
        return event;
    }
    assertRetryable(event) {
        const retryable = [
            "failed",
            "dead",
            "rejected",
            "cancelled",
            "retrying",
            "awaiting_credentials",
        ];
        if (!retryable.includes(event.status)) {
            throw new common_1.ConflictException(`Publication cannot be retried from status "${event.status}".`);
        }
    }
    async updateWithOperation(input) {
        const now = new Date();
        const previousResult = this.objectOf(input.event.result);
        const previousDelivery = this.objectOf(previousResult.delivery);
        const operations = Array.isArray(previousResult.operations)
            ? previousResult.operations
            : [];
        const delivery = input.resetDeliveryError
            ? {
                ...previousDelivery,
                status: input.nextStatus,
                errorCode: null,
                errorMessage: null,
                terminal: false,
                queuedAt: now.toISOString(),
            }
            : {
                ...previousDelivery,
                status: input.nextStatus,
            };
        return this.prisma.platformEvent.update({
            where: {
                id: input.event.id,
            },
            data: {
                status: input.nextStatus,
                result: {
                    ...previousResult,
                    delivery,
                    operations: [
                        ...operations,
                        this.operationRecord(input.operation, input.details, now),
                    ],
                    latestOperation: this.operationRecord(input.operation, input.details, now),
                },
                updatedAt: now,
            },
        });
    }
    async appendOperation(eventId, operation, details) {
        const event = await this.prisma.platformEvent.findUnique({
            where: {
                id: eventId,
            },
        });
        if (!event) {
            return;
        }
        const result = this.objectOf(event.result);
        const operations = Array.isArray(result.operations)
            ? result.operations
            : [];
        const record = this.operationRecord(operation, details, new Date());
        await this.prisma.platformEvent.update({
            where: {
                id: eventId,
            },
            data: {
                result: {
                    ...result,
                    operations: [
                        ...operations,
                        record,
                    ],
                    latestOperation: record,
                },
                updatedAt: new Date(),
            },
        });
    }
    operationRecord(operation, details, at) {
        return {
            operationId: (0, node_crypto_1.randomUUID)(),
            operation,
            details: details ?? {},
            at: at.toISOString(),
            source: "publisher-enterprise-api",
        };
    }
    externalId(result) {
        const delivery = this.objectOf(result.delivery);
        return typeof delivery.externalId ===
            "string"
            ? delivery.externalId
            : null;
    }
    async audit(action, entityId) {
        await this.prisma.auditLog.create({
            data: {
                action,
                entity: "PlatformEvent",
                entityId,
            },
        });
    }
    supportedEventTypes() {
        return [
            "InstagramVehiclePublicationRequested",
            "TikTokVehiclePublicationRequested",
            "GoogleSearchVehicleCampaignRequested",
        ];
    }
    objectOf(value) {
        if (value &&
            typeof value === "object" &&
            !Array.isArray(value)) {
            return value;
        }
        return {};
    }
};
exports.PublisherOperationsService = PublisherOperationsService;
exports.PublisherOperationsService = PublisherOperationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        social_delivery_worker_service_1.SocialDeliveryWorkerService])
], PublisherOperationsService);
//# sourceMappingURL=publisher-operations.service.js.map