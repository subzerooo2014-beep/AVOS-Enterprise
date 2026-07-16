import { Injectable } from "@nestjs/common";
import { AdvancedTwinRegistryService } from "./advanced-twin-registry.service";
import { TwinInsightEngineService } from "./twin-insight-engine.service";
import { TwinScenarioLaboratoryService } from "./twin-scenario-laboratory.service";
import { TwinStateSynchronizationService } from "./twin-state-synchronization.service";
import type {
  AdvancedTwinHealth,
  AdvancedTwinMetrics,
} from "./enterprise-advanced-digital-twin.types";

@Injectable()
export class EnterpriseAdvancedDigitalTwinPlatformService {
  constructor(
    private readonly twins: AdvancedTwinRegistryService,
    private readonly synchronization: TwinStateSynchronizationService,
    private readonly scenarios: TwinScenarioLaboratoryService,
    private readonly insights: TwinInsightEngineService,
  ) {}

  metrics(): AdvancedTwinMetrics {
    return {
      twins: this.twins.count(),
      activeTwins: this.twins.activeCount(),
      degradedTwins: this.twins.degradedCount(),
      snapshots: this.synchronization.snapshotCount(),
      synchronizations: this.synchronization.synchronizationCount(),
      failedSynchronizations:
        this.synchronization.failedSynchronizationCount(),
      scenarios: this.scenarios.scenarioCount(),
      simulations: this.scenarios.simulationCount(),
      insights: this.insights.count(),
      criticalInsights: this.insights.criticalCount(),
    };
  }

  health(): AdvancedTwinHealth {
    const metrics = this.metrics();

    return {
      success: true,
      system: "AVOS Enterprise Advanced Digital Twin Platform",
      version: "1.0.0",
      status:
        metrics.degradedTwins > 0 ||
        metrics.failedSynchronizations > 0 ||
        metrics.criticalInsights > 0
          ? "DEGRADED"
          : "READY",
      metrics,
      components: {
        digitalTwinRegistry: "READY",
        assetTwinEngine: "READY",
        processTwinEngine: "READY",
        organizationTwin: "READY",
        scenarioSimulation: "READY",
        whatIfAnalysis: "READY",
        stateSynchronization: "READY",
        twinInsightEngine: "READY",
        twinAnalyticsDashboard: "READY",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      health: this.health(),
      twins: this.twins.list(),
      snapshots: this.synchronization.snapshotsList(),
      synchronizations: this.synchronization.synchronizationsList(),
      scenarios: this.scenarios.scenariosList(),
      simulations: this.scenarios.simulationsList(),
      insights: this.insights.list(),
    };
  }
}
