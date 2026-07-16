import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AiOperationsOrchestratorService } from "./ai-operations-orchestrator.service";
import { AutonomousIncidentManagerService } from "./autonomous-incident-manager.service";
import { EnterpriseAutonomousOperationsPlatformService } from "./enterprise-autonomous-operations-platform.service";
import { OperationsSignalCenterService } from "./operations-signal-center.service";
import { PredictiveOperationsService } from "./predictive-operations.service";
import { SelfHealingEngineService } from "./self-healing-engine.service";
import type { HealingPolicyRecord } from "./enterprise-autonomous-operations.types";

@Controller("enterprise-autonomous-operations-platform")
export class EnterpriseAutonomousOperationsPlatformController {
  constructor(
    private readonly platform: EnterpriseAutonomousOperationsPlatformService,
    private readonly signals: OperationsSignalCenterService,
    private readonly orchestrator: AiOperationsOrchestratorService,
    private readonly healing: SelfHealingEngineService,
    private readonly predictive: PredictiveOperationsService,
    private readonly incidents: AutonomousIncidentManagerService,
  ) {}

  @Get("status")
  status() {
    return this.platform.health();
  }

  @Get("diagnostics")
  diagnostics() {
    return this.platform.diagnostics();
  }

  @Post("signals")
  ingestSignal(
    @Body()
    body: {
      source: string;
      metric: string;
      value: number;
      threshold: number;
    },
  ) {
    const signal = this.signals.ingest(
      body.source,
      body.metric,
      body.value,
      body.threshold,
    );

    return {
      success: true,
      signal,
      healingActions: this.healing.evaluate(signal),
    };
  }

  @Post("healing-policies")
  registerHealingPolicy(@Body() body: HealingPolicyRecord) {
    return { success: true, policy: this.healing.register(body) };
  }

  @Post("actions")
  planAction(
    @Body()
    body: {
      name: string;
      actionType: string;
      target: string;
      parameters?: Record<string, unknown>;
    },
  ) {
    return {
      success: true,
      action: this.orchestrator.plan(
        body.name,
        body.actionType,
        body.target,
        body.parameters,
      ),
    };
  }

  @Post("actions/:id/execute")
  executeAction(@Param("id") id: string) {
    return { success: true, action: this.orchestrator.execute(id) };
  }

  @Post("forecasts")
  forecast(
    @Body()
    body: {
      resource: string;
      currentUsage: number;
      growthRate: number;
      horizonHours: number;
    },
  ) {
    return {
      success: true,
      forecast: this.predictive.forecast(
        body.resource,
        body.currentUsage,
        body.growthRate,
        body.horizonHours,
      ),
    };
  }

  @Post("cost-optimizations")
  optimizeCost(
    @Body()
    body: {
      resource: string;
      currentCost: number;
      reductionPercent: number;
    },
  ) {
    return {
      success: true,
      optimization: this.predictive.optimizeCost(
        body.resource,
        body.currentCost,
        body.reductionPercent,
      ),
    };
  }

  @Post("incidents")
  createIncident(
    @Body()
    body: {
      title: string;
      severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
      source: string;
    },
  ) {
    return {
      success: true,
      incident: this.incidents.create(
        body.title,
        body.severity,
        body.source,
      ),
    };
  }

  @Post("incidents/:id/resolve")
  resolveIncident(@Param("id") id: string) {
    return { success: true, incident: this.incidents.resolve(id) };
  }
}
