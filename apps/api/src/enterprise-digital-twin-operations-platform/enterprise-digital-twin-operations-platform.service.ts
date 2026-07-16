import { Injectable } from "@nestjs/common";
import { LiveStateSynchronizationService } from "./live-state-synchronization.service";
import { OperationalTwinRegistryService } from "./operational-twin-registry.service";
import { PredictiveTwinAnalyticsService } from "./predictive-twin-analytics.service";
import { ScenarioReplayEngineService } from "./scenario-replay-engine.service";
import { TwinHealthMonitorService } from "./twin-health-monitor.service";
import type {
  DigitalTwinOperationsHealth,
  DigitalTwinOperationsMetrics,
} from "./enterprise-digital-twin-operations.types";

@Injectable()
export class EnterpriseDigitalTwinOperationsPlatformService {
  constructor(
    private readonly twins: OperationalTwinRegistryService,
    private readonly synchronization: LiveStateSynchronizationService,
    private readonly replay: ScenarioReplayEngineService,
    private readonly predictive: PredictiveTwinAnalyticsService,
    private readonly healthMonitor: TwinHealthMonitorService,
  ) {}

  metrics(): DigitalTwinOperationsMetrics {
    return {
      twins: this.twins.count(),
      assetTwins: this.twins.countByType("ASSET"),
      processTwins: this.twins.countByType("PROCESS"),
      activeTwins: this.twins.activeCount(),
      degradedTwins: this.twins.degradedCount(),
      stateEvents: this.synchronization.count(),
      replays: this.replay.count(),
      predictiveInsights: this.predictive.count(),
      unhealthyTwins: this.healthMonitor.unhealthyCount(),
    };
  }

  health(): DigitalTwinOperationsHealth {
    const metrics = this.metrics();

    return {
      success: true,
      system: "AVOS Enterprise Digital Twin Operations Platform",
      version: "1.0.0",
      status:
        metrics.degradedTwins > 0 || metrics.unhealthyTwins > 0
          ? "DEGRADED"
          : "READY",
      metrics,
      components: {
        enterpriseDigitalTwinEngine: "READY",
        liveStateSynchronization: "READY",
        assetTwinRegistry: "READY",
        processTwinEngine: "READY",
        scenarioReplay: "READY",
        predictiveTwinAnalytics: "READY",
        twinHealthMonitor: "READY",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      health: this.health(),
      twins: this.twins.list(),
      stateEvents: this.synchronization.list(),
      replays: this.replay.list(),
      predictiveInsights: this.predictive.list(),
      twinHealth: this.healthMonitor.checkAll(),
    };
  }
}
