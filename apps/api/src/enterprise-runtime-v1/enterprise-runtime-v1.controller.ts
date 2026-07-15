import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EnterpriseRuntimeV1Service } from "./enterprise-runtime-v1.service";
import { EnterpriseRuntimeExecutionRequest } from "./enterprise-runtime-v1.types";

@Controller("enterprise-runtime/v1")
export class EnterpriseRuntimeV1Controller {
  constructor(private readonly runtime: EnterpriseRuntimeV1Service) {}

  @Get("health")
  health() {
    return this.runtime.health();
  }

  @Get("capabilities")
  capabilities() {
    return this.runtime.capabilities();
  }

  @Get("executions")
  executions() {
    return this.runtime.listExecutions();
  }

  @Get("executions/:id")
  execution(@Param("id") id: string) {
    return this.runtime.getExecution(id);
  }

  @Post("execute")
  execute(@Body() request: EnterpriseRuntimeExecutionRequest) {
    return this.runtime.execute(request);
  }
}