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
exports.PlatformHardeningV2Controller = void 0;
const common_1 = require("@nestjs/common");
const circuit_breaker_service_1 = require("../services/circuit-breaker.service");
const dependency_health_registry_service_1 = require("../services/dependency-health-registry.service");
const operational_readiness_service_1 = require("../services/operational-readiness.service");
const platform_hardening_v2_service_1 = require("../services/platform-hardening-v2.service");
const runtime_metrics_service_1 = require("../services/runtime-metrics.service");
let PlatformHardeningV2Controller = class PlatformHardeningV2Controller {
    constructor(hardening, readiness, metrics, dependencies, circuits) {
        this.hardening = hardening;
        this.readiness = readiness;
        this.metrics = metrics;
        this.dependencies = dependencies;
        this.circuits = circuits;
    }
    getStatus() {
        return this.hardening.getStatus();
    }
    getLiveness() {
        return this.readiness.getLiveness();
    }
    async getReadiness() {
        return this.readiness.getReadiness();
    }
    async getOperationalSnapshot() {
        return this.hardening.getOperationalSnapshot();
    }
    async getRuntimeMetrics() {
        return {
            success: true,
            metrics: await this.metrics.getMetrics(),
        };
    }
    async getDependencies() {
        return {
            success: true,
            checks: await this.dependencies.runAll(),
        };
    }
    async getDependency(name) {
        const result = await this.dependencies.runOne(name);
        if (!result) {
            throw new common_1.NotFoundException({
                success: false,
                message: `Dependency check ${name} was not found`,
            });
        }
        return {
            success: true,
            check: result,
        };
    }
    getCircuits() {
        return {
            success: true,
            circuits: this.circuits.getAllSnapshots(),
        };
    }
    resetCircuit(name) {
        return {
            success: true,
            circuit: this.circuits.reset(name),
        };
    }
};
exports.PlatformHardeningV2Controller = PlatformHardeningV2Controller;
__decorate([
    (0, common_1.Get)("status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningV2Controller.prototype, "getStatus", null);
__decorate([
    (0, common_1.Get)("live"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningV2Controller.prototype, "getLiveness", null);
__decorate([
    (0, common_1.Get)("ready"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlatformHardeningV2Controller.prototype, "getReadiness", null);
__decorate([
    (0, common_1.Get)("snapshot"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlatformHardeningV2Controller.prototype, "getOperationalSnapshot", null);
__decorate([
    (0, common_1.Get)("metrics"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlatformHardeningV2Controller.prototype, "getRuntimeMetrics", null);
__decorate([
    (0, common_1.Get)("dependencies"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlatformHardeningV2Controller.prototype, "getDependencies", null);
__decorate([
    (0, common_1.Get)("dependencies/:name"),
    __param(0, (0, common_1.Param)("name")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlatformHardeningV2Controller.prototype, "getDependency", null);
__decorate([
    (0, common_1.Get)("circuits"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlatformHardeningV2Controller.prototype, "getCircuits", null);
__decorate([
    (0, common_1.Post)("circuits/:name/reset"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("name")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlatformHardeningV2Controller.prototype, "resetCircuit", null);
exports.PlatformHardeningV2Controller = PlatformHardeningV2Controller = __decorate([
    (0, common_1.Controller)("platform-hardening/v2"),
    __metadata("design:paramtypes", [platform_hardening_v2_service_1.PlatformHardeningV2Service,
        operational_readiness_service_1.OperationalReadinessService,
        runtime_metrics_service_1.RuntimeMetricsService,
        dependency_health_registry_service_1.DependencyHealthRegistryService,
        circuit_breaker_service_1.CircuitBreakerService])
], PlatformHardeningV2Controller);
//# sourceMappingURL=platform-hardening-v2.controller.js.map