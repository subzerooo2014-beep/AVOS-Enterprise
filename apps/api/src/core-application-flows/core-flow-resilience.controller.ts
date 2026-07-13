import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CoreFlowSagaService } from "./core-flow-saga.service";
import { CoreFlowSchedulerService } from "./core-flow-scheduler.service";
import { CoreFlowRateLimitService } from "./core-flow-rate-limit.service";
import { CoreFlowCircuitBreakerService } from "./core-flow-circuit-breaker.service";
import { CoreFlowObservabilityService } from "./core-flow-observability.service";

@Controller("core-flow-resilience")
export class CoreFlowResilienceController {
  constructor(
    private readonly sagas: CoreFlowSagaService,
    private readonly scheduler: CoreFlowSchedulerService,
    private readonly rateLimits: CoreFlowRateLimitService,
    private readonly circuits: CoreFlowCircuitBreakerService,
    private readonly observability: CoreFlowObservabilityService,
  ) {}

  @Post("sagas")
  startSaga(@Body() dto: any) {
    return this.sagas.start(dto);
  }

  @Get("sagas")
  sagasList() {
    return this.sagas.findAll();
  }

  @Post("sagas/:id/steps/:stepName/start")
  beginStep(@Param("id") id: string, @Param("stepName") stepName: string) {
    return this.sagas.beginStep(id, stepName);
  }

  @Post("sagas/:id/steps/:stepName/complete")
  completeStep(
    @Param("id") id: string,
    @Param("stepName") stepName: string,
    @Body() dto: any,
  ) {
    return this.sagas.completeStep(id, stepName, dto?.output);
  }

  @Post("sagas/:id/steps/:stepName/fail")
  failStep(
    @Param("id") id: string,
    @Param("stepName") stepName: string,
    @Body() dto: any,
  ) {
    return this.sagas.failStep(id, stepName, dto?.error);
  }

  @Post("sagas/:id/compensate")
  compensate(@Param("id") id: string, @Body() dto: any) {
    return this.sagas.compensate(id, dto?.reason);
  }

  @Post("schedules")
  schedule(@Body() dto: any) {
    return this.scheduler.schedule(dto?.operationId, dto?.executeAt);
  }

  @Get("schedules")
  schedules() {
    return this.scheduler.findAll();
  }

  @Post("schedules/dispatch-due")
  dispatchDue() {
    return this.scheduler.dispatchDue();
  }

  @Post("schedules/:id/cancel")
  cancelSchedule(@Param("id") id: string) {
    return this.scheduler.cancel(id);
  }

  @Post("rate-limit/consume")
  consumeRateLimit(@Body() dto: any) {
    return this.rateLimits.consume(
      String(dto?.key ?? "default"),
      Number(dto?.limit ?? 100),
      Number(dto?.windowMs ?? 60_000),
    );
  }

  @Post("circuits/:name/success")
  circuitSuccess(@Param("name") name: string) {
    return this.circuits.recordSuccess(name);
  }

  @Post("circuits/:name/failure")
  circuitFailure(@Param("name") name: string, @Body() dto: any) {
    return this.circuits.recordFailure(name, Number(dto?.threshold ?? 5));
  }

  @Get("dashboard")
  dashboard() {
    return this.observability.dashboard();
  }

  @Get("health")
  health() {
    return this.observability.health();
  }
}
