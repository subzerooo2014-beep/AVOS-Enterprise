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
exports.PlatformHardeningV4Service = void 0;
const common_1 = require("@nestjs/common");
const resilience_state_service_1 = require("./resilience-state.service");
const slo_management_service_1 = require("./slo-management.service");
const traffic_protection_service_1 = require("./traffic-protection.service");
let PlatformHardeningV4Service = class PlatformHardeningV4Service {
    constructor(resilience, traffic, slo) {
        this.resilience = resilience;
        this.traffic = traffic;
        this.slo = slo;
    }
    getStatus() {
        return {
            success: true,
            system: "AVOS Platform Hardening",
            version: "v4",
            phase: "resilience-slo-and-traffic-protection",
            environment: process.env.NODE_ENV ?? "development",
            capabilities: {
                requestRateProtection: true,
                concurrencyProtection: true,
                loadShedding: true,
                maintenanceMode: true,
                brownoutMode: true,
                emergencyMode: true,
                serviceLevelObjectives: true,
                errorBudgetTracking: true,
                runtimeTrafficPolicies: true,
                protectedDiagnostics: true,
            },
            resilience: this.resilience.getSnapshot(),
            timestamp: new Date().toISOString(),
            uptimeSeconds: Number(process.uptime().toFixed(3)),
        };
    }
    getSnapshot() {
        return {
            success: true,
            system: "AVOS Enterprise Production",
            hardeningVersion: "v4",
            generatedAt: new Date().toISOString(),
            resilience: this.resilience.getSnapshot(),
            traffic: {
                policy: this.traffic.getPolicy(),
                state: this.traffic.getState(),
            },
            slo: this.slo.getSummary(),
            recentEvents: this.resilience.getRecentEvents(25),
        };
    }
};
exports.PlatformHardeningV4Service = PlatformHardeningV4Service;
exports.PlatformHardeningV4Service = PlatformHardeningV4Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resilience_state_service_1.ResilienceStateService,
        traffic_protection_service_1.TrafficProtectionService,
        slo_management_service_1.SloManagementService])
], PlatformHardeningV4Service);
//# sourceMappingURL=platform-hardening-v4.service.js.map