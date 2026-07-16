import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EnterpriseDigitalTwinOperationsPlatformService } from "./enterprise-digital-twin-operations-platform.service";
import { LiveStateSynchronizationService } from "./live-state-synchronization.service";
import { OperationalTwinRegistryService } from "./operational-twin-registry.service";
import { PredictiveTwinAnalyticsService } from "./predictive-twin-analytics.service";
import { ScenarioReplayEngineService } from "./scenario-replay-engine.service";
import { TwinHealthMonitorService } from "./twin-health-monitor.service";
import type { OperationalTwinRecord } from "./enterprise-digital-twin-operations.types";

@Controller("enterprise-digital-twin-operations-platform")
export class EnterpriseDigitalTwinOperationsPlatformController {
  constructor(
    private readonly platform: EnterpriseDigitalTwinOperationsPlatformService,
    private readonly twins: OperationalTwinRegistryService,
    private readonly synchronization: LiveStateSynchronizationService,
    private readonly replay: ScenarioReplayEngineService,
    private readonly predictive: PredictiveTwinAnalyticsService,
    private readonly healthMonitor: TwinHealthMonitorService,
  ) {}

  @Get("status")
  status() {
    return this.platform.health();
  }

  @Get("diagnostics")
  diagnostics() {
    return this.platform.diagnostics();
  }

  @Post("twins")
  upsertTwin(
    @Body()
    body: Omit<OperationalTwinRecord, "version" | "createdAt" | "updatedAt">,
  ) {
    return {
      success: true,
      twin: this.twins.upsert(body),
    };
  }

  @Post("twins/:id/synchronize")
  synchronize(
    @Param("id") id: string,
    @Body()
    body: {
      source: string;
      patch: Record<string, unknown>;
    },
  ) {
    return {
      success: true,
      event: this.synchronization.synchronize(
        id,
        body.source,
        body.patch,
      ),
    };
  }

  @Post("twins/:id/replay")
  replayScenario(
    @Param("id") id: string,
    @Body()
    body: {
      fromVersion: number;
      toVersion: number;
    },
  ) {
    return {
      success: true,
      replay: this.replay.replay(
        id,
        body.fromVersion,
        body.toVersion,
      ),
    };
  }

  @Post("twins/:id/predict")
  predict(@Param("id") id: string) {
    return {
      success: true,
      insight: this.predictive.analyze(id),
    };
  }

  @Get("twins/:id/health")
  twinHealth(@Param("id") id: string) {
    return {
      success: true,
      health: this.healthMonitor.check(id),
    };
  }
}
