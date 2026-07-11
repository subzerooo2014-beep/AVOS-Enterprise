import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { PlatformHardeningV2Controller } from "./controllers/platform-hardening-v2.controller";
import { CircuitBreakerService } from "./services/circuit-breaker.service";
import { DependencyHealthRegistryService } from "./services/dependency-health-registry.service";
import { OperationalReadinessService } from "./services/operational-readiness.service";
import { PlatformHardeningV2Service } from "./services/platform-hardening-v2.service";
import { RetryPolicyService } from "./services/retry-policy.service";
import { RuntimeMetricsService } from "./services/runtime-metrics.service";

@Module({
  imports: [PrismaModule],
  controllers: [PlatformHardeningV2Controller],
  providers: [
    CircuitBreakerService,
    DependencyHealthRegistryService,
    OperationalReadinessService,
    PlatformHardeningV2Service,
    RetryPolicyService,
    RuntimeMetricsService,
  ],
  exports: [
    CircuitBreakerService,
    DependencyHealthRegistryService,
    OperationalReadinessService,
    PlatformHardeningV2Service,
    RetryPolicyService,
    RuntimeMetricsService,
  ],
})
export class PlatformHardeningV2Module {}
