import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain043Service } from "./galaxy-2-domain-043.service";
import { Galaxy2Domain043ExecutionRequest } from "./galaxy-2-domain-043.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-043")
export class Galaxy2Domain043Controller {
  constructor(private readonly service: Galaxy2Domain043Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain043ExecutionRequest) {
    return this.service.execute(request);
  }
}