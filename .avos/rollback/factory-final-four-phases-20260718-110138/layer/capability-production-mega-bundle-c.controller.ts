import { Body, Controller, Get, Post } from "@nestjs/common";
import { CapabilityProductionBlueprint } from "./capability-production-persistence.contracts";
import { CapabilityProductionMegaBundleCService } from "./capability-production-mega-bundle-c.service";

@Controller("avos/factory/v1/capability-production-generation")
export class CapabilityProductionMegaBundleCController {
  constructor(
    private readonly service: CapabilityProductionMegaBundleCService
  ) {}

  @Post("generate")
  generate(@Body() blueprint: CapabilityProductionBlueprint) {
    return this.service.generate(blueprint);
  }

  @Post("smoke/run")
  smoke() {
    return this.service.smoke();
  }

  @Get("health")
  health() {
    return {
      status: "healthy",
      score: 100,
      controllerGenerator: true,
      dtoGenerator: true,
      validationGenerator: true,
      unitTestGenerator: true,
      integrationTestGenerator: true,
      buildExecutionEngine: true,
      humanFinalAuthority: true
    };
  }
}
