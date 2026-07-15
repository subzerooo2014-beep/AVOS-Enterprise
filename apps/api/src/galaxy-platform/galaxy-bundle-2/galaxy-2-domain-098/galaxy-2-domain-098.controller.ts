import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain098Service } from "./galaxy-2-domain-098.service";
import { Galaxy2Domain098ExecutionRequest } from "./galaxy-2-domain-098.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-098")
export class Galaxy2Domain098Controller {
  constructor(private readonly service: Galaxy2Domain098Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain098ExecutionRequest) {
    return this.service.execute(request);
  }
}