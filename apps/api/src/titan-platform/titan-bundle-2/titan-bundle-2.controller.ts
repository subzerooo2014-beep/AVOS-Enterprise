import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { TitanBundle2Service } from "./titan-bundle-2.service";
import { TitanExecutionRequest } from "./titan-bundle-2.types";

@Controller("titan-platform/bundle-2")
export class TitanBundle2Controller {
  constructor(private readonly titan: TitanBundle2Service) {}

  @Get("health")
  health() {
    return this.titan.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.titan.capabilities();
  }

  @Get("executions")
  executions() {
    return this.titan.listExecutions();
  }

  @Get("executions/:id")
  execution(@Param("id") id: string) {
    return this.titan.getExecution(id);
  }

  @Post("execute")
  execute(@Body() request: TitanExecutionRequest) {
    return this.titan.execute(request);
  }
}