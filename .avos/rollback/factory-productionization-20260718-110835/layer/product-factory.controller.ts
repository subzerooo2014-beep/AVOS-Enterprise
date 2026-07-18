import { Body, Controller, Get, Post } from "@nestjs/common";
import { ProductFactoryRequest } from "./product-factory.contracts";
import { ProductFactoryOrchestratorService } from "./product-factory-orchestrator.service";

@Controller("avos/factory/v1/product-factory")
export class ProductFactoryController {
  constructor(
    private readonly orchestrator: ProductFactoryOrchestratorService
  ) {}

  @Post("execute")
  execute(@Body() request: ProductFactoryRequest) {
    return this.orchestrator.execute(request);
  }

  @Post("smoke/run")
  smoke() {
    return this.orchestrator.smoke();
  }

  @Get("health")
  health() {
    return this.orchestrator.health();
  }
}
