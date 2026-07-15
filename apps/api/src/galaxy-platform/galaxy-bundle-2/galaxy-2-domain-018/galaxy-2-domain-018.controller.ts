import { Body, Controller, Get, Post } from "@nestjs/common";
import { Galaxy2Domain018Service } from "./galaxy-2-domain-018.service";
import { Galaxy2Domain018ExecutionRequest } from "./galaxy-2-domain-018.types";

@Controller("galaxy-platform/bundle-2/galaxy-2-domain-018")
export class Galaxy2Domain018Controller {
  constructor(private readonly service: Galaxy2Domain018Service) {}

  @Get("health")
  health() {
    return this.service.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.service.capabilities();
  }

  @Post("execute")
  execute(@Body() request: Galaxy2Domain018ExecutionRequest) {
    return this.service.execute(request);
  }
}