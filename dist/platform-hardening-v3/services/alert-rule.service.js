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
exports.AlertRuleService = void 0;
const common_1 = require("@nestjs/common");
const alert_rule_status_enum_1 = require("../enums/alert-rule-status.enum");
const incident_severity_enum_1 = require("../enums/incident-severity.enum");
const request_metrics_service_1 = require("./request-metrics.service");
let AlertRuleService = class AlertRuleService {
    constructor(metrics) {
        this.metrics = metrics;
        this.rules = new Map();
        this.seedDefaultRules();
    }
    evaluateAll() {
        const snapshot = this.metrics.getSnapshot();
        const values = {
            errorRatePercent: snapshot.rates.errorRatePercent,
            slowRequestRatePercent: snapshot.rates.slowRequestRatePercent,
            averageLatencyMs: snapshot.latency.averageMs,
            maximumLatencyMs: snapshot.latency.maximumMs,
            totalFailedRequests: snapshot.totals.failedRequests,
        };
        for (const rule of this.rules.values()) {
            if (!rule.enabled) {
                rule.status = alert_rule_status_enum_1.AlertRuleStatus.DISABLED;
                continue;
            }
            const currentValue = values[rule.metric] ?? 0;
            const triggered = this.compare(currentValue, rule.operator, rule.threshold);
            rule.currentValue = currentValue;
            rule.lastEvaluatedAt =
                new Date().toISOString();
            rule.status = triggered
                ? alert_rule_status_enum_1.AlertRuleStatus.TRIGGERED
                : alert_rule_status_enum_1.AlertRuleStatus.HEALTHY;
            if (triggered) {
                rule.lastTriggeredAt =
                    new Date().toISOString();
            }
            this.rules.set(rule.id, rule);
        }
        return this.findAll();
    }
    findAll() {
        return Array.from(this.rules.values())
            .map((item) => ({ ...item }))
            .sort((left, right) => left.name.localeCompare(right.name));
    }
    setEnabled(id, enabled) {
        const rule = this.rules.get(id);
        if (!rule) {
            return null;
        }
        rule.enabled = enabled;
        rule.status = enabled
            ? alert_rule_status_enum_1.AlertRuleStatus.HEALTHY
            : alert_rule_status_enum_1.AlertRuleStatus.DISABLED;
        this.rules.set(id, rule);
        return { ...rule };
    }
    seedDefaultRules() {
        const defaults = [
            {
                id: "high-error-rate",
                name: "High Error Rate",
                description: "Triggers when request error rate reaches 10 percent",
                metric: "errorRatePercent",
                operator: "gte",
                threshold: 10,
                severity: incident_severity_enum_1.IncidentSeverity.ERROR,
                enabled: true,
                status: alert_rule_status_enum_1.AlertRuleStatus.HEALTHY,
            },
            {
                id: "high-slow-request-rate",
                name: "High Slow Request Rate",
                description: "Triggers when slow request rate reaches 20 percent",
                metric: "slowRequestRatePercent",
                operator: "gte",
                threshold: 20,
                severity: incident_severity_enum_1.IncidentSeverity.WARNING,
                enabled: true,
                status: alert_rule_status_enum_1.AlertRuleStatus.HEALTHY,
            },
            {
                id: "high-average-latency",
                name: "High Average Latency",
                description: "Triggers when average request latency reaches 1000ms",
                metric: "averageLatencyMs",
                operator: "gte",
                threshold: 1000,
                severity: incident_severity_enum_1.IncidentSeverity.WARNING,
                enabled: true,
                status: alert_rule_status_enum_1.AlertRuleStatus.HEALTHY,
            },
            {
                id: "critical-maximum-latency",
                name: "Critical Maximum Latency",
                description: "Triggers when maximum request latency reaches 5000ms",
                metric: "maximumLatencyMs",
                operator: "gte",
                threshold: 5000,
                severity: incident_severity_enum_1.IncidentSeverity.CRITICAL,
                enabled: true,
                status: alert_rule_status_enum_1.AlertRuleStatus.HEALTHY,
            },
        ];
        for (const rule of defaults) {
            this.rules.set(rule.id, rule);
        }
    }
    compare(currentValue, operator, threshold) {
        switch (operator) {
            case "gt":
                return currentValue > threshold;
            case "gte":
                return currentValue >= threshold;
            case "lt":
                return currentValue < threshold;
            case "lte":
                return currentValue <= threshold;
            case "eq":
                return currentValue === threshold;
            default:
                return false;
        }
    }
};
exports.AlertRuleService = AlertRuleService;
exports.AlertRuleService = AlertRuleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [request_metrics_service_1.RequestMetricsService])
], AlertRuleService);
//# sourceMappingURL=alert-rule.service.js.map