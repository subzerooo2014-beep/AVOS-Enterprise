import {
  Body,
  Controller,
  Get,
  Post
} from "@nestjs/common";
import { CapabilityProductionBlueprint } from "./capability-production-persistence.contracts";
import { CapabilityProductionBundleBService } from "./capability-production-bundle-b.service";

@Controller("avos/factory/v1/capability-production-workspace")
export class CapabilityProductionBundleBController {
  constructor(
    private readonly service: CapabilityProductionBundleBService
  ) {}

  @Post("generate")
  generate(
    @Body() blueprint: CapabilityProductionBlueprint
  ) {
    return this.service.generateFoundation(blueprint);
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
      physicalFileWriter: true,
      workspaceBuilder: true,
      nestjsModuleComposer: true,
      humanFinalAuthority: true
    };
  }
}
