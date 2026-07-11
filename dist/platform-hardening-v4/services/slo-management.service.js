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
exports.SloManagementService = void 0;
const common_1 = require("@nestjs/common");
const slo_status_enum_1 = require("../enums/slo-status.enum");
const request_metrics_service_1 = require("../../platform-hardening-v3/services/request-metrics.service");
let SloManagementService = class SloManagementService {
    constructor(metrics) {
        this.metrics = metrics;
    }
    evaluate() {
        const snapshot = this.metrics.getSnapshot();
        const total = snapshot.totals.requests;
        const availabilityPercent = total > 0
            ? Number(((snapshot.totals.successfulRequests /
                total) *
                100).toFixed(3))
            : 100;
        return [
            this.buildObjective({
                id: "availability",
                name: "Platform Availability",
                description: "Successful request availability objective",
                metric: "availabilityPercent",
                comparison: "gte",
                target: 99.9,
                currentValue: availabilityPercent,
            }),
            this.buildObjective({
                id: "error-rate",
                name: "Request Error Rate",
                description: "Maximum acceptable request error rate",
                metric: "errorRatePercent",
                comparison: "lte",
                target: 1,
                currentValue: snapshot.rates.errorRatePercent,
            }),
            this.buildObjective({
                id: "average-latency",
                name: "Average Request Latency",
                description: "Maximum acceptable average latency",
                metric: "averageLatencyMs",
                comparison: "lte",
                target: 500,
                currentValue: snapshot.latency.averageMs,
            }),
            this.buildObjective({
                id: "slow-request-rate",
                name: "Slow Request Rate",
                description: "Maximum acceptable slow request ratio",
                metric: "slowRequestRatePercent",
                comparison: "lte",
                target: 5,
                currentValue: snapshot.rates.slowRequestRatePercent,
            }),
        ];
    }
    getSummary() {
        const objectives = this.evaluate();
        return {
            total: objectives.length,
            healthy: objectives.filter((item) => item.status === slo_status_enum_1.SloStatus.HEALTHY).length,
            atRisk: objectives.filter((item) => item.status === slo_status_enum_1.SloStatus.AT_RISK).length,
            breached: objectives.filter((item) => item.status === slo_status_enum_1.SloStatus.BREACHED).length,
            minimumErrorBudgetRemainingPercent: objectives.length > 0
                ? Math.min(...objectives.map((item) => item.errorBudgetRemainingPercent))
                : 100,
            objectives,
        };
    }
    buildObjective(input) {
        const passed = input.comparison === "gte"
            ? input.currentValue >= input.target
            : input.currentValue <= input.target;
        const violationPercent = this.calculateViolationPercent(input.currentValue, input.target, input.comparison);
        let status;
        if (passed) {
            status = slo_status_enum_1.SloStatus.HEALTHY;
        }
        else if (violationPercent <= 20) {
            status = slo_status_enum_1.SloStatus.AT_RISK;
        }
        else {
            status = slo_status_enum_1.SloStatus.BREACHED;
        }
        const errorBudgetRemainingPercent = this.calculateErrorBudgetRemainingPercent(input.currentValue, input.target, input.comparison);
        return {
            ...input,
            currentValue: Number(input.currentValue.toFixed(3)),
            status,
            errorBudgetRemainingPercent: Number(errorBudgetRemainingPercent.toFixed(2)),
            evaluatedAt: new Date().toISOString(),
        };
    }
    calculateViolationPercent(current, target, comparison) {
        if (target === 0) {
            if (comparison === "lte") {
                return current <= 0 ? 0 : 100;
            }
            return current >= 0 ? 0 : 100;
        }
        if (comparison === "gte") {
            if (current >= target) {
                return 0;
            }
            return Math.max(0, ((target - current) / target) * 100);
        }
        if (current <= target) {
            return 0;
        }
        return Math.max(0, ((current - target) / target) * 100);
    }
    calculateErrorBudgetRemainingPercent(current, target, comparison) {
        if (comparison === "lte") {
            if (target <= 0) {
                return current <= 0 ? 100 : 0;
            }
            const consumedPercent = (current / target) * 100;
            return this.clamp(100 - consumedPercent, 0, 100);
        }
        if (target >= 100) {
            return current >= target ? 100 : 0;
        }
        const allowedFailure = 100 - target;
        const actualFailure = 100 - current;
        if (allowedFailure <= 0) {
            return actualFailure <= 0 ? 100 : 0;
        }
        const consumedPercent = (actualFailure / allowedFailure) * 100;
        return this.clamp(100 - consumedPercent, 0, 100);
    }
    clamp(value, minimum, maximum) {
        return Math.min(maximum, Math.max(minimum, value));
    }
};
exports.SloManagementService = SloManagementService;
exports.SloManagementService = SloManagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [request_metrics_service_1.RequestMetricsService])
], SloManagementService);
//# sourceMappingURL=slo-management.service.js.map