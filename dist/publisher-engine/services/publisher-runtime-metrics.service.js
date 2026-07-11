"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherRuntimeMetricsService = void 0;
const common_1 = require("@nestjs/common");
let PublisherRuntimeMetricsService = class PublisherRuntimeMetricsService {
    constructor() {
        this.channels = new Map();
    }
    recordAttempt(channel) {
        const metrics = this.getOrCreate(channel);
        metrics.attempted += 1;
        metrics.lastAttemptAt = new Date();
    }
    recordSuccess(channel, durationMs) {
        const metrics = this.getOrCreate(channel);
        metrics.published += 1;
        metrics.lastSuccessAt = new Date();
        this.recordDuration(metrics, durationMs);
    }
    recordFailure(channel, durationMs) {
        const metrics = this.getOrCreate(channel);
        metrics.failed += 1;
        metrics.lastFailureAt = new Date();
        this.recordDuration(metrics, durationMs);
    }
    recordRetry(channel) {
        this.getOrCreate(channel).retried += 1;
    }
    recordDeadLetter(channel) {
        this.getOrCreate(channel).deadLettered += 1;
    }
    summary() {
        const channels = Array.from(this.channels.values())
            .sort((left, right) => left.channel.localeCompare(right.channel))
            .map((metrics) => ({
            ...metrics,
            averageDurationMs: metrics.attempted > 0
                ? Math.round(metrics.totalDurationMs /
                    metrics.attempted)
                : 0,
        }));
        return {
            channels,
            totals: channels.reduce((totals, metrics) => {
                totals.attempted += metrics.attempted;
                totals.published += metrics.published;
                totals.failed += metrics.failed;
                totals.retried += metrics.retried;
                totals.deadLettered +=
                    metrics.deadLettered;
                return totals;
            }, {
                attempted: 0,
                published: 0,
                failed: 0,
                retried: 0,
                deadLettered: 0,
            }),
            generatedAt: new Date(),
        };
    }
    getOrCreate(channel) {
        const normalized = String(channel || "unknown")
            .trim()
            .toLowerCase();
        const existing = this.channels.get(normalized);
        if (existing) {
            return existing;
        }
        const created = {
            channel: normalized,
            attempted: 0,
            published: 0,
            failed: 0,
            retried: 0,
            deadLettered: 0,
            totalDurationMs: 0,
            lastDurationMs: 0,
        };
        this.channels.set(normalized, created);
        return created;
    }
    recordDuration(metrics, durationMs) {
        const normalized = Number.isFinite(durationMs)
            ? Math.max(0, Math.round(durationMs))
            : 0;
        metrics.lastDurationMs = normalized;
        metrics.totalDurationMs += normalized;
    }
};
exports.PublisherRuntimeMetricsService = PublisherRuntimeMetricsService;
exports.PublisherRuntimeMetricsService = PublisherRuntimeMetricsService = __decorate([
    (0, common_1.Injectable)()
], PublisherRuntimeMetricsService);
//# sourceMappingURL=publisher-runtime-metrics.service.js.map