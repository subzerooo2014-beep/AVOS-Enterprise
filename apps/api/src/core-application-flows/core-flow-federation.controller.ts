import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CoreFlowFederationService } from "./core-flow-federation.service";
import { CoreFlowRouterService } from "./core-flow-router.service";
import { CoreFlowSimulationService } from "./core-flow-simulation.service";
import { CoreFlowDigitalTwinService } from "./core-flow-digital-twin.service";
import { CoreFlowControlPlaneService } from "./core-flow-control-plane.service";
import { CoreFlowFederationOperationsService } from "./core-flow-federation-operations.service";

@Controller("core-flow-federation")
export class CoreFlowFederationController {
  constructor(
    private readonly federation: CoreFlowFederationService,
    private readonly router: CoreFlowRouterService,
    private readonly simulations: CoreFlowSimulationService,
    private readonly twins: CoreFlowDigitalTwinService,
    private readonly controlPlane: CoreFlowControlPlaneService,
    private readonly operations: CoreFlowFederationOperationsService,
  ) {}

  @Post("nodes")
  registerNode(@Body() dto: any) {
    return this.federation.register(dto);
  }

  @Get("nodes")
  nodes(@Query() query: any) {
    return this.federation.findAll(query);
  }

  @Post("nodes/:id/heartbeat")
  heartbeat(@Param("id") id: string, @Body() dto: any) {
    return this.federation.heartbeat(id, dto);
  }

  @Post("routes/:flow")
  route(@Param("flow") flow: string, @Body() dto: any) {
    return this.router.route(flow, dto);
  }

  @Get("routes")
  routeHistory(@Query("flow") flow?: string) {
    return this.router.history(flow);
  }

  @Post("simulations/:flow")
  simulate(@Param("flow") flow: string, @Body() dto: any) {
    return this.simulations.run(flow, dto);
  }

  @Get("simulations")
  simulationList(@Query("flow") flow?: string) {
    return this.simulations.findAll(flow);
  }

  @Post("simulations/compare")
  compare(@Body() dto: any) {
    return this.simulations.compare(
      Array.isArray(dto?.ids) ? dto.ids : [],
    );
  }

  @Post("digital-twins/:flow")
  createTwin(@Param("flow") flow: string, @Body() dto: any) {
    return this.twins.create(flow, dto?.state ?? {});
  }

  @Get("digital-twins")
  digitalTwins() {
    return this.twins.findAll();
  }

  @Post("digital-twins/:id/synchronize")
  synchronizeTwin(@Param("id") id: string, @Body() dto: any) {
    return this.twins.synchronize(id, dto?.state ?? {});
  }

  @Post("digital-twins/:id/project")
  projectTwin(@Param("id") id: string, @Body() dto: any) {
    return this.twins.project(id, dto?.changes ?? {});
  }

  @Post("control-plane/commands")
  issueCommand(@Body() dto: any) {
    return this.controlPlane.issue(
      dto?.command,
      dto?.target,
      dto?.payload ?? {},
    );
  }

  @Post("control-plane/commands/:id/execute")
  executeCommand(@Param("id") id: string) {
    return this.controlPlane.execute(id);
  }

  @Post("plans/:flow")
  plan(@Param("flow") flow: string, @Body() dto: any) {
    return this.operations.plan(flow, dto);
  }

  @Get("dashboard")
  dashboard() {
    return this.operations.dashboard();
  }
}
