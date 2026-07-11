"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformHardeningV5Module = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const platform_hardening_v3_module_1 = require("../platform-hardening-v3/platform-hardening-v3.module");
const platform_hardening_v5_controller_1 = require("./controllers/platform-hardening-v5.controller");
const v5_diagnostics_token_guard_1 = require("./guards/v5-diagnostics-token.guard");
const policy_enforcement_interceptor_1 = require("./interceptors/policy-enforcement.interceptor");
const audit_ledger_service_1 = require("./services/audit-ledger.service");
const platform_hardening_v5_service_1 = require("./services/platform-hardening-v5.service");
const policy_violation_registry_service_1 = require("./services/policy-violation-registry.service");
const runtime_policy_engine_service_1 = require("./services/runtime-policy-engine.service");
let PlatformHardeningV5Module = class PlatformHardeningV5Module {
};
exports.PlatformHardeningV5Module = PlatformHardeningV5Module;
exports.PlatformHardeningV5Module = PlatformHardeningV5Module = __decorate([
    (0, common_1.Module)({
        imports: [
            platform_hardening_v3_module_1.PlatformHardeningV3Module,
        ],
        controllers: [
            platform_hardening_v5_controller_1.PlatformHardeningV5Controller,
        ],
        providers: [
            v5_diagnostics_token_guard_1.V5DiagnosticsTokenGuard,
            audit_ledger_service_1.AuditLedgerService,
            platform_hardening_v5_service_1.PlatformHardeningV5Service,
            policy_violation_registry_service_1.PolicyViolationRegistryService,
            runtime_policy_engine_service_1.RuntimePolicyEngineService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: policy_enforcement_interceptor_1.PolicyEnforcementInterceptor,
            },
        ],
        exports: [
            audit_ledger_service_1.AuditLedgerService,
            platform_hardening_v5_service_1.PlatformHardeningV5Service,
            policy_violation_registry_service_1.PolicyViolationRegistryService,
            runtime_policy_engine_service_1.RuntimePolicyEngineService,
        ],
    })
], PlatformHardeningV5Module);
//# sourceMappingURL=platform-hardening-v5.module.js.map