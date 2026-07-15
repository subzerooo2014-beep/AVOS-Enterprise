import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain042Service } from "./galaxy-2-domain-042.service";
import { Galaxy2Domain042ExecutionRequest } from "./galaxy-2-domain-042.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-042")
export class Galaxy2Domain042Controller {
  constructor(private readonly service: Galaxy2Domain042Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain042ExecutionRequest) {
    return this.service.execute(request);
  }
}