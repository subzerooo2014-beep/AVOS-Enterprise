import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CoreFlowRuntimeRegistryService } from "./core-flow-runtime-registry.service";
import { CoreFlowRuntimeCoordinatorService } from "./core-flow-runtime-coordinator.service";
import { CoreFlowRuntimeFinalizationService } from "./core-flow-runtime-finalization.service";
import { CoreFlowRuntimePlatformService } from "./core-flow-runtime-platform.service";

@Controller("core-flow-runtime")
export class CoreFlowRuntimeController {
  constructor(
    private readonly registry: CoreFlowRuntimeRegistryService,
    private readonly coordinator: CoreFlowRuntimeCoordinatorService,
    private readonly finalization: CoreFlowRuntimeFinalizationService,
    private readonly platform: CoreFlowRuntimePlatformService,
  ) {}

  @Post("registry")
  register(@Body() dto: any) { return this.registry.register(dto); }

  @Get("registry")
  registrations(@Query() query: any) { return this.registry.findAll(query); }

  @Post("registry/:id/activate")
  activate(@Param("id") id: string) { return this.registry.setStatus(id, "active"); }

  @Post("registry/:id/pause")
  pause(@Param("id") id: string) { return this.registry.setStatus(id, "paused"); }

  @Post("registry/:id/degrade")
  degrade(@Param("id") id: string) { return this.registry.setStatus(id, "degraded"); }

  @Post("registry/:id/retire")
  retire(@Param("id") id: string) { return this.registry.setStatus(id, "retired"); }

  @Post("coordination")
  planCoordination(@Body() dto: any) {
    return this.coordinator.plan(dto?.executionId, dto?.sourceFlow, dto?.targetFlows ?? []);
  }

  @Get("coordination")
  coordinationList(@Query("executionId") executionId?: string) {
    return this.coordinator.findAll(executionId);
  }

  @Post("coordination/:id/execute")
  executeCoordination(@Param("id") id: string) { return this.coordinator.execute(id); }

  @Post("executions/:id/orchestrate")
  orchestrate(@Param("id") id: string, @Body() dto: any) {
    return this.platform.orchestrate(id, dto);
  }

  @Post("finalize")
  finalize(@Body() dto: any) { return this.finalization.finalize(dto); }

  @Get("finalizations")
  finalizations() { return this.finalization.findAll(); }

  @Get("dashboard")
  dashboard() { return this.platform.dashboard(); }
}
