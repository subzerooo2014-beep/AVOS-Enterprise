import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain021Service } from "./galaxy-2-domain-021.service";
import { Galaxy2Domain021ExecutionRequest } from "./galaxy-2-domain-021.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-021")
export class Galaxy2Domain021Controller {
  constructor(private readonly service: Galaxy2Domain021Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain021ExecutionRequest) {
    return this.service.execute(request);
  }
}