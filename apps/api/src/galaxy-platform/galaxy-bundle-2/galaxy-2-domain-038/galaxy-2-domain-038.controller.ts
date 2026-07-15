import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain038Service } from "./galaxy-2-domain-038.service";
import { Galaxy2Domain038ExecutionRequest } from "./galaxy-2-domain-038.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-038")
export class Galaxy2Domain038Controller {
  constructor(private readonly service: Galaxy2Domain038Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain038ExecutionRequest) {
    return this.service.execute(request);
  }
}