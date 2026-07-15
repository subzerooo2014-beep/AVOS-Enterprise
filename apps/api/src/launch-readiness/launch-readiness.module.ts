import { Module } from "@nestjs/common";
import { LaunchReadinessController } from "./launch-readiness.controller";
import { LaunchOrchestratorService } from "./launch-orchestrator.service";
import { MonetizationService } from "./monetization.service";
import { LaunchReadinessService } from "./launch-readiness.service";
import { SupportSlaService } from "./support-sla.service";
import { LaunchMetricsService } from "./launch-metrics.service";

@Module({
  controllers: [LaunchReadinessController],
  providers: [
    LaunchOrchestratorService,
    MonetizationService,
    LaunchReadinessService,
    SupportSlaService,
    LaunchMetricsService,
  ],
  exports: [
    LaunchOrchestratorService,
    MonetizationService,
    LaunchReadinessService,
    SupportSlaService,
    LaunchMetricsService,
  ],
})
export class LaunchReadinessModule {}