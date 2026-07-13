import { Injectable } from "@nestjs/common";
import { CoreFlowMetricsService } from "./core-flow-metrics.service";
import { CoreFlowTracingService } from "./core-flow-tracing.service";
import { CoreFlowSloService } from "./core-flow-slo.service";
import { CoreFlowAlertingService } from "./core-flow-alerting.service";
import { CoreFlowDistributedRuntimeService } from "./core-flow-distributed-runtime.service";
import { CoreFlowWorkerRuntimeService } from "./core-flow-worker-runtime.service";

@Injectable()
export class CoreFlowObservabilityPlatformService {
  constructor(
    private readonly metrics: CoreFlowMetricsService,
    private readonly tracing: CoreFlowTracingService,
    private readonly slos: CoreFlowSloService,
    private readonly alerts: CoreFlowAlertingService,
    private readonly distributed: CoreFlowDistributedRuntimeService,
    private readonly workers: CoreFlowWorkerRuntimeService,
  ) {}

  async diagnose(dto: any = {}) {
    const trace = await this.tracing.start({
      traceId: dto?.traceId,
      executionId: dto?.executionId,
      flow: dto?.flow,
      operation: "runtime-diagnosis",
    });

    const distributed = await this.distributed.dashboard();
    const workers = await this.workers.dashboard();
    const alerts = await this.alerts.active(25);
    const slos = await this.slos.list();

    await this.tracing.finish(trace.id, "completed");

    return {
      traceId: trace.traceId,
      distributed,
      workers,
      alerts,
      slos,
      diagnosedAt: new Date().toISOString(),
    };
  }

  async dashboard() {
    return {
      metrics: await this.metrics.recent(100),
      alerts: await this.alerts.active(50),
      slos: await this.slos.list(),
      distributed: await this.distributed.dashboard(),
      workers: await this.workers.dashboard(),
      generatedAt: new Date().toISOString(),
    };
  }
}
