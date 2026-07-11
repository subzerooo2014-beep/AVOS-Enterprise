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
exports.PlatformHardeningV2Service = void 0;
const common_1 = require("@nestjs/common");
const circuit_breaker_service_1 = require("./circuit-breaker.service");
const dependency_health_registry_service_1 = require("./dependency-health-registry.service");
const operational_readiness_service_1 = require("./operational-readiness.service");
const runtime_metrics_service_1 = require("./runtime-metrics.service");
let PlatformHardeningV2Service = class PlatformHardeningV2Service {
    constructor(readiness, metrics, dependencyRegistry, circuitBreaker) {
        this.readiness = readiness;
        this.metrics = metrics;
        this.dependencyRegistry = dependencyRegistry;
        this.circuitBreaker = circuitBreaker;
    }
    getStatus() {
        return {
            success: true,
            system: "AVOS Platform Hardening",
            version: "v2",
            phase: "resilience-and-operational-readiness",
            environment: process.env.NODE_ENV ?? "development",
            live: true,
            capabilities: {
                livenessChecks: true,
                readinessChecks: true,
                dependencyHealthRegistry: true,
                runtimeMetrics: true,
                timeoutProtection: true,
                retryPolicies: true,
                circuitBreakers: true,
                degradedStateDetection: true,
                databaseProbe: true,
                eventLoopProbe: true,
                memoryProbe: true,
            },
            registeredDependencyChecks: this.dependencyRegistry.listRegisteredChecks(),
            timestamp: new Date().toISOString(),
            uptimeSeconds: Number(process.uptime().toFixed(3)),
        };
    }
    async getOperationalSnapshot() {
        const [readiness, metrics] = await Promise.all([
            this.readiness.getReadiness(),
            this.metrics.getMetrics(),
        ]);
        return {
            success: readiness.ready,
            system: "AVOS Enterprise Production",
            hardeningVersion: "v2",
            readiness,
            metrics,
            circuits: this.circuitBreaker.getAllSnapshots(),
            generatedAt: new Date().toISOString(),
        };
    }
};
exports.PlatformHardeningV2Service = PlatformHardeningV2Service;
exports.PlatformHardeningV2Service = PlatformHardeningV2Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [operational_readiness_service_1.OperationalReadinessService,
        runtime_metrics_service_1.RuntimeMetricsService,
        dependency_health_registry_service_1.DependencyHealthRegistryService,
        circuit_breaker_service_1.CircuitBreakerService])
], PlatformHardeningV2Service);
//# sourceMappingURL=platform-hardening-v2.service.js.map