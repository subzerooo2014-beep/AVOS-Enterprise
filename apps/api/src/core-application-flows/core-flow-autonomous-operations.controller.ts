import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CoreFlowAutonomousOperationsService } from "./core-flow-autonomous-operations.service";
import { CoreFlowAutonomyService } from "./core-flow-autonomy.service";
import { CoreFlowExperimentService } from "./core-flow-experiment.service";
import { CoreFlowBenchmarkService } from "./core-flow-benchmark.service";
import { CoreFlowReleaseService } from "./core-flow-release.service";

@Controller("core-flow-autonomous-operations")
export class CoreFlowAutonomousOperationsController {
  constructor(
    private readonly operations: CoreFlowAutonomousOperationsService,
    private readonly autonomy: CoreFlowAutonomyService,
    private readonly experiments: CoreFlowExperimentService,
    private readonly benchmarks: CoreFlowBenchmarkService,
    private readonly releases: CoreFlowReleaseService,
  ) {}

  @Post("executions/:id/plan")
  plan(@Param("id") id: string, @Body() dto: any) { return this.operations.plan(id, dto); }

  @Post("actions")
  propose(@Body() dto: any) { return this.autonomy.propose(dto); }

  @Get("actions")
  actions(@Query() query: any) { return this.autonomy.findAll(query); }

  @Post("actions/:id/approve")
  approveAction(@Param("id") id: string) { return this.autonomy.approve(id); }

  @Post("actions/:id/execute")
  executeAction(@Param("id") id: string) { return this.autonomy.execute(id); }

  @Post("actions/:id/fail")
  failAction(@Param("id") id: string, @Body() dto: any) { return this.autonomy.fail(id, dto?.error); }

  @Post("actions/:id/rollback")
  rollbackAction(@Param("id") id: string, @Body() dto: any) { return this.autonomy.rollback(id, dto?.reason); }

  @Post("experiments")
  createExperiment(@Body() dto: any) { return this.operations.runExperiment(dto); }

  @Get("experiments")
  experimentsList() { return this.experiments.findAll(); }

  @Post("experiments/:id/complete")
  completeExperiment(@Param("id") id: string, @Body() dto: any) {
    return this.experiments.complete(id, dto?.winner);
  }

  @Post("benchmarks")
  benchmark(@Body() dto: any) { return this.operations.benchmark(dto); }

  @Get("benchmarks")
  benchmarkList(@Query("flow") flow?: string) { return this.benchmarks.findAll(flow); }

  @Post("releases")
  createRelease(@Body() dto: any) { return this.releases.create(dto); }

  @Get("releases")
  releaseList(@Query("flow") flow?: string) { return this.releases.findAll(flow); }

  @Post("releases/:id/canary")
  canary(@Param("id") id: string, @Body() dto: any) {
    return this.releases.canary(id, dto?.trafficPercent);
  }

  @Post("releases/:id/activate")
  activate(@Param("id") id: string) { return this.releases.activate(id); }

  @Post("releases/:id/rollback")
  rollbackRelease(@Param("id") id: string) { return this.releases.rollback(id); }

  @Get("dashboard")
  dashboard() { return this.operations.dashboard(); }
}
