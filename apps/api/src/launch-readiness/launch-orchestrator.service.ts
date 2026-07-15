import { Injectable } from "@nestjs/common";
import { LAUNCH_READINESS_CAPABILITIES } from "./launch-readiness.registry";
import { MonetizationService } from "./monetization.service";
import { LaunchReadinessService } from "./launch-readiness.service";
import { SupportSlaService } from "./support-sla.service";
import { LaunchMetricsService } from "./launch-metrics.service";

@Injectable()
export class LaunchOrchestratorService {
  constructor(
    private readonly monetization: MonetizationService,
    private readonly readiness: LaunchReadinessService,
    private readonly support: SupportSlaService,
    private readonly metrics: LaunchMetricsService,
  ) {}

  capabilities() {
    return {
      system: "AVOS Enterprise Launch Readiness & Monetization",
      capabilities: [...LAUNCH_READINESS_CAPABILITIES],
      status: "READY",
    };
  }

  dashboard() {
    return {
      system: "AVOS Enterprise Launch Readiness & Monetization",
      capabilities: LAUNCH_READINESS_CAPABILITIES.length,
      monetization: this.monetization.dashboard(),
      readiness: this.readiness.dashboard(),
      support: this.support.dashboard(),
      metrics: this.metrics.dashboard(),
      generatedAt: new Date().toISOString(),
    };
  }
}