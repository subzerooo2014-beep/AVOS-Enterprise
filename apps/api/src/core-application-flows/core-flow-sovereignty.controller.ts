import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CoreFlowSovereignZoneService } from "./core-flow-sovereign-zone.service";
import { CoreFlowJurisdictionService } from "./core-flow-jurisdiction.service";
import { CoreFlowKeyManagementService } from "./core-flow-key-management.service";
import { CoreFlowContinuityService } from "./core-flow-continuity.service";
import { CoreFlowSovereigntyService } from "./core-flow-sovereignty.service";

@Controller("core-flow-sovereignty")
export class CoreFlowSovereigntyController {
  constructor(
    private readonly zones: CoreFlowSovereignZoneService,
    private readonly jurisdiction: CoreFlowJurisdictionService,
    private readonly keys: CoreFlowKeyManagementService,
    private readonly continuity: CoreFlowContinuityService,
    private readonly sovereignty: CoreFlowSovereigntyService,
  ) {}

  @Post("zones")
  createZone(@Body() dto: any) {
    return this.zones.create(dto);
  }

  @Get("zones")
  zonesList(@Query() query: any) {
    return this.zones.findAll(query);
  }

  @Post("zones/:id/restrict")
  restrictZone(@Param("id") id: string) {
    return this.zones.restrict(id);
  }

  @Post("zones/:id/suspend")
  suspendZone(@Param("id") id: string) {
    return this.zones.suspend(id);
  }

  @Post("executions/:id/authorize")
  authorize(@Param("id") id: string, @Body() dto: any) {
    return this.sovereignty.authorize(id, dto);
  }

  @Get("jurisdiction-decisions")
  decisions(@Query("executionId") executionId?: string) {
    return this.jurisdiction.findAll(executionId);
  }

  @Post("keys")
  createKey(@Body() dto: any) {
    return this.keys.create(dto?.zoneId, dto?.alias);
  }

  @Get("keys")
  keysList(@Query("zoneId") zoneId?: string) {
    return this.keys.findAll(zoneId);
  }

  @Post("keys/:id/rotate")
  rotateKey(@Param("id") id: string) {
    return this.keys.rotate(id);
  }

  @Post("keys/:id/retire")
  retireKey(@Param("id") id: string) {
    return this.keys.retire(id);
  }

  @Post("continuity-plans")
  createContinuityPlan(@Body() dto: any) {
    return this.continuity.create(dto);
  }

  @Get("continuity-plans")
  continuityPlans(@Query("flow") flow?: string) {
    return this.continuity.findAll(flow);
  }

  @Post("continuity-plans/:id/activate")
  activateContinuityPlan(@Param("id") id: string) {
    return this.continuity.activate(id);
  }

  @Post("continuity-plans/:id/test")
  testContinuityPlan(@Param("id") id: string, @Body() dto: any) {
    return this.continuity.test(id, dto);
  }

  @Get("dashboard")
  dashboard() {
    return this.sovereignty.dashboard();
  }
}
