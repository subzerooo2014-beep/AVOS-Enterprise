"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformHardeningV2Module = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const platform_hardening_v2_controller_1 = require("./controllers/platform-hardening-v2.controller");
const circuit_breaker_service_1 = require("./services/circuit-breaker.service");
const dependency_health_registry_service_1 = require("./services/dependency-health-registry.service");
const operational_readiness_service_1 = require("./services/operational-readiness.service");
const platform_hardening_v2_service_1 = require("./services/platform-hardening-v2.service");
const retry_policy_service_1 = require("./services/retry-policy.service");
const runtime_metrics_service_1 = require("./services/runtime-metrics.service");
let PlatformHardeningV2Module = class PlatformHardeningV2Module {
};
exports.PlatformHardeningV2Module = PlatformHardeningV2Module;
exports.PlatformHardeningV2Module = PlatformHardeningV2Module = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [platform_hardening_v2_controller_1.PlatformHardeningV2Controller],
        providers: [
            circuit_breaker_service_1.CircuitBreakerService,
            dependency_health_registry_service_1.DependencyHealthRegistryService,
            operational_readiness_service_1.OperationalReadinessService,
            platform_hardening_v2_service_1.PlatformHardeningV2Service,
            retry_policy_service_1.RetryPolicyService,
            runtime_metrics_service_1.RuntimeMetricsService,
        ],
        exports: [
            circuit_breaker_service_1.CircuitBreakerService,
            dependency_health_registry_service_1.DependencyHealthRegistryService,
            operational_readiness_service_1.OperationalReadinessService,
            platform_hardening_v2_service_1.PlatformHardeningV2Service,
            retry_policy_service_1.RetryPolicyService,
            runtime_metrics_service_1.RuntimeMetricsService,
        ],
    })
], PlatformHardeningV2Module);
//# sourceMappingURL=platform-hardening-v2.module.js.map