import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain078Service } from "./galaxy-2-domain-078.service";
import { Galaxy2Domain078ExecutionRequest } from "./galaxy-2-domain-078.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-078")
export class Galaxy2Domain078Controller {
  constructor(private readonly service: Galaxy2Domain078Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain078ExecutionRequest) {
    return this.service.execute(request);
  }
}