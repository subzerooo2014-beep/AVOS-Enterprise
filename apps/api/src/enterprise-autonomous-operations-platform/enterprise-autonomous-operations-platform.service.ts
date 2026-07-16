import { Injectable } from "@nestjs/common";
import { AiOperationsOrchestratorService } from "./ai-operations-orchestrator.service";
import { AutonomousIncidentManagerService } from "./autonomous-incident-manager.service";
import { OperationsSignalCenterService } from "./operations-signal-center.service";
import { PredictiveOperationsService } from "./predictive-operations.service";
import { SelfHealingEngineService } from "./self-healing-engine.service";
import type {
  AutonomousOperationsHealth,
  AutonomousOperationsMetrics,
} from "./enterprise-autonomous-operations.types";

@Injectable()
export class EnterpriseAutonomousOperationsPlatformService {
  constructor(
    private readonly signals: OperationsSignalCenterService,
    private readonly orchestrator: AiOperationsOrchestratorService,
    private readonly healing: SelfHealingEngineService,
    private readonly predictive: PredictiveOperationsService,
    private readonly incidents: AutonomousIncidentManagerService,
  ) {}

  metrics(): AutonomousOperationsMetrics {
    return {
      signals: this.signals.count(),
      criticalSignals: this.signals.criticalCount(),
      actions: this.orchestrator.count(),
      runningActions: this.orchestrator.runningCount(),
      failedActions: this.orchestrator.failedCount(),
      healingPolicies: this.healing.count(),
      forecasts: this.predictive.forecastCount(),
      optimizations: this.predictive.optimizationCount(),
      incidents: this.incidents.count(),
      openIncidents: this.incidents.openCount(),
    };
  }

  health(): AutonomousOperationsHealth {
    const metrics = this.metrics();

    return {
      success: true,
      system: "AVOS Enterprise Autonomous Operations Platform",
      version: "1.0.0",
      status:
        metrics.failedActions > 0 ||
        metrics.criticalSignals > 0 ||
        metrics.openIncidents > 0
          ? "DEGRADED"
          : "READY",
      metrics,
      components: {
        autonomousOperationsCenter: "READY",
        aiOperationsOrchestrator: "READY",
        selfHealingEngine: "READY",
        autonomousIncidentManager: "READY",
        predictiveOperations: "READY",
        capacityForecasting: "READY",
        costOptimization: "READY",
        operationsDashboard: "READY",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      health: this.health(),
      signals: this.signals.list(),
      actions: this.orchestrator.list(),
      healingPolicies: this.healing.list(),
      forecasts: this.predictive.forecastsList(),
      optimizations: this.predictive.optimizationsList(),
      incidents: this.incidents.list(),
    };
  }
}
