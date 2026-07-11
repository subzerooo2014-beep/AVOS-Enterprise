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
exports.PlatformHardeningV4Controller = void 0;
const common_1 = require("@nestjs/common");
const resilience_mode_enum_1 = require("../enums/resilience-mode.enum");
const v4_diagnostics_token_guard_1 = require("../guards/v4-diagnostics-token.guard");
const platform_hardening_v4_service_1 = require("../services/platform-hardening-v4.service");
const resilience_state_service_1 = require("../services/resilience-state.service");
const slo_management_service_1 = require("../services/slo-management.service");
const traffic_protection_service_1 = require("../services/traffic-protection.service");
let PlatformHardeningV4Controller = class PlatformHardeningV4Controller {
    constructor(hardening, resilience, traffic, slo) {
        this.hardening = hardening;
        this.resilience = resilience;
        this.traffic = traffic;
        this.slo = slo;
    }
    getStatus() {
        return this.hardening.getStatus();
    }
    getSnapshot() {
        return this.hardening.getSnapshot();
    }
    getMode() {
        return {
            success: true,
            resilience: this.resilience.getSnapshot(),
        };
    }
    getTraffic() {
        return {
            success: true,
            policy: this.traffic.getPolicy(),
            state: this.traffic.getState(),
        };
    }
    getSlo() {
        return {
            success: true,
            slo: this.slo.getSummary(),
        };
    }
    getEvents() {
        return {
            success: true,
            events: this.resilience.getRecentEvents(),
        };
    }
    setMode(mode) {
        const normalized = mode.toLowerCase();
        const allowed = Object.values(resilience_mode_enum_1.ResilienceMode);
        if (!allowed.includes(normalized)) {
            return {
                success: false,
                message: `Unsupported resilience mode: ${mode}`,
                allowedModes: allowed,
            };
        }
        return {
            success: true,
            resilience: this.resilience.setMode(normalized),
        };
    }
    enableMaintenance() {
        return {
            success: true,
            resilience: this.resilience.setMode(resilience_mode_enum_1.ResilienceMode.MAINTENANCE, "Manual maintenance enabled through V4 diagnostics"),
        };
    }
    disableMaintenance() {
        return {
            success: true,
            resilience: this.resilience.setMode(resilience_mode_enum_1.ResilienceMode.NORMAL, "Maintenance completed"),
        };
    }
    enableBrownout() {
        return {
            success: true,
            resilience: this.resilience.setMode(resilience_mode_enum_1.ResilienceMode.BROWNOUT, "Brownout mode enabled"),
        };
    }
    disableBrownout() {
        return {
            success: true,
            resilience: this.resilience.setMode(resilience_mode_enum_1.ResilienceMode.NORMAL, "Brownout mode disabled"),
        };
    }
    enableEmergency() {
        return {
            success: true,
            resilience: this.resilience.setMode(resilience_mode_enum_1.ResilienceMode.EMERGENCY, "Emergency protection enabled"),
        };
    }
    disableEmergency() {
        return {
            success: true,
            resilience: this.resilience.setMode(resilience_mode_enum_1.ResilienceMode.NORMAL, "Emergency protection disabled"),
        };
    }
};
exports.PlatformHardeningV4Controller = PlatformHardeningV4Controller;
__decorate([
    (0, common_1.Get)("status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningV4Controller.prototype, "getStatus", null);
__decorate([
    (0, common_1.Get)("snapshot"),
    (0, common_1.UseGuards)(v4_diagnostics_token_guard_1.V4DiagnosticsTokenGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningV4Controller.prototype, "getSnapshot", null);
__decorate([
    (0, common_1.Get)("mode"),
    (0, common_1.UseGuards)(v4_diagnostics_token_guard_1.V4DiagnosticsTokenGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningV4Controller.prototype, "getMode", null);
__decorate([
    (0, common_1.Get)("traffic"),
    (0, common_1.UseGuards)(v4_diagnostics_token_guard_1.V4DiagnosticsTokenGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningV4Controller.prototype, "getTraffic", null);
__decorate([
    (0, common_1.Get)("slo"),
    (0, common_1.UseGuards)(v4_diagnostics_token_guard_1.V4DiagnosticsTokenGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningV4Controller.prototype, "getSlo", null);
__decorate([
    (0, common_1.Get)("events"),
    (0, common_1.UseGuards)(v4_diagnostics_token_guard_1.V4DiagnosticsTokenGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningV4Controller.prototype, "getEvents", null);
__decorate([
    (0, common_1.Post)("mode/:mode"),
    (0, common_1.UseGuards)(v4_diagnostics_token_guard_1.V4DiagnosticsTokenGuard),
    __param(0, (0, common_1.Param)("mode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlatformHardeningV4Controller.prototype, "setMode", null);
__decorate([
    (0, common_1.Post)("maintenance/enable"),
    (0, common_1.UseGuards)(v4_diagnostics_token_guard_1.V4DiagnosticsTokenGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningV4Controller.prototype, "enableMaintenance", null);
__decorate([
    (0, common_1.Post)("maintenance/disable"),
    (0, common_1.UseGuards)(v4_diagnostics_token_guard_1.V4DiagnosticsTokenGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningV4Controller.prototype, "disableMaintenance", null);
__decorate([
    (0, common_1.Post)("brownout/enable"),
    (0, common_1.UseGuards)(v4_diagnostics_token_guard_1.V4DiagnosticsTokenGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningV4Controller.prototype, "enableBrownout", null);
__decorate([
    (0, common_1.Post)("brownout/disable"),
    (0, common_1.UseGuards)(v4_diagnostics_token_guard_1.V4DiagnosticsTokenGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningV4Controller.prototype, "disableBrownout", null);
__decorate([
    (0, common_1.Post)("emergency/enable"),
    (0, common_1.UseGuards)(v4_diagnostics_token_guard_1.V4DiagnosticsTokenGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningV4Controller.prototype, "enableEmergency", null);
__decorate([
    (0, common_1.Post)("emergency/disable"),
    (0, common_1.UseGuards)(v4_diagnostics_token_guard_1.V4DiagnosticsTokenGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningV4Controller.prototype, "disableEmergency", null);
exports.PlatformHardeningV4Controller = PlatformHardeningV4Controller = __decorate([
    (0, common_1.Controller)("platform-hardening/v4"),
    __metadata("design:paramtypes", [platform_hardening_v4_service_1.PlatformHardeningV4Service,
        resilience_state_service_1.ResilienceStateService,
        traffic_protection_service_1.TrafficProtectionService,
        slo_management_service_1.SloManagementService])
], PlatformHardeningV4Controller);
//# sourceMappingURL=platform-hardening-v4.controller.js.map