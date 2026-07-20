import { Injectable } from "@nestjs/common";
import { UnifiedEventBusService } from "../events/unified-event-bus.service";
import { UnifiedPlatformControllerService } from "../controller/unified-platform-controller.service";
import { UnifiedPlatformRegistryService } from "../registry/unified-platform-registry.service";
import { UnifiedWorkflowEngineService } from "../workflow/unified-workflow-engine.service";

@Injectable()
export class PlatformObservabilityService {
  private readonly logs: Array<{ level: string; message: string; at: string }> = [];
  private readonly traces: Array<{ id: string; operation: string; at: string }> = [];

  constructor(
    private readonly controller: UnifiedPlatformControllerService,
    private readonly registry: UnifiedPlatformRegistryService,
    private readonly workflows: UnifiedWorkflowEngineService,
    private readonly events: UnifiedEventBusService
  ) {}

  health() {
    const platform = this.controller.status();
    const registry = this.registry.summary();
    return {
      status: platform.status === "operational" && registry.offline === 0 ? "healthy" : "degraded",
      platform,
      registry,
      availability: platform.status === "operational" ? 100 : 0,
      checkedAt: new Date().toISOString()
    };
  }

  metrics() {
    return {
      registry: this.registry.summary(),
      workflows: this.workflows.listRuns().length,
      events: this.events.metrics(),
      logs: this.logs.length,
      traces: this.traces.length
    };
  }

  recordLog(level: string, message: string) {
    const log = { level, message, at: new Date().toISOString() };
    this.logs.push(log);
    return log;
  }

  trace(operation: string) {
    const trace = { id: `trace-${Date.now()}-${this.traces.length + 1}`, operation, at: new Date().toISOString() };
    this.traces.push(trace);
    return trace;
  }

  dashboard() {
    return {
      platformHealth: this.health(),
      activeSuites: this.registry.list("suite").filter((suite) => suite.status === "operational").length,
      runningWorkflows: this.workflows.listRuns().filter((run) => run.status === "running").length,
      events: this.events.metrics(),
      performance: { status: "operational" },
      alerts: this.registry.summary().offline > 0 ? ["Offline platform components detected"] : []
    };
  }
}