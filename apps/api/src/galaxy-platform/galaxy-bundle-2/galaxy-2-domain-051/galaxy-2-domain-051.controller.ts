import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain051Service } from "./galaxy-2-domain-051.service";
import { Galaxy2Domain051ExecutionRequest } from "./galaxy-2-domain-051.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-051")
export class Galaxy2Domain051Controller {
  constructor(private readonly service: Galaxy2Domain051Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain051ExecutionRequest) {
    return this.service.execute(request);
  }
}