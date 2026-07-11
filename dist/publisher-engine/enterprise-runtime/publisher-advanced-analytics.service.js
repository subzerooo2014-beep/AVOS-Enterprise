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
exports.PublisherAdvancedAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PublisherAdvancedAnalyticsService = class PublisherAdvancedAnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async dashboard(input) {
        const window = this.window(input?.dateFrom, input?.dateTo);
        const where = {
            type: {
                in: this.publicationEventTypes(),
            },
            createdAt: {
                gte: window.from,
                lte: window.to,
            },
        };
        if (input?.channel) {
            where.type =
                this.eventTypeForChannel(input.channel);
        }
        const events = await this.prisma.platformEvent.findMany({
            where,
            orderBy: {
                createdAt: "asc",
            },
        });
        const metrics = this.calculateMetrics(events);
        return {
            success: true,
            window: {
                label: window.label,
                from: window.from,
                to: window.to,
            },
            filters: {
                channel: input?.channel ??
                    null,
            },
            overview: metrics.overview,
            channels: metrics.channels,
            statuses: metrics.statuses,
            retries: metrics.retries,
            versions: metrics.versions,
            receipts: metrics.receipts,
            operations: metrics.operations,
            generatedAt: new Date(),
        };
    }
    async kpis(input) {
        const window = this.window(input?.dateFrom, input?.dateTo);
        const events = await this.prisma.platformEvent.findMany({
            where: {
                type: {
                    in: this.publicationEventTypes(),
                },
                createdAt: {
                    gte: window.from,
                    lte: window.to,
                },
            },
            orderBy: {
                createdAt: "asc",
            },
        });
        const metrics = this.calculateMetrics(events);
        const previousDuration = window.to.getTime() -
            window.from.getTime();
        const previousTo = new Date(window.from.getTime() -
            1);
        const previousFrom = new Date(previousTo.getTime() -
            previousDuration);
        const previousEvents = await this.prisma.platformEvent.findMany({
            where: {
                type: {
                    in: this.publicationEventTypes(),
                },
                createdAt: {
                    gte: previousFrom,
                    lte: previousTo,
                },
            },
        });
        const previousMetrics = this.calculateMetrics(previousEvents);
        return {
            success: true,
            window: {
                from: window.from,
                to: window.to,
            },
            kpis: {
                totalPublications: this.kpi(metrics.overview.totalPublications, previousMetrics.overview.totalPublications),
                delivered: this.kpi(metrics.overview.delivered, previousMetrics.overview.delivered),
                failed: this.kpi(metrics.overview.failed, previousMetrics.overview.failed),
                successRate: this.kpi(metrics.overview.successRate, previousMetrics.overview.successRate),
                averageDeliveryDurationMs: this.kpi(metrics.overview.averageDeliveryDurationMs, previousMetrics.overview.averageDeliveryDurationMs, true),
                averageAttempts: this.kpi(metrics.overview.averageAttempts, previousMetrics.overview.averageAttempts, true),
                receiptCoverageRate: this.kpi(metrics.overview.receiptCoverageRate, previousMetrics.overview.receiptCoverageRate),
                versionedPublicationRate: this.kpi(metrics.overview.versionedPublicationRate, previousMetrics.overview.versionedPublicationRate),
            },
            generatedAt: new Date(),
        };
    }
    async channelPerformance(input) {
        const window = this.window(input?.dateFrom, input?.dateTo);
        const events = await this.prisma.platformEvent.findMany({
            where: {
                type: {
                    in: this.publicationEventTypes(),
                },
                createdAt: {
                    gte: window.from,
                    lte: window.to,
                },
            },
        });
        const metrics = this.calculateMetrics(events);
        return {
            success: true,
            window: {
                from: window.from,
                to: window.to,
            },
            channels: metrics.channels,
            bestChannel: metrics.channels.length > 0
                ? metrics.channels[0]
                : null,
            generatedAt: new Date(),
        };
    }
    calculateMetrics(events) {
        const statusMap = {};
        const channelMap = {};
        let delivered = 0;
        let failed = 0;
        let queued = 0;
        let processing = 0;
        let cancelled = 0;
        let rejected = 0;
        let awaitingCredentials = 0;
        let totalAttempts = 0;
        let attemptSamples = 0;
        let totalDurationMs = 0;
        let durationSamples = 0;
        let totalReceipts = 0;
        let eventsWithReceipts = 0;
        let totalVersions = 0;
        let versionedEvents = 0;
        let totalOperations = 0;
        let cloneOperations = 0;
        let replayOperations = 0;
        let retryOperations = 0;
        let cancelOperations = 0;
        let restoreOperations = 0;
        for (const event of events) {
            const channel = this.channelForEventType(event.type) ??
                "unknown";
            const status = String(event.status ??
                "unknown");
            statusMap[status] =
                (statusMap[status] ?? 0) +
                    1;
            if (!channelMap[channel]) {
                channelMap[channel] = {
                    channel,
                    total: 0,
                    delivered: 0,
                    failed: 0,
                    queued: 0,
                    processing: 0,
                    cancelled: 0,
                    rejected: 0,
                    awaitingCredentials: 0,
                    totalAttempts: 0,
                    attemptSamples: 0,
                    totalDurationMs: 0,
                    durationSamples: 0,
                    receipts: 0,
                    versions: 0,
                    operations: 0,
                };
            }
            const channelStats = channelMap[channel];
            channelStats.total += 1;
            const result = this.objectOf(event.result);
            const delivery = this.objectOf(result.delivery);
            const attempts = Number(delivery.attempt ?? 0);
            if (Number.isFinite(attempts) &&
                attempts > 0) {
                totalAttempts += attempts;
                attemptSamples += 1;
                channelStats.totalAttempts += attempts;
                channelStats.attemptSamples += 1;
            }
            const duration = this.deliveryDuration(delivery);
            if (duration !== null) {
                totalDurationMs += duration;
                durationSamples += 1;
                channelStats.totalDurationMs += duration;
                channelStats.durationSamples += 1;
            }
            const receipts = Array.isArray(result.receipts)
                ? result.receipts
                : [];
            totalReceipts +=
                receipts.length;
            channelStats.receipts +=
                receipts.length;
            if (receipts.length > 0) {
                eventsWithReceipts += 1;
            }
            const versions = Array.isArray(result.versions)
                ? result.versions
                : [];
            totalVersions +=
                versions.length;
            channelStats.versions +=
                versions.length;
            if (versions.length > 0) {
                versionedEvents += 1;
            }
            const operations = Array.isArray(result.operations)
                ? result.operations
                : [];
            totalOperations +=
                operations.length;
            channelStats.operations +=
                operations.length;
            for (const operation of operations) {
                switch (operation?.operation) {
                    case "clone":
                        cloneOperations += 1;
                        break;
                    case "replay":
                        replayOperations += 1;
                        break;
                    case "retry":
                    case "retry_now":
                        retryOperations += 1;
                        break;
                    case "cancel":
                        cancelOperations += 1;
                        break;
                }
            }
            const restores = Array.isArray(result.restores)
                ? result.restores
                : [];
            restoreOperations +=
                restores.length;
            switch (status) {
                case "delivered":
                    delivered += 1;
                    channelStats.delivered += 1;
                    break;
                case "failed":
                case "dead":
                    failed += 1;
                    channelStats.failed += 1;
                    break;
                case "queued":
                case "retrying":
                    queued += 1;
                    channelStats.queued += 1;
                    break;
                case "processing":
                    processing += 1;
                    channelStats.processing += 1;
                    break;
                case "cancelled":
                    cancelled += 1;
                    channelStats.cancelled += 1;
                    break;
                case "rejected":
                    rejected += 1;
                    channelStats.rejected += 1;
                    break;
                case "awaiting_credentials":
                    awaitingCredentials += 1;
                    channelStats.awaitingCredentials += 1;
                    break;
            }
        }
        const channels = Object.values(channelMap)
            .map((item) => {
            const terminal = item.delivered +
                item.failed +
                item.rejected +
                item.cancelled;
            return {
                channel: item.channel,
                total: item.total,
                delivered: item.delivered,
                failed: item.failed,
                queued: item.queued,
                processing: item.processing,
                cancelled: item.cancelled,
                rejected: item.rejected,
                awaitingCredentials: item.awaitingCredentials,
                successRate: terminal > 0
                    ? this.percent(item.delivered, terminal)
                    : 0,
                averageAttempts: item.attemptSamples > 0
                    ? this.round(item.totalAttempts /
                        item.attemptSamples)
                    : 0,
                averageDeliveryDurationMs: item.durationSamples > 0
                    ? Math.round(item.totalDurationMs /
                        item.durationSamples)
                    : 0,
                receiptCount: item.receipts,
                versionCount: item.versions,
                operationCount: item.operations,
            };
        })
            .sort((a, b) => {
            if (b.successRate !==
                a.successRate) {
                return (b.successRate -
                    a.successRate);
            }
            return (b.total -
                a.total);
        });
        const terminalCount = delivered +
            failed +
            rejected +
            cancelled;
        return {
            overview: {
                totalPublications: events.length,
                delivered,
                failed,
                queued,
                processing,
                cancelled,
                rejected,
                awaitingCredentials,
                successRate: terminalCount > 0
                    ? this.percent(delivered, terminalCount)
                    : 0,
                averageAttempts: attemptSamples > 0
                    ? this.round(totalAttempts /
                        attemptSamples)
                    : 0,
                averageDeliveryDurationMs: durationSamples > 0
                    ? Math.round(totalDurationMs /
                        durationSamples)
                    : 0,
                receiptCoverageRate: events.length > 0
                    ? this.percent(eventsWithReceipts, events.length)
                    : 0,
                versionedPublicationRate: events.length > 0
                    ? this.percent(versionedEvents, events.length)
                    : 0,
            },
            channels,
            statuses: statusMap,
            retries: {
                totalAttempts,
                averageAttempts: attemptSamples > 0
                    ? this.round(totalAttempts /
                        attemptSamples)
                    : 0,
                retryOperations,
            },
            versions: {
                totalVersions,
                versionedEvents,
                versionedPublicationRate: events.length > 0
                    ? this.percent(versionedEvents, events.length)
                    : 0,
                restoreOperations,
            },
            receipts: {
                totalReceipts,
                eventsWithReceipts,
                coverageRate: events.length > 0
                    ? this.percent(eventsWithReceipts, events.length)
                    : 0,
            },
            operations: {
                totalOperations,
                cloneOperations,
                replayOperations,
                retryOperations,
                cancelOperations,
                restoreOperations,
            },
        };
    }
    deliveryDuration(delivery) {
        if (!delivery.startedAt ||
            !delivery.completedAt) {
            return null;
        }
        const started = new Date(delivery.startedAt).getTime();
        const completed = new Date(delivery.completedAt).getTime();
        const duration = completed - started;
        if (!Number.isFinite(duration) ||
            duration < 0) {
            return null;
        }
        return duration;
    }
    window(dateFrom, dateTo) {
        const now = new Date();
        const to = dateTo
            ? this.date(dateTo, "dateTo")
            : now;
        const from = dateFrom
            ? this.date(dateFrom, "dateFrom")
            : new Date(to.getTime() -
                30 *
                    24 *
                    60 *
                    60 *
                    1000);
        if (from.getTime() >
            to.getTime()) {
            throw new common_1.BadRequestException("dateFrom cannot be after dateTo.");
        }
        return {
            from,
            to,
            label: dateFrom ||
                dateTo
                ? "custom"
                : "last_30_days",
        };
    }
    kpi(current, previous, lowerIsBetter = false) {
        const change = previous === 0
            ? current === 0
                ? 0
                : 100
            : this.round(((current -
                previous) /
                Math.abs(previous)) *
                100);
        const improved = lowerIsBetter
            ? change < 0
            : change > 0;
        return {
            current,
            previous,
            changePercent: change,
            trend: change > 0
                ? "up"
                : change < 0
                    ? "down"
                    : "stable",
            improved: change === 0
                ? null
                : improved,
        };
    }
    eventTypeForChannel(value) {
        const normalized = String(value)
            .trim()
            .toLowerCase();
        switch (normalized) {
            case "instagram":
                return "InstagramVehiclePublicationRequested";
            case "tiktok":
                return "TikTokVehiclePublicationRequested";
            case "google_search":
            case "google-search":
                return "GoogleSearchVehicleCampaignRequested";
            default:
                throw new common_1.BadRequestException(`Unsupported channel "${normalized}".`);
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
    date(value, field) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            throw new common_1.BadRequestException(`${field} is invalid.`);
        }
        return date;
    }
    percent(numerator, denominator) {
        if (denominator <= 0) {
            return 0;
        }
        return this.round(numerator /
            denominator *
            100);
    }
    round(value) {
        return Number(value.toFixed(2));
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
exports.PublisherAdvancedAnalyticsService = PublisherAdvancedAnalyticsService;
exports.PublisherAdvancedAnalyticsService = PublisherAdvancedAnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublisherAdvancedAnalyticsService);
//# sourceMappingURL=publisher-advanced-analytics.service.js.map