import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain093Service } from "./galaxy-2-domain-093.service";
import { Galaxy2Domain093ExecutionRequest } from "./galaxy-2-domain-093.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-093")
export class Galaxy2Domain093Controller {
  constructor(private readonly service: Galaxy2Domain093Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain093ExecutionRequest) {
    return this.service.execute(request);
  }
}