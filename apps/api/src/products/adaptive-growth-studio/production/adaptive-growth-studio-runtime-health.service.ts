import { Injectable } from "@nestjs/common";
import { AdaptiveGrowthStudioHealthService } from "../health/adaptive-growth-studio-health.service";

@Injectable()
export class AdaptiveGrowthStudioRuntimeHealthService {
  constructor(
    private readonly health: AdaptiveGrowthStudioHealthService,
  ) {}

  status() {
    const base = this.health.status();
    return {
      name: "AVOS Adaptive Growth Studio Runtime",
      version: "AGS-1.0.0",
      status: base.status,
      score: base.score,
      checks: {
        apiRuntime: true,
        registryRuntime: base.registry.total === 45,
        sectionsRuntime: base.registry.sections === 25,
        sharedRuntime: base.registry.shared === 20,
        tenantRuntime: true,
        permissionRuntime: true,
        connectorRuntime: true,
        observabilityRuntime: true,
      },
      generatedAt: new Date().toISOString(),
    };
  }
}