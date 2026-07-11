"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherRetryPolicyService = void 0;
const common_1 = require("@nestjs/common");
let PublisherRetryPolicyService = class PublisherRetryPolicyService {
    constructor() {
        this.defaultMaxAttempts = this.readPositiveInteger(process.env.PUBLISHER_MAX_ATTEMPTS, 3);
        this.initialDelayMs = this.readNonNegativeInteger(process.env.PUBLISHER_RETRY_DELAY_MS, 1_000);
        this.maximumDelayMs = this.readPositiveInteger(process.env.PUBLISHER_MAX_RETRY_DELAY_MS, 30_000);
        this.multiplier = this.readPositiveNumber(process.env.PUBLISHER_RETRY_MULTIPLIER, 2);
    }
    maxAttempts(job) {
        const configured = this.toPositiveInteger(job?.maxAttempts) ??
            this.toPositiveInteger(job?.result?.maxAttempts) ??
            this.toPositiveInteger(job?.metadata?.maxAttempts);
        return configured ?? this.defaultMaxAttempts;
    }
    currentAttempt(job) {
        const attempt = this.toNonNegativeInteger(job?.retryCount) ??
            this.toNonNegativeInteger(job?.attempt) ??
            0;
        return attempt + 1;
    }
    decide(job, attempt, error, status) {
        const maxAttempts = this.maxAttempts(job);
        const normalizedStatus = String(status ?? "").toLowerCase();
        if (normalizedStatus === "published" ||
            normalizedStatus === "skipped") {
            return {
                retry: false,
                attempt,
                maxAttempts,
                delayMs: 0,
                reason: `Terminal success status: ${normalizedStatus}`,
            };
        }
        if (attempt >= maxAttempts) {
            return {
                retry: false,
                attempt,
                maxAttempts,
                delayMs: 0,
                reason: "Maximum publisher attempts reached",
            };
        }
        if (!this.isRetryable(error, normalizedStatus)) {
            return {
                retry: false,
                attempt,
                maxAttempts,
                delayMs: 0,
                reason: "Publisher failure is classified as non-retryable",
            };
        }
        return {
            retry: true,
            attempt,
            maxAttempts,
            delayMs: this.calculateDelay(attempt),
            reason: "Publisher failure is retryable",
        };
    }
    isRetryable(error, status) {
        if (status === "retrying") {
            return true;
        }
        if (status === "dead") {
            return false;
        }
        const message = this.errorMessage(error).toLowerCase();
        const nonRetryablePatterns = [
            "validation",
            "invalid payload",
            "unauthorized",
            "forbidden",
            "not registered",
            "not found",
            "unsupported",
            "duplicate",
            "already published",
        ];
        if (nonRetryablePatterns.some((pattern) => message.includes(pattern))) {
            return false;
        }
        const retryablePatterns = [
            "timeout",
            "timed out",
            "temporarily unavailable",
            "connection",
            "network",
            "socket",
            "rate limit",
            "too many requests",
            "service unavailable",
            "gateway",
            "econnreset",
            "econnrefused",
            "429",
            "502",
            "503",
            "504",
        ];
        if (retryablePatterns.some((pattern) => message.includes(pattern))) {
            return true;
        }
        return status === "failed" || status === "unknown";
    }
    calculateDelay(attempt) {
        if (this.initialDelayMs === 0) {
            return 0;
        }
        const exponential = this.initialDelayMs *
            Math.pow(this.multiplier, Math.max(attempt - 1, 0));
        const capped = Math.min(exponential, this.maximumDelayMs);
        const jitterMultiplier = 0.8 + Math.random() * 0.4;
        return Math.max(0, Math.round(capped * jitterMultiplier));
    }
    readPositiveInteger(value, fallback) {
        return this.toPositiveInteger(value) ?? fallback;
    }
    readNonNegativeInteger(value, fallback) {
        return this.toNonNegativeInteger(value) ?? fallback;
    }
    readPositiveNumber(value, fallback) {
        const numeric = Number(value);
        return Number.isFinite(numeric) && numeric > 0
            ? numeric
            : fallback;
    }
    toPositiveInteger(value) {
        const numeric = Number(value);
        return Number.isInteger(numeric) && numeric > 0
            ? numeric
            : undefined;
    }
    toNonNegativeInteger(value) {
        const numeric = Number(value);
        return Number.isInteger(numeric) && numeric >= 0
            ? numeric
            : undefined;
    }
    errorMessage(error) {
        if (error instanceof Error) {
            return error.message;
        }
        return String(error ?? "");
    }
};
exports.PublisherRetryPolicyService = PublisherRetryPolicyService;
exports.PublisherRetryPolicyService = PublisherRetryPolicyService = __decorate([
    (0, common_1.Injectable)()
], PublisherRetryPolicyService);
//# sourceMappingURL=publisher-retry-policy.service.js.map