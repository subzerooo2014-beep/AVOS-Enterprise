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
exports.OperationalReadinessService = void 0;
const common_1 = require("@nestjs/common");
const dependency_status_enum_1 = require("../enums/dependency-status.enum");
const readiness_state_enum_1 = require("../enums/readiness-state.enum");
const dependency_health_registry_service_1 = require("./dependency-health-registry.service");
let OperationalReadinessService = class OperationalReadinessService {
    constructor(dependencyRegistry) {
        this.dependencyRegistry = dependencyRegistry;
    }
    getLiveness() {
        return {
            success: true,
            live: true,
            system: "AVOS Enterprise Production",
            component: "Production Hardening V2",
            version: "v2",
            processId: process.pid,
            uptimeSeconds: Number(process.uptime().toFixed(3)),
            timestamp: new Date().toISOString(),
        };
    }
    async getReadiness() {
        const dependencies = await this.dependencyRegistry.runAll();
        const summary = {
            total: dependencies.length,
            healthy: dependencies.filter((item) => item.status === dependency_status_enum_1.DependencyStatus.HEALTHY).length,
            degraded: dependencies.filter((item) => item.status === dependency_status_enum_1.DependencyStatus.DEGRADED).length,
            unhealthy: dependencies.filter((item) => item.status === dependency_status_enum_1.DependencyStatus.UNHEALTHY).length,
            unknown: dependencies.filter((item) => item.status === dependency_status_enum_1.DependencyStatus.UNKNOWN).length,
            criticalFailures: dependencies.filter((item) => item.critical &&
                item.status === dependency_status_enum_1.DependencyStatus.UNHEALTHY).length,
        };
        const ready = summary.criticalFailures === 0;
        let state = readiness_state_enum_1.ReadinessState.READY;
        if (!ready) {
            state = readiness_state_enum_1.ReadinessState.NOT_READY;
        }
        else if (summary.degraded > 0 ||
            summary.unhealthy > 0 ||
            summary.unknown > 0) {
            state = readiness_state_enum_1.ReadinessState.DEGRADED;
        }
        return {
            system: "AVOS Enterprise Production",
            version: "Production Hardening V2",
            environment: process.env.NODE_ENV ?? "development",
            state,
            ready,
            live: true,
            timestamp: new Date().toISOString(),
            uptimeSeconds: Number(process.uptime().toFixed(3)),
            dependencies,
            summary,
        };
    }
};
exports.OperationalReadinessService = OperationalReadinessService;
exports.OperationalReadinessService = OperationalReadinessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [dependency_health_registry_service_1.DependencyHealthRegistryService])
], OperationalReadinessService);
//# sourceMappingURL=operational-readiness.service.js.map