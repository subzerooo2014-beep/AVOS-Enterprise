import {
  Body,
  Controller,
  Get,
  Post
} from "@nestjs/common";
import { RuntimeSmokeExecutionRequest } from "./runtime-smoke-executor.contracts";
import { RuntimeSmokeExecutorService } from "./runtime-smoke-executor.service";
import { CapabilityProductionMegaBundleCService } from "./capability-production-mega-bundle-c.service";

@Controller("avos/factory/v1/capability-production-runtime")
export class RuntimeSmokeExecutorController {
  constructor(
    private readonly runtime: RuntimeSmokeExecutorService,
    private readonly generator: CapabilityProductionMegaBundleCService
  ) {}

  @Post("smoke/run")
  execute(
    @Body() request: RuntimeSmokeExecutionRequest
  ) {
    return this.runtime.execute(request);
  }

  @Post("smoke/generated")
  executeGeneratedSmoke() {
    const generated = this.generator.generate({
      name: "Factory Runtime Smoke Capability",
      version: "1.0.0",
      description:
        "AVOS Factory Part 43 end-to-end runtime smoke capability.",
      domain: "factory",
      approvedBy: "human:khalifa"
    });

    const runtime = this.runtime.execute({
      workspacePath: generated.workspace.workspacePath,
      expectedFiles: [
        "src/factory-runtime-smoke-capability.service.ts",
        "src/factory-runtime-smoke-capability.module.ts",
        "src/factory-runtime-smoke-capability.controller.ts",
        "src/dto/create-factory-runtime-smoke-capability.dto.ts",
        "src/dto/update-factory-runtime-smoke-capability.dto.ts",
        "src/factory-runtime-smoke-capability.validator.ts",
        "test/factory-runtime-smoke-capability.service.spec.ts",
        "test/factory-runtime-smoke-capability.integration.spec.ts",
        "generation.manifest.json"
      ],
      requireHumanFinalAuthority: true
    });

    return {
      success: generated.success && runtime.success,
      score: runtime.score,
      generated,
      runtime
    };
  }

  @Get("health")
  health() {
    return this.runtime.health();
  }
}
