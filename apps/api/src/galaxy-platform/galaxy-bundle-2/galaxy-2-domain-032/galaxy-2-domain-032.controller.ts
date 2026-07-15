import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain032Service } from "./galaxy-2-domain-032.service";
import { Galaxy2Domain032ExecutionRequest } from "./galaxy-2-domain-032.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-032")
export class Galaxy2Domain032Controller {
  constructor(private readonly service: Galaxy2Domain032Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain032ExecutionRequest) {
    return this.service.execute(request);
  }
}