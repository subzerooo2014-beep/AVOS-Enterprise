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
exports.PublisherEnterpriseService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PublisherEnterpriseService = class PublisherEnterpriseService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async deliveries(query) {
        const where = {
            type: {
                in: this.publicationEventTypes(),
            },
        };
        if (query.channel) {
            where.type =
                this.eventTypeForChannel(query.channel);
        }
        if (query.status) {
            where.status =
                query.status.trim();
        }
        if (query.vehicleId) {
            where.entityId =
                query.vehicleId.trim();
        }
        if (query.dateFrom ||
            query.dateTo) {
            where.createdAt = {};
            if (query.dateFrom) {
                where.createdAt.gte =
                    this.date(query.dateFrom, "dateFrom");
            }
            if (query.dateTo) {
                where.createdAt.lte =
                    this.date(query.dateTo, "dateTo");
            }
        }
        const events = await this.prisma.platformEvent.findMany({
            where,
            orderBy: {
                updatedAt: "desc",
            },
            take: this.limit(query.limit),
        });
        const filtered = query.correlationId
            ? events.filter((event) => this.correlationId(event) ===
                query.correlationId)
            : events;
        return {
            success: true,
            count: filtered.length,
            deliveries: filtered.map((event) => this.deliverySummary(event)),
            generatedAt: new Date(),
        };
    }
    async timeline(eventId) {
        const event = await this.event(eventId);
        const result = this.objectOf(event.result);
        const delivery = this.objectOf(result.delivery);
        const receipts = Array.isArray(result.receipts)
            ? result.receipts
            : [];
        const timeline = [
            {
                stage: "event_created",
                status: "completed",
                at: event.createdAt,
                details: {
                    type: event.type,
                    source: event.source,
                },
            },
        ];
        if (delivery.startedAt) {
            timeline.push({
                stage: "delivery_processing",
                status: "completed",
                at: delivery.startedAt,
                details: {
                    attempt: delivery.attempt ?? null,
                    channel: delivery.channel ?? null,
                },
            });
        }
        if (delivery.completedAt) {
            timeline.push({
                stage: "connector_completed",
                status: delivery.status ??
                    event.status,
                at: delivery.completedAt,
                details: {
                    externalId: delivery.externalId ??
                        null,
                    message: delivery.message ??
                        null,
                },
            });
        }
        for (const receipt of receipts) {
            timeline.push({
                stage: "webhook_receipt",
                status: receipt.status ??
                    "unknown",
                at: receipt.receivedAt ??
                    event.updatedAt,
                details: {
                    receiptId: receipt.receiptId ??
                        null,
                    externalId: receipt.externalId ??
                        null,
                    errorCode: receipt.errorCode ??
                        null,
                    errorMessage: receipt.errorMessage ??
                        null,
                },
            });
        }
        timeline.push({
            stage: "current_state",
            status: event.status,
            at: event.updatedAt,
            details: {
                externalId: delivery.externalId ??
                    null,
            },
        });
        timeline.sort((a, b) => new Date(a.at).getTime() -
            new Date(b.at).getTime());
        return {
            success: true,
            eventId: event.id,
            channel: this.channelForEventType(event.type),
            currentStatus: event.status,
            timeline,
        };
    }
    async snapshot(eventId) {
        const event = await this.event(eventId);
        const payload = this.objectOf(event.payload);
        const result = this.objectOf(event.result);
        return {
            success: true,
            eventId: event.id,
            snapshot: {
                capturedAt: event.createdAt,
                vehicle: payload.vehicle ??
                    null,
                content: payload.content ??
                    null,
                campaign: payload.campaign ??
                    null,
                publisher: payload.publisher ??
                    null,
                correlationId: payload.correlationId ??
                    null,
                delivery: result.delivery ??
                    null,
                receipts: Array.isArray(result.receipts)
                    ? result.receipts
                    : [],
            },
        };
    }
    async analytics() {
        const events = await this.prisma.platformEvent.findMany({
            where: {
                type: {
                    in: this.publicationEventTypes(),
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        const byChannel = {};
        const byStatus = {};
        let totalDurationMs = 0;
        let durationSamples = 0;
        for (const event of events) {
            const channel = this.channelForEventType(event.type) ??
                "unknown";
            const status = event.status ??
                "unknown";
            byStatus[status] =
                (byStatus[status] ?? 0) +
                    1;
            if (!byChannel[channel]) {
                byChannel[channel] = {
                    channel,
                    total: 0,
                    delivered: 0,
                    failed: 0,
                    rejected: 0,
                    cancelled: 0,
                    processing: 0,
                    queued: 0,
                    awaitingCredentials: 0,
                };
            }
            const channelStats = byChannel[channel];
            channelStats.total += 1;
            switch (status) {
                case "delivered":
                    channelStats.delivered += 1;
                    break;
                case "failed":
                case "dead":
                    channelStats.failed += 1;
                    break;
                case "rejected":
                    channelStats.rejected += 1;
                    break;
                case "cancelled":
                    channelStats.cancelled += 1;
                    break;
                case "processing":
                    channelStats.processing += 1;
                    break;
                case "queued":
                case "retrying":
                    channelStats.queued += 1;
                    break;
                case "awaiting_credentials":
                    channelStats.awaitingCredentials += 1;
                    break;
            }
            const result = this.objectOf(event.result);
            const delivery = this.objectOf(result.delivery);
            if (delivery.startedAt &&
                delivery.completedAt) {
                const duration = new Date(delivery.completedAt).getTime() -
                    new Date(delivery.startedAt).getTime();
                if (Number.isFinite(duration) &&
                    duration >= 0) {
                    totalDurationMs += duration;
                    durationSamples += 1;
                }
            }
        }
        const channels = Object.values(byChannel)
            .map((item) => ({
            ...item,
            successRate: item.total > 0
                ? Number((item.delivered /
                    item.total *
                    100).toFixed(2))
                : 0,
        }))
            .sort((a, b) => b.total - a.total);
        return {
            success: true,
            totals: {
                publications: events.length,
                delivered: events.filter((event) => event.status ===
                    "delivered").length,
                failed: events.filter((event) => [
                    "failed",
                    "dead",
                    "rejected",
                ].includes(event.status)).length,
                averageDeliveryDurationMs: durationSamples > 0
                    ? Math.round(totalDurationMs /
                        durationSamples)
                    : 0,
            },
            byStatus,
            channels,
            generatedAt: new Date(),
        };
    }
    async event(eventId) {
        const event = await this.prisma.platformEvent.findUnique({
            where: {
                id: eventId,
            },
        });
        if (!event) {
            throw new common_1.NotFoundException("PlatformEvent not found.");
        }
        return event;
    }
    deliverySummary(event) {
        const payload = this.objectOf(event.payload);
        const result = this.objectOf(event.result);
        const delivery = this.objectOf(result.delivery);
        const receipts = Array.isArray(result.receipts)
            ? result.receipts
            : [];
        return {
            eventId: event.id,
            channel: this.channelForEventType(event.type),
            eventType: event.type,
            status: event.status,
            vehicleId: event.entityId,
            correlationId: payload.correlationId ??
                null,
            externalId: delivery.externalId ??
                result.latestReceipt
                    ?.externalId ??
                null,
            attempt: delivery.attempt ??
                null,
            receiptCount: receipts.length,
            lastError: delivery.errorMessage ??
                null,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
        };
    }
    correlationId(event) {
        const payload = this.objectOf(event.payload);
        return typeof payload.correlationId ===
            "string"
            ? payload.correlationId
            : null;
    }
    eventTypeForChannel(value) {
        const channel = value
            .trim()
            .toLowerCase();
        switch (channel) {
            case "instagram":
                return "InstagramVehiclePublicationRequested";
            case "tiktok":
                return "TikTokVehiclePublicationRequested";
            case "google_search":
            case "google-search":
                return "GoogleSearchVehicleCampaignRequested";
            default:
                throw new common_1.BadRequestException(`Unsupported channel "${channel}".`);
        }
    }
    channelForEventType(type) {
        switch (type) {
            case "InstagramVehiclePublicationRequested":
                return "instagram";
            case "TikTokVehiclePublicationRequested":
                return "tiktok";
            case "GoogleSearchVehicleCampaignRequested":
                return "google_search";
            default:
                return null;
        }
    }
    publicationEventTypes() {
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
    limit(value) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) {
            return 50;
        }
        return Math.min(200, Math.max(1, Math.trunc(numeric)));
    }
    date(value, field) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            throw new common_1.BadRequestException(`${field} is invalid.`);
        }
        return date;
    }
};
exports.PublisherEnterpriseService = PublisherEnterpriseService;
exports.PublisherEnterpriseService = PublisherEnterpriseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublisherEnterpriseService);
//# sourceMappingURL=publisher-enterprise.service.js.map