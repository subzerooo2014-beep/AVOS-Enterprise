import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain028Service } from "./galaxy-2-domain-028.service";
import { Galaxy2Domain028ExecutionRequest } from "./galaxy-2-domain-028.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-028")
export class Galaxy2Domain028Controller {
  constructor(private readonly service: Galaxy2Domain028Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain028ExecutionRequest) {
    return this.service.execute(request);
  }
}