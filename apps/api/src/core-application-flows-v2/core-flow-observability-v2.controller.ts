import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CoreFlowMetricsService } from "./core-flow-metrics.service";
import { CoreFlowTracingService } from "./core-flow-tracing.service";
import { CoreFlowSloService } from "./core-flow-slo.service";
import { CoreFlowAlertingService } from "./core-flow-alerting.service";
import { CoreFlowObservabilityPlatformService } from "./core-flow-observability-platform.service";

@Controller("core-flow-observability-v2")
export class CoreFlowObservabilityV2Controller {
  constructor(
    private readonly metrics: CoreFlowMetricsService,
    private readonly tracing: CoreFlowTracingService,
    private readonly slos: CoreFlowSloService,
    private readonly alerts: CoreFlowAlertingService,
    private readonly platform: CoreFlowObservabilityPlatformService,
  ) {}

  @Post("metrics")
  recordMetric(@Body() dto: any) {
    return this.metrics.record(dto);
  }

  @Get("metrics/recent")
  recentMetrics(@Query("limit") limit?: string) {
    return this.metrics.recent(Number(limit ?? 100));
  }

  @Get("metrics/aggregate")
  aggregate(
    @Query("flow") flow: string,
    @Query("name") name: string,
    @Query("windowMinutes") windowMinutes?: string,
  ) {
    return this.metrics.aggregate(flow, name, Number(windowMinutes ?? 60));
  }

  @Post("traces/start")
  startTrace(@Body() dto: any) {
    return this.tracing.start(dto);
  }

  @Post("traces/:id/finish")
  finishTrace(@Param("id") id: string, @Body() dto: any) {
    return this.tracing.finish(id, dto?.status ?? "completed");
  }

  @Get("traces/:traceId")
  trace(@Param("traceId") traceId: string) {
    return this.tracing.trace(traceId);
  }

  @Post("slos")
  createSlo(@Body() dto: any) {
    return this.slos.create(dto);
  }

  @Get("slos")
  slosList() {
    return this.slos.list();
  }

  @Post("slos/:id/evaluate")
  evaluateSlo(@Param("id") id: string) {
    return this.slos.evaluate(id);
  }

  @Post("alerts")
  emitAlert(@Body() dto: any) {
    return this.alerts.emit(dto);
  }

  @Get("alerts")
  alertsList(@Query("limit") limit?: string) {
    return this.alerts.active(Number(limit ?? 100));
  }

  @Post("diagnostics")
  diagnose(@Body() dto: any) {
    return this.platform.diagnose(dto);
  }

  @Get("dashboard")
  dashboard() {
    return this.platform.dashboard();
  }
}
