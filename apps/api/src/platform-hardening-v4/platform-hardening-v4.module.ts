import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from "@nestjs/common";
import { PlatformHardeningV3Module } from "../platform-hardening-v3/platform-hardening-v3.module";
import { PlatformHardeningV4Controller } from "./controllers/platform-hardening-v4.controller";
import { V4DiagnosticsTokenGuard } from "./guards/v4-diagnostics-token.guard";
import { TrafficProtectionMiddleware } from "./middleware/traffic-protection.middleware";
import { PlatformHardeningV4Service } from "./services/platform-hardening-v4.service";
import { ResilienceStateService } from "./services/resilience-state.service";
import { SloManagementService } from "./services/slo-management.service";
import { TrafficProtectionService } from "./services/traffic-protection.service";

@Module({
  imports: [
    PlatformHardeningV3Module,
  ],
  controllers: [
    PlatformHardeningV4Controller,
  ],
  providers: [
    V4DiagnosticsTokenGuard,
    PlatformHardeningV4Service,
    ResilienceStateService,
    SloManagementService,
    TrafficProtectionService,
  ],
  exports: [
    PlatformHardeningV4Service,
    ResilienceStateService,
    SloManagementService,
    TrafficProtectionService,
  ],
})
export class PlatformHardeningV4Module
  implements NestModule
{
  configure(
    consumer: MiddlewareConsumer,
  ): void {
    consumer
      .apply(TrafficProtectionMiddleware)
      .forRoutes("*");
  }
}
