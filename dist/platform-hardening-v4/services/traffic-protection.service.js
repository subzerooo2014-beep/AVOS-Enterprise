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
exports.TrafficProtectionService = void 0;
const common_1 = require("@nestjs/common");
const traffic_decision_enum_1 = require("../enums/traffic-decision.enum");
const resilience_state_service_1 = require("./resilience-state.service");
let TrafficProtectionService = class TrafficProtectionService {
    constructor(resilience) {
        this.resilience = resilience;
        this.activeRequests = 0;
        this.totalAllowed = 0;
        this.totalRejected = 0;
        this.lastDecision = traffic_decision_enum_1.TrafficDecision.ALLOW;
        this.requestTimestamps = [];
        this.rejectionReasons = new Map();
        this.policy = {
            enabled: true,
            requestsPerMinute: this.readPositiveInteger(process.env.AVOS_REQUESTS_PER_MINUTE, 1200),
            maximumConcurrentRequests: this.readPositiveInteger(process.env.AVOS_MAX_CONCURRENT_REQUESTS, 100),
            loadSheddingThresholdPercent: this.readPercentage(process.env.AVOS_LOAD_SHEDDING_THRESHOLD_PERCENT, 90),
            excludedPaths: [
                "/platform-hardening/v3/status",
                "/platform-hardening/v4/status",
            ],
            maintenanceAllowedPaths: [
                "/platform-hardening/v3/status",
                "/platform-hardening/v4/status",
                "/platform-hardening/v4/snapshot",
                "/platform-hardening/v4/mode",
                "/platform-hardening/v4/maintenance/disable",
            ],
        };
    }
    evaluate(path) {
        this.pruneWindow();
        if (!this.policy.enabled) {
            return this.allow();
        }
        if (this.matchesPath(path, this.policy.excludedPaths)) {
            return this.allow();
        }
        if (this.resilience.isEmergency()) {
            return this.reject(traffic_decision_enum_1.TrafficDecision.EMERGENCY_BLOCK);
        }
        if (this.resilience.isMaintenance() &&
            !this.matchesPath(path, this.policy.maintenanceAllowedPaths)) {
            return this.reject(traffic_decision_enum_1.TrafficDecision.MAINTENANCE);
        }
        if (this.requestTimestamps.length >=
            this.policy.requestsPerMinute) {
            return this.reject(traffic_decision_enum_1.TrafficDecision.RATE_LIMIT);
        }
        if (this.activeRequests >=
            this.policy.maximumConcurrentRequests) {
            return this.reject(traffic_decision_enum_1.TrafficDecision.CONCURRENCY_LIMIT);
        }
        const concurrencyPercent = this.getConcurrencyUsagePercent();
        if (concurrencyPercent >=
            this.policy.loadSheddingThresholdPercent &&
            this.shouldShedPath(path)) {
            return this.reject(traffic_decision_enum_1.TrafficDecision.LOAD_SHED);
        }
        return this.allow();
    }
    beginRequest() {
        this.activeRequests += 1;
        this.requestTimestamps.push(Date.now());
    }
    finishRequest() {
        this.activeRequests = Math.max(0, this.activeRequests - 1);
    }
    getPolicy() {
        return {
            ...this.policy,
            excludedPaths: [
                ...this.policy.excludedPaths,
            ],
            maintenanceAllowedPaths: [
                ...this.policy.maintenanceAllowedPaths,
            ],
        };
    }
    updatePolicy(patch) {
        this.policy = {
            ...this.policy,
            ...patch,
            excludedPaths: patch.excludedPaths ??
                this.policy.excludedPaths,
            maintenanceAllowedPaths: patch.maintenanceAllowedPaths ??
                this.policy.maintenanceAllowedPaths,
        };
        return this.getPolicy();
    }
    getState() {
        this.pruneWindow();
        return {
            activeRequests: this.activeRequests,
            maximumConcurrentRequests: this.policy.maximumConcurrentRequests,
            recentRequestCount: this.requestTimestamps.length,
            requestsPerMinuteLimit: this.policy.requestsPerMinute,
            concurrencyUsagePercent: this.getConcurrencyUsagePercent(),
            loadSheddingActive: this.getConcurrencyUsagePercent() >=
                this.policy.loadSheddingThresholdPercent,
            lastDecision: this.lastDecision,
            totalAllowed: this.totalAllowed,
            totalRejected: this.totalRejected,
            rejectionReasons: Object.fromEntries(this.rejectionReasons),
        };
    }
    allow() {
        this.totalAllowed += 1;
        this.lastDecision =
            traffic_decision_enum_1.TrafficDecision.ALLOW;
        return traffic_decision_enum_1.TrafficDecision.ALLOW;
    }
    reject(decision) {
        this.totalRejected += 1;
        this.lastDecision = decision;
        this.rejectionReasons.set(decision, (this.rejectionReasons.get(decision) ?? 0) + 1);
        return decision;
    }
    shouldShedPath(path) {
        return (path.includes("/reports") ||
            path.includes("/analytics") ||
            path.includes("/export") ||
            path.includes("/ai-") ||
            path.includes("/publisher"));
    }
    getConcurrencyUsagePercent() {
        if (this.policy.maximumConcurrentRequests <= 0) {
            return 0;
        }
        return Number(((this.activeRequests /
            this.policy.maximumConcurrentRequests) *
            100).toFixed(2));
    }
    pruneWindow() {
        const minimumTimestamp = Date.now() - 60_000;
        while (this.requestTimestamps.length > 0 &&
            this.requestTimestamps[0] <
                minimumTimestamp) {
            this.requestTimestamps.shift();
        }
    }
    matchesPath(path, values) {
        return values.some((value) => path === value ||
            path.startsWith(`${value}?`));
    }
    readPositiveInteger(value, fallback) {
        const parsed = Number(value);
        if (Number.isInteger(parsed) &&
            parsed > 0) {
            return parsed;
        }
        return fallback;
    }
    readPercentage(value, fallback) {
        const parsed = Number(value);
        if (Number.isFinite(parsed) &&
            parsed >= 1 &&
            parsed <= 100) {
            return parsed;
        }
        return fallback;
    }
};
exports.TrafficProtectionService = TrafficProtectionService;
exports.TrafficProtectionService = TrafficProtectionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resilience_state_service_1.ResilienceStateService])
], TrafficProtectionService);
//# sourceMappingURL=traffic-protection.service.js.map