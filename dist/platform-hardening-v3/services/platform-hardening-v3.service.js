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
exports.PlatformHardeningV3Service = void 0;
const common_1 = require("@nestjs/common");
const alert_rule_service_1 = require("./alert-rule.service");
const incident_registry_service_1 = require("./incident-registry.service");
const request_metrics_service_1 = require("./request-metrics.service");
let PlatformHardeningV3Service = class PlatformHardeningV3Service {
    constructor(metrics, incidents, alerts) {
        this.metrics = metrics;
        this.incidents = incidents;
        this.alerts = alerts;
    }
    getStatus() {
        return {
            success: true,
            system: "AVOS Platform Hardening",
            version: "v3",
            phase: "observability-and-incident-intelligence",
            environment: process.env.NODE_ENV ?? "development",
            capabilities: {
                globalRequestCorrelation: true,
                distributedTraceContext: true,
                structuredEnterpriseLogging: true,
                requestResponseMetrics: true,
                slowRequestDetection: true,
                errorClassification: true,
                operationalIncidentRegistry: true,
                failureFingerprinting: true,
                runtimeAlertRules: true,
                protectedDiagnostics: true,
            },
            configuration: {
                slowRequestThresholdMs: Number(process.env
                    .AVOS_SLOW_REQUEST_THRESHOLD_MS ??
                    750),
                diagnosticsProtection: true,
                diagnosticsHeader: "x-avos-diagnostics-token",
            },
            timestamp: new Date().toISOString(),
            uptimeSeconds: Number(process.uptime().toFixed(3)),
        };
    }
    getOperationalSnapshot() {
        const metrics = this.metrics.getSnapshot();
        const alertRules = this.alerts.evaluateAll();
        return {
            success: true,
            system: "AVOS Enterprise Production",
            hardeningVersion: "v3",
            generatedAt: new Date().toISOString(),
            metrics,
            incidents: this.incidents.getSummary(),
            alerts: {
                total: alertRules.length,
                triggered: alertRules.filter((item) => item.status === "triggered").length,
                rules: alertRules,
            },
        };
    }
};
exports.PlatformHardeningV3Service = PlatformHardeningV3Service;
exports.PlatformHardeningV3Service = PlatformHardeningV3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [request_metrics_service_1.RequestMetricsService,
        incident_registry_service_1.IncidentRegistryService,
        alert_rule_service_1.AlertRuleService])
], PlatformHardeningV3Service);
//# sourceMappingURL=platform-hardening-v3.service.js.map