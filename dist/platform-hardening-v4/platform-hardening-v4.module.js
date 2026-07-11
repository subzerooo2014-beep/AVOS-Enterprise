"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformHardeningV4Module = void 0;
const common_1 = require("@nestjs/common");
const platform_hardening_v3_module_1 = require("../platform-hardening-v3/platform-hardening-v3.module");
const platform_hardening_v4_controller_1 = require("./controllers/platform-hardening-v4.controller");
const v4_diagnostics_token_guard_1 = require("./guards/v4-diagnostics-token.guard");
const traffic_protection_middleware_1 = require("./middleware/traffic-protection.middleware");
const platform_hardening_v4_service_1 = require("./services/platform-hardening-v4.service");
const resilience_state_service_1 = require("./services/resilience-state.service");
const slo_management_service_1 = require("./services/slo-management.service");
const traffic_protection_service_1 = require("./services/traffic-protection.service");
let PlatformHardeningV4Module = class PlatformHardeningV4Module {
    configure(consumer) {
        consumer
            .apply(traffic_protection_middleware_1.TrafficProtectionMiddleware)
            .forRoutes("*");
    }
};
exports.PlatformHardeningV4Module = PlatformHardeningV4Module;
exports.PlatformHardeningV4Module = PlatformHardeningV4Module = __decorate([
    (0, common_1.Module)({
        imports: [
            platform_hardening_v3_module_1.PlatformHardeningV3Module,
        ],
        controllers: [
            platform_hardening_v4_controller_1.PlatformHardeningV4Controller,
        ],
        providers: [
            v4_diagnostics_token_guard_1.V4DiagnosticsTokenGuard,
            platform_hardening_v4_service_1.PlatformHardeningV4Service,
            resilience_state_service_1.ResilienceStateService,
            slo_management_service_1.SloManagementService,
            traffic_protection_service_1.TrafficProtectionService,
        ],
        exports: [
            platform_hardening_v4_service_1.PlatformHardeningV4Service,
            resilience_state_service_1.ResilienceStateService,
            slo_management_service_1.SloManagementService,
            traffic_protection_service_1.TrafficProtectionService,
        ],
    })
], PlatformHardeningV4Module);
//# sourceMappingURL=platform-hardening-v4.module.js.map