import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain052Service } from "./galaxy-2-domain-052.service";
import { Galaxy2Domain052ExecutionRequest } from "./galaxy-2-domain-052.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-052")
export class Galaxy2Domain052Controller {
  constructor(private readonly service: Galaxy2Domain052Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain052ExecutionRequest) {
    return this.service.execute(request);
  }
}