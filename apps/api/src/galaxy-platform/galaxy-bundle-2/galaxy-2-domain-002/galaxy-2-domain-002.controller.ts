import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain002Service } from "./galaxy-2-domain-002.service";
import { Galaxy2Domain002ExecutionRequest } from "./galaxy-2-domain-002.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-002")
export class Galaxy2Domain002Controller {
  constructor(private readonly service: Galaxy2Domain002Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain002ExecutionRequest) {
    return this.service.execute(request);
  }
}