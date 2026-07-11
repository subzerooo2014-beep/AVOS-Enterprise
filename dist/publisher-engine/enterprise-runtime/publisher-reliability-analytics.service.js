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
exports.PublisherReliabilityAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PublisherReliabilityAnalyticsService = class PublisherReliabilityAnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async slaReport(input) {
        const window = this.window(input?.dateFrom, input?.dateTo);
        const events = await this.events(window, input?.channel);
        const policy = this.policy();
        const channels = this.channelMetrics(events);
        const overall = this.overallMetrics(events);
        return {
            success: true,
            window: {
                label: window.label,
                from: window.from,
                to: window.to,
            },
            filter: {
                channel: input?.channel ?? null,
            },
            policy,
            overall: {
                ...overall,
                sla: {
                    deliveryTimeMet: overall.averageDeliveryDurationMs <=
                        policy.deliveryTargetMs,
                    successRateMet: overall.successRate >=
                        policy.successRateTarget,
                    receiptCoverageMet: overall.receiptCoverageRate >=
                        policy.receiptCoverageTarget,
                    attemptsMet: overall.averageAttempts <=
                        policy.maximumAverageAttempts,
                    compliant: overall.averageDeliveryDurationMs <=
                        policy.deliveryTargetMs &&
                        overall.successRate >=
                            policy.successRateTarget &&
                        overall.receiptCoverageRate >=
                            policy.receiptCoverageTarget &&
                        overall.averageAttempts <=
                            policy.maximumAverageAttempts,
                },
            },
            channels: channels.map((item) => ({
                ...item,
                sla: {
                    deliveryTimeMet: item.averageDeliveryDurationMs <=
                        policy.deliveryTargetMs,
                    successRateMet: item.successRate >=
                        policy.successRateTarget,
                    receiptCoverageMet: item.receiptCoverageRate >=
                        policy.receiptCoverageTarget,
                    attemptsMet: item.averageAttempts <=
                        policy.maximumAverageAttempts,
                    compliant: item.averageDeliveryDurationMs <=
                        policy.deliveryTargetMs &&
                        item.successRate >=
                            policy.successRateTarget &&
                        item.receiptCoverageRate >=
                            policy.receiptCoverageTarget &&
                        item.averageAttempts <=
                            policy.maximumAverageAttempts,
                },
            })),
            generatedAt: new Date(),
        };
    }
    async failureTrends(input) {
        const window = this.window(input?.dateFrom, input?.dateTo);
        const events = await this.events(window, input?.channel);
        const daily = {};
        const errorMessages = {};
        const errorCodes = {};
        const statuses = {};
        for (const event of events) {
            const status = String(event.status ??
                "unknown");
            if (![
                "failed",
                "dead",
                "rejected",
                "cancelled",
                "retrying",
            ].includes(status)) {
                continue;
            }
            statuses[status] =
                (statuses[status] ?? 0) +
                    1;
            const day = new Date(event.updatedAt ??
                event.createdAt)
                .toISOString()
                .slice(0, 10);
            if (!daily[day]) {
                daily[day] = {
                    date: day,
                    total: 0,
                    failed: 0,
                    dead: 0,
                    rejected: 0,
                    cancelled: 0,
                    retrying: 0,
                };
            }
            daily[day].total += 1;
            if (typeof daily[day][status] ===
                "number") {
                daily[day][status] += 1;
            }
            const result = this.objectOf(event.result);
            const delivery = this.objectOf(result.delivery);
            const message = this.safeErrorText(delivery.errorMessage ??
                delivery.message ??
                event.result?.latestReceipt?.errorMessage ??
                null);
            const code = this.safeErrorText(delivery.errorCode ??
                event.result?.latestReceipt?.errorCode ??
                null);
            if (message) {
                errorMessages[message] =
                    (errorMessages[message] ?? 0) +
                        1;
            }
            if (code) {
                errorCodes[code] =
                    (errorCodes[code] ?? 0) +
                        1;
            }
        }
        return {
            success: true,
            window: {
                label: window.label,
                from: window.from,
                to: window.to,
            },
            channel: input?.channel ?? null,
            totals: {
                failures: Object.values(statuses)
                    .reduce((sum, value) => sum + value, 0),
                byStatus: statuses,
            },
            daily: Object.values(daily)
                .sort((a, b) => String(a.date)
                .localeCompare(String(b.date))),
            topErrorMessages: this.topEntries(errorMessages, 10),
            topErrorCodes: this.topEntries(errorCodes, 10),
            generatedAt: new Date(),
        };
    }
    async reliabilityRanking(input) {
        const window = this.window(input?.dateFrom, input?.dateTo);
        const events = await this.events(window);
        const channels = this.channelMetrics(events).map((item) => {
            const reliabilityScore = this.reliabilityScore(item);
            return {
                ...item,
                reliabilityScore,
                grade: this.grade(reliabilityScore),
                risk: reliabilityScore >= 90
                    ? "low"
                    : reliabilityScore >= 75
                        ? "medium"
                        : "high",
            };
        })
            .sort((a, b) => b.reliabilityScore -
            a.reliabilityScore);
        return {
            success: true,
            window: {
                label: window.label,
                from: window.from,
                to: window.to,
            },
            channels,
            bestChannel: channels[0] ?? null,
            weakestChannel: channels.length > 0
                ? channels[channels.length - 1]
                : null,
            generatedAt: new Date(),
        };
    }
    async latencyDistribution(input) {
        const window = this.window(input?.dateFrom, input?.dateTo);
        const events = await this.events(window, input?.channel);
        const durations = events
            .map((event) => this.deliveryDuration(this.objectOf(this.objectOf(event.result).delivery)))
            .filter((value) => value !== null)
            .sort((a, b) => a - b);
        return {
            success: true,
            window: {
                label: window.label,
                from: window.from,
                to: window.to,
            },
            channel: input?.channel ?? null,
            samples: durations.length,
            latency: {
                minimumMs: durations.length > 0
                    ? durations[0]
                    : 0,
                maximumMs: durations.length > 0
                    ? durations[durations.length - 1]
                    : 0,
                averageMs: durations.length > 0
                    ? Math.round(durations.reduce((sum, item) => sum + item, 0) /
                        durations.length)
                    : 0,
                p50Ms: this.percentile(durations, 50),
                p90Ms: this.percentile(durations, 90),
                p95Ms: this.percentile(durations, 95),
                p99Ms: this.percentile(durations, 99),
            },
            generatedAt: new Date(),
        };
    }
    async events(window, channel) {
        const where = {
            type: {
                in: this.publicationEventTypes(),
            },
            createdAt: {
                gte: window.from,
                lte: window.to,
            },
        };
        if (channel) {
            where.type =
                this.eventTypeForChannel(channel);
        }
        return this.prisma.platformEvent.findMany({
            where,
            orderBy: {
                createdAt: "asc",
            },
        });
    }
    overallMetrics(events) {
        const grouped = this.channelMetrics(events);
        const total = grouped.reduce((sum, item) => sum + item.total, 0);
        const delivered = grouped.reduce((sum, item) => sum + item.delivered, 0);
        const failed = grouped.reduce((sum, item) => sum + item.failed, 0);
        const receiptEvents = grouped.reduce((sum, item) => sum + item.eventsWithReceipts, 0);
        const totalAttempts = grouped.reduce((sum, item) => sum + item.totalAttempts, 0);
        const attemptSamples = grouped.reduce((sum, item) => sum + item.attemptSamples, 0);
        const totalDurationMs = grouped.reduce((sum, item) => sum + item.totalDurationMs, 0);
        const durationSamples = grouped.reduce((sum, item) => sum + item.durationSamples, 0);
        const terminal = delivered +
            failed;
        return {
            total,
            delivered,
            failed,
            successRate: terminal > 0
                ? this.percent(delivered, terminal)
                : 0,
            receiptCoverageRate: total > 0
                ? this.percent(receiptEvents, total)
                : 0,
            averageAttempts: attemptSamples > 0
                ? this.round(totalAttempts /
                    attemptSamples)
                : 0,
            averageDeliveryDurationMs: durationSamples > 0
                ? Math.round(totalDurationMs /
                    durationSamples)
                : 0,
        };
    }
    channelMetrics(events) {
        const map = {};
        for (const event of events) {
            const channel = this.channelForEventType(event.type) ??
                "unknown";
            if (!map[channel]) {
                map[channel] = {
                    channel,
                    total: 0,
                    delivered: 0,
                    failed: 0,
                    queued: 0,
                    processing: 0,
                    awaitingCredentials: 0,
                    eventsWithReceipts: 0,
                    totalAttempts: 0,
                    attemptSamples: 0,
                    totalDurationMs: 0,
                    durationSamples: 0,
                };
            }
            const item = map[channel];
            item.total += 1;
            const status = String(event.status ??
                "unknown");
            if (status ===
                "delivered") {
                item.delivered += 1;
            }
            else if ([
                "failed",
                "dead",
                "rejected",
                "cancelled",
            ].includes(status)) {
                item.failed += 1;
            }
            else if ([
                "queued",
                "retrying",
            ].includes(status)) {
                item.queued += 1;
            }
            else if (status ===
                "processing") {
                item.processing += 1;
            }
            else if (status ===
                "awaiting_credentials") {
                item.awaitingCredentials += 1;
            }
            const result = this.objectOf(event.result);
            const delivery = this.objectOf(result.delivery);
            const attempts = Number(delivery.attempt ?? 0);
            if (Number.isFinite(attempts) &&
                attempts > 0) {
                item.totalAttempts +=
                    attempts;
                item.attemptSamples += 1;
            }
            const duration = this.deliveryDuration(delivery);
            if (duration !== null) {
                item.totalDurationMs +=
                    duration;
                item.durationSamples += 1;
            }
            const receipts = Array.isArray(result.receipts)
                ? result.receipts
                : [];
            if (receipts.length > 0) {
                item.eventsWithReceipts +=
                    1;
            }
        }
        return Object.values(map)
            .map((item) => {
            const terminal = item.delivered +
                item.failed;
            return {
                ...item,
                successRate: terminal > 0
                    ? this.percent(item.delivered, terminal)
                    : 0,
                receiptCoverageRate: item.total > 0
                    ? this.percent(item.eventsWithReceipts, item.total)
                    : 0,
                averageAttempts: item.attemptSamples > 0
                    ? this.round(item.totalAttempts /
                        item.attemptSamples)
                    : 0,
                averageDeliveryDurationMs: item.durationSamples > 0
                    ? Math.round(item.totalDurationMs /
                        item.durationSamples)
                    : 0,
            };
        });
    }
    reliabilityScore(item) {
        const successComponent = Math.min(100, item.successRate) * 0.5;
        const receiptComponent = Math.min(100, item.receiptCoverageRate) * 0.2;
        const attemptPenalty = Math.min(20, Math.max(0, (item.averageAttempts -
            1) * 10));
        const latencyTarget = this.policy()
            .deliveryTargetMs;
        const latencyRatio = item.averageDeliveryDurationMs <= 0
            ? 1
            : Math.min(1, latencyTarget /
                item.averageDeliveryDurationMs);
        const latencyComponent = latencyRatio * 30;
        return Number(Math.max(0, Math.min(100, successComponent +
            receiptComponent +
            latencyComponent -
            attemptPenalty)).toFixed(2));
    }
    grade(score) {
        if (score >= 95) {
            return "A+";
        }
        if (score >= 90) {
            return "A";
        }
        if (score >= 85) {
            return "B+";
        }
        if (score >= 75) {
            return "B";
        }
        if (score >= 65) {
            return "C";
        }
        return "D";
    }
    policy() {
        return {
            deliveryTargetMs: this.positiveInteger(process.env
                .PUBLISHER_SLA_DELIVERY_TARGET_MS, 5_000),
            successRateTarget: this.percentage(process.env
                .PUBLISHER_SLA_SUCCESS_RATE_TARGET, 99),
            receiptCoverageTarget: this.percentage(process.env
                .PUBLISHER_SLA_RECEIPT_COVERAGE_TARGET, 90),
            maximumAverageAttempts: this.positiveNumber(process.env
                .PUBLISHER_SLA_MAX_AVERAGE_ATTEMPTS, 2),
        };
    }
    percentile(sorted, percentile) {
        if (sorted.length === 0) {
            return 0;
        }
        const index = Math.ceil(percentile /
            100 *
            sorted.length) - 1;
        return sorted[Math.max(0, Math.min(sorted.length - 1, index))];
    }
    deliveryDuration(delivery) {
        if (!delivery.startedAt ||
            !delivery.completedAt) {
            return null;
        }
        const started = new Date(delivery.startedAt).getTime();
        const completed = new Date(delivery.completedAt).getTime();
        const duration = completed -
            started;
        return Number.isFinite(duration) &&
            duration >= 0
            ? duration
            : null;
    }
    topEntries(source, limit) {
        return Object.entries(source)
            .map(([value, count]) => ({
            value,
            count,
        }))
            .sort((a, b) => b.count -
            a.count)
            .slice(0, limit);
    }
    safeErrorText(value) {
        if (typeof value !==
            "string") {
            return null;
        }
        const normalized = value
            .trim()
            .replace(/\s+/g, " ")
            .slice(0, 300);
        return normalized ||
            null;
    }
    window(dateFrom, dateTo) {
        const to = dateTo
            ? this.date(dateTo, "dateTo")
            : new Date();
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
    eventTypeForChannel(value) {
        const channel = String(value)
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
    percentage(value, fallback) {
        const numeric = Number(value);
        return Number.isFinite(numeric) &&
            numeric >= 0 &&
            numeric <= 100
            ? numeric
            : fallback;
    }
    positiveInteger(value, fallback) {
        const numeric = Number(value);
        return Number.isInteger(numeric) &&
            numeric > 0
            ? numeric
            : fallback;
    }
    positiveNumber(value, fallback) {
        const numeric = Number(value);
        return Number.isFinite(numeric) &&
            numeric > 0
            ? numeric
            : fallback;
    }
    round(value) {
        return Number(value.toFixed(2));
    }
    objectOf(value) {
        if (value &&
            typeof value ===
                "object" &&
            !Array.isArray(value)) {
            return value;
        }
        return {};
    }
};
exports.PublisherReliabilityAnalyticsService = PublisherReliabilityAnalyticsService;
exports.PublisherReliabilityAnalyticsService = PublisherReliabilityAnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublisherReliabilityAnalyticsService);
//# sourceMappingURL=publisher-reliability-analytics.service.js.map