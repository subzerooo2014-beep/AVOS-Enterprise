import { Module } from "@nestjs/common";
import { AdaptiveRecoveryService } from "./adaptive-recovery.service";
import { BulkheadIsolationService } from "./bulkhead-isolation.service";
import { ChaosEngineeringService } from "./chaos-engineering.service";
import { CircuitBreakerCenterService } from "./circuit-breaker-center.service";
import { EnterpriseResiliencePlatformController } from "./enterprise-resilience-platform.controller";
import { EnterpriseResiliencePlatformService } from "./enterprise-resilience-platform.service";
import { FailoverRouterService } from "./failover-router.service";
import { RateLimiterService } from "./rate-limiter.service";
import { RetryFrameworkService } from "./retry-framework.service";
import { SloSliEngineService } from "./slo-sli-engine.service";
import { TimeoutManagerService } from "./timeout-manager.service";

@Module({
  controllers: [EnterpriseResiliencePlatformController],
  providers: [
    AdaptiveRecoveryService,
    BulkheadIsolationService,
    ChaosEngineeringService,
    CircuitBreakerCenterService,
    EnterpriseResiliencePlatformService,
    FailoverRouterService,
    RateLimiterService,
    RetryFrameworkService,
    SloSliEngineService,
    TimeoutManagerService,
  ],
  exports: [
    AdaptiveRecoveryService,
    BulkheadIsolationService,
    ChaosEngineeringService,
    CircuitBreakerCenterService,
    EnterpriseResiliencePlatformService,
    FailoverRouterService,
    RateLimiterService,
    RetryFrameworkService,
    SloSliEngineService,
    TimeoutManagerService,
  ],
})
export class EnterpriseResiliencePlatformModule {}
