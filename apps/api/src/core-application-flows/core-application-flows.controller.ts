import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CoreApplicationFlowsService } from "./core-application-flows.service";
import { CoreFlowRegistryService } from "./core-flow-registry.service";

@Controller("core-application-flows")
export class CoreApplicationFlowsController {
  constructor(
    private readonly service: CoreApplicationFlowsService,
    private readonly registry: CoreFlowRegistryService,
  ) {}

  @Post("quote-to-cash")
  quoteToCash(@Body() dto: any) {
    return this.service.quoteToCash(dto);
  }

  @Post("reservation-to-sale")
  reservationToSale(@Body() dto: any) {
    return this.service.reservationToSale(dto);
  }

  @Post(":id/replay")
  replay(@Param("id") id: string) {
    return this.service.replay(id);
  }

  @Get("executions")
  executions(@Query() query: any) {
    return this.registry.findAll(query);
  }

  @Get("executions/:id")
  execution(@Param("id") id: string) {
    return this.registry.findOne(id);
  }

  @Get("dashboard")
  dashboard() {
    return this.service.dashboard();
  }
}
