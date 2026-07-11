import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { PlatformHardeningV3Module } from "../platform-hardening-v3/platform-hardening-v3.module";
import { PlatformHardeningV5Controller } from "./controllers/platform-hardening-v5.controller";
import { V5DiagnosticsTokenGuard } from "./guards/v5-diagnostics-token.guard";
import { PolicyEnforcementInterceptor } from "./interceptors/policy-enforcement.interceptor";
import { AuditLedgerService } from "./services/audit-ledger.service";
import { PlatformHardeningV5Service } from "./services/platform-hardening-v5.service";
import { PolicyViolationRegistryService } from "./services/policy-violation-registry.service";
import { RuntimePolicyEngineService } from "./services/runtime-policy-engine.service";

@Module({
  imports: [
    PlatformHardeningV3Module,
  ],
  controllers: [
    PlatformHardeningV5Controller,
  ],
  providers: [
    V5DiagnosticsTokenGuard,
    AuditLedgerService,
    PlatformHardeningV5Service,
    PolicyViolationRegistryService,
    RuntimePolicyEngineService,
    {
      provide: APP_INTERCEPTOR,
      useClass:
        PolicyEnforcementInterceptor,
    },
  ],
  exports: [
    AuditLedgerService,
    PlatformHardeningV5Service,
    PolicyViolationRegistryService,
    RuntimePolicyEngineService,
  ],
})
export class PlatformHardeningV5Module {}
