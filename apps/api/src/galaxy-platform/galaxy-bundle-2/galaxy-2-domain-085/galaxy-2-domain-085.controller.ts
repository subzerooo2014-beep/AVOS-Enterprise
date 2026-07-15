import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain085Service } from "./galaxy-2-domain-085.service";
import { Galaxy2Domain085ExecutionRequest } from "./galaxy-2-domain-085.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-085")
export class Galaxy2Domain085Controller {
  constructor(private readonly service: Galaxy2Domain085Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain085ExecutionRequest) {
    return this.service.execute(request);
  }
}