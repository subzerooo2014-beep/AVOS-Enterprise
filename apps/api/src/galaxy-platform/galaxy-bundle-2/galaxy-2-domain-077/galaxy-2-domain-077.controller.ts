import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain077Service } from "./galaxy-2-domain-077.service";
import { Galaxy2Domain077ExecutionRequest } from "./galaxy-2-domain-077.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-077")
export class Galaxy2Domain077Controller {
  constructor(private readonly service: Galaxy2Domain077Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain077ExecutionRequest) {
    return this.service.execute(request);
  }
}