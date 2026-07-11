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
exports.PlatformEventBusService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const mega_pack_6_constants_1 = require("./constants/mega-pack-6.constants");
const enterprise_sequence_service_1 = require("./enterprise-sequence.service");
const mega_pack_6_storage_service_1 = require("./mega-pack-6-storage.service");
let PlatformEventBusService = class PlatformEventBusService {
    constructor(storage, sequence) {
        this.storage = storage;
        this.sequence = sequence;
    }
    async publish(dto) {
        const now = new Date().toISOString();
        const event = {
            id: (0, node_crypto_1.randomUUID)(),
            eventCode: this.sequence.next(mega_pack_6_constants_1.EVENT_CODE_PREFIX),
            eventType: dto.eventType,
            source: dto.source,
            severity: dto.severity,
            entityReference: dto.entityType && dto.entityId
                ? {
                    entityType: dto.entityType,
                    entityId: dto.entityId,
                }
                : undefined,
            payload: dto.payload,
            correlationId: dto.correlationId,
            causationId: dto.causationId,
            occurredAt: now,
            processingStatus: "pending",
            retryCount: 0,
            createdAt: now,
            updatedAt: now,
        };
        return this.storage.append(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.platformEvents, event);
    }
    async list(status, eventType) {
        const events = await this.storage.readCollection(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.platformEvents);
        return events
            .filter((event) => (!status ||
            event.processingStatus ===
                status) &&
            (!eventType ||
                event.eventType === eventType))
            .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
    }
    async markProcessing(id) {
        return this.updateStatus(id, "processing");
    }
    async markProcessed(id) {
        return this.updateStatus(id, "processed");
    }
    async markFailed(id, errorMessage) {
        const existing = await this.storage.findById(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.platformEvents, id);
        if (!existing) {
            throw new common_1.NotFoundException(`Platform event ${id} was not found`);
        }
        const now = new Date().toISOString();
        const updated = {
            ...existing,
            processingStatus: "failed",
            retryCount: existing.retryCount + 1,
            errorMessage,
            updatedAt: now,
        };
        await this.storage.replaceById(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.platformEvents, id, updated);
        return updated;
    }
    async pendingCount() {
        const events = await this.list("pending");
        return events.length;
    }
    async updateStatus(id, processingStatus) {
        const existing = await this.storage.findById(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.platformEvents, id);
        if (!existing) {
            throw new common_1.NotFoundException(`Platform event ${id} was not found`);
        }
        const now = new Date().toISOString();
        const updated = {
            ...existing,
            processingStatus,
            processedAt: processingStatus === "processed"
                ? now
                : existing.processedAt,
            updatedAt: now,
        };
        await this.storage.replaceById(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.platformEvents, id, updated);
        return updated;
    }
};
exports.PlatformEventBusService = PlatformEventBusService;
exports.PlatformEventBusService = PlatformEventBusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mega_pack_6_storage_service_1.MegaPack6StorageService,
        enterprise_sequence_service_1.EnterpriseSequenceService])
], PlatformEventBusService);
//# sourceMappingURL=platform-event-bus.service.js.map