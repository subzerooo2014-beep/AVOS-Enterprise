import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from "@nestjs/common";
import {
  APP_FILTER,
  APP_INTERCEPTOR,
} from "@nestjs/core";
import { PlatformHardeningV3Controller } from "./controllers/platform-hardening-v3.controller";
import { GlobalObservabilityExceptionFilter } from "./filters/global-observability-exception.filter";
import { DiagnosticsTokenGuard } from "./guards/diagnostics-token.guard";
import { RequestObservabilityInterceptor } from "./interceptors/request-observability.interceptor";
import { RequestCorrelationMiddleware } from "./middleware/request-correlation.middleware";
import { AlertRuleService } from "./services/alert-rule.service";
import { ErrorClassificationService } from "./services/error-classification.service";
import { FailureFingerprintService } from "./services/failure-fingerprint.service";
import { IncidentRegistryService } from "./services/incident-registry.service";
import { PlatformHardeningV3Service } from "./services/platform-hardening-v3.service";
import { RequestContextService } from "./services/request-context.service";
import { RequestMetricsService } from "./services/request-metrics.service";
import { StructuredLoggerService } from "./services/structured-logger.service";

@Module({
  controllers: [
    PlatformHardeningV3Controller,
  ],
  providers: [
    AlertRuleService,
    DiagnosticsTokenGuard,
    ErrorClassificationService,
    FailureFingerprintService,
    IncidentRegistryService,
    PlatformHardeningV3Service,
    RequestContextService,
    RequestMetricsService,
    StructuredLoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass:
        RequestObservabilityInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass:
        GlobalObservabilityExceptionFilter,
    },
  ],
  exports: [
    AlertRuleService,
    ErrorClassificationService,
    FailureFingerprintService,
    IncidentRegistryService,
    PlatformHardeningV3Service,
    RequestContextService,
    RequestMetricsService,
    StructuredLoggerService,
  ],
})
export class PlatformHardeningV3Module
  implements NestModule
{
  configure(
    consumer: MiddlewareConsumer,
  ): void {
    consumer
      .apply(RequestCorrelationMiddleware)
      .forRoutes("*");
  }
}
