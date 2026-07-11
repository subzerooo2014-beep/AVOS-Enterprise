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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformHardeningV3Controller = void 0;
const common_1 = require("@nestjs/common");
const diagnostics_token_guard_1 = require("../guards/diagnostics-token.guard");
const alert_rule_service_1 = require("../services/alert-rule.service");
const incident_registry_service_1 = require("../services/incident-registry.service");
const platform_hardening_v3_service_1 = require("../services/platform-hardening-v3.service");
const request_metrics_service_1 = require("../services/request-metrics.service");
let PlatformHardeningV3Controller = class PlatformHardeningV3Controller {
    constructor(hardening, metrics, incidents, alerts) {
        this.hardening = hardening;
        this.metrics = metrics;
        this.incidents = incidents;
        this.alerts = alerts;
    }
    getStatus() {
        return this.hardening.getStatus();
    }
    getSnapshot() {
        return this.hardening.getOperationalSnapshot();
    }
    getMetrics() {
        return {
            success: true,
            metrics: this.metrics.getSnapshot(),
        };
    }
    getRecentMetrics(limit = 100) {
        return {
            success: true,
            metrics: this.metrics.getRecent(limit),
        };
    }
    getIncidents() {
        return {
            success: true,
            summary: this.incidents.getSummary(),
            incidents: this.incidents.findAll(),
        };
    }
    getIncident(id) {
        const incident = this.incidents.findOne(id);
        if (!incident) {
            throw new common_1.NotFoundException({
                success: false,
                message: `Incident ${id} was not found`,
            });
        }
        return {
            success: true,
            incident,
        };
    }
    acknowledgeIncident(id) {
        const incident = this.incidents.acknowledge(id);
        if (!incident) {
            throw new common_1.NotFoundException({
                success: false,
                message: `Incident ${id} was not found`,
            });
        }
        return {
            success: true,
            incident,
        };
    }
    resolveIncident(id) {
        const incident = this.incidents.resolve(id);
        if (!incident) {
            throw new common_1.NotFoundException({
                success: false,
                message: `Incident ${id} was not found`,
            });
        }
        return {
            success: true,
            incident,
        };
    }
    getAlerts() {
        return {
            success: true,
            rules: this.alerts.evaluateAll(),
        };
    }
    enableAlert(id) {
        const rule = this.alerts.setEnabled(id, true);
        if (!rule) {
            throw new common_1.NotFoundException({
                success: false,
                message: `Alert rule ${id} was not found`,
            });
        }
        return {
            success: true,
            rule,
        };
    }
    disableAlert(id) {
        const rule = this.alerts.setEnabled(id, false);
        if (!rule) {
            throw new common_1.NotFoundException({
                success: false,
                message: `Alert rule ${id} was not found`,
            });
        }
        return {
            success: true,
            rule,
        };
    }
};
exports.PlatformHardeningV3Controller = PlatformHardeningV3Controller;
__decorate([
    (0, common_1.Get)("status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningV3Controller.prototype, "getStatus", null);
__decorate([
    (0, common_1.Get)("snapshot"),
    (0, common_1.UseGuards)(diagnostics_token_guard_1.DiagnosticsTokenGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningV3Controller.prototype, "getSnapshot", null);
__decorate([
    (0, common_1.Get)("metrics"),
    (0, common_1.UseGuards)(diagnostics_token_guard_1.DiagnosticsTokenGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningV3Controller.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Get)("metrics/recent"),
    (0, common_1.UseGuards)(diagnostics_token_guard_1.DiagnosticsTokenGuard),
    __param(0, (0, common_1.Query)("limit", new common_1.ParseIntPipe({
        optional: true,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PlatformHardeningV3Controller.prototype, "getRecentMetrics", null);
__decorate([
    (0, common_1.Get)("incidents"),
    (0, common_1.UseGuards)(diagnostics_token_guard_1.DiagnosticsTokenGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningV3Controller.prototype, "getIncidents", null);
__decorate([
    (0, common_1.Get)("incidents/:id"),
    (0, common_1.UseGuards)(diagnostics_token_guard_1.DiagnosticsTokenGuard),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlatformHardeningV3Controller.prototype, "getIncident", null);
__decorate([
    (0, common_1.Post)("incidents/:id/acknowledge"),
    (0, common_1.UseGuards)(diagnostics_token_guard_1.DiagnosticsTokenGuard),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlatformHardeningV3Controller.prototype, "acknowledgeIncident", null);
__decorate([
    (0, common_1.Post)("incidents/:id/resolve"),
    (0, common_1.UseGuards)(diagnostics_token_guard_1.DiagnosticsTokenGuard),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlatformHardeningV3Controller.prototype, "resolveIncident", null);
__decorate([
    (0, common_1.Get)("alerts"),
    (0, common_1.UseGuards)(diagnostics_token_guard_1.DiagnosticsTokenGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningV3Controller.prototype, "getAlerts", null);
__decorate([
    (0, common_1.Post)("alerts/:id/enable"),
    (0, common_1.UseGuards)(diagnostics_token_guard_1.DiagnosticsTokenGuard),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlatformHardeningV3Controller.prototype, "enableAlert", null);
__decorate([
    (0, common_1.Post)("alerts/:id/disable"),
    (0, common_1.UseGuards)(diagnostics_token_guard_1.DiagnosticsTokenGuard),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlatformHardeningV3Controller.prototype, "disableAlert", null);
exports.PlatformHardeningV3Controller = PlatformHardeningV3Controller = __decorate([
    (0, common_1.Controller)("platform-hardening/v3"),
    __metadata("design:paramtypes", [platform_hardening_v3_service_1.PlatformHardeningV3Service,
        request_metrics_service_1.RequestMetricsService,
        incident_registry_service_1.IncidentRegistryService,
        alert_rule_service_1.AlertRuleService])
], PlatformHardeningV3Controller);
//# sourceMappingURL=platform-hardening-v3.controller.js.map