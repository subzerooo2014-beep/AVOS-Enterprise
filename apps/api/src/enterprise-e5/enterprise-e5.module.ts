import { Module } from "@nestjs/common";
import { EnterpriseCacheService } from "./enterprise-cache.service";
import { EnterpriseCircuitBreakerService } from "./enterprise-circuit-breaker.service";
import { EnterpriseCommandBusService } from "./enterprise-command-bus.service";
import { EnterpriseE5Controller } from "./enterprise-e5.controller";
import { EnterpriseE5OrchestratorService } from "./enterprise-e5-orchestrator.service";
import { EnterpriseEventMeshService } from "./enterprise-event-mesh.service";
import { EnterpriseRateLimiterService } from "./enterprise-rate-limiter.service";
import { EnterpriseRuntimeAnalyticsService } from "./enterprise-runtime-analytics.service";
import { EnterpriseSchedulerService } from "./enterprise-scheduler.service";
import { EnterpriseServiceDiscoveryService } from "./enterprise-service-discovery.service";

@Module({
  controllers: [EnterpriseE5Controller],
  providers: [
    EnterpriseEventMeshService,
    EnterpriseCommandBusService,
    EnterpriseSchedulerService,
    EnterpriseCircuitBreakerService,
    EnterpriseRateLimiterService,
    EnterpriseCacheService,
    EnterpriseServiceDiscoveryService,
    EnterpriseRuntimeAnalyticsService,
    EnterpriseE5OrchestratorService,
  ],
  exports: [
    EnterpriseEventMeshService,
    EnterpriseCommandBusService,
    EnterpriseSchedulerService,
    EnterpriseCircuitBreakerService,
    EnterpriseRateLimiterService,
    EnterpriseCacheService,
    EnterpriseServiceDiscoveryService,
    EnterpriseRuntimeAnalyticsService,
    EnterpriseE5OrchestratorService,
  ],
})
export class EnterpriseE5Module {}