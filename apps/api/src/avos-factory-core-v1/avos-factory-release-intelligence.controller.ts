import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query
} from "@nestjs/common";
import {
  AvosFactoryDeploymentLearningService
} from "./avos-factory-deployment-learning.service";
import {
  AvosFactoryReleaseIntelligenceService
} from "./avos-factory-release-intelligence.service";
import {
  AvosFactoryContinuousImprovementService
} from "./avos-factory-continuous-improvement.service";
import {
  AvosFactoryReleaseLearningMemoryService
} from "./avos-factory-release-learning-memory.service";
import {
  AvosFactoryReleaseIntelligenceSmokeService
} from "./avos-factory-release-intelligence-smoke.service";

@Controller("avos/factory/v1/release-intelligence")
export class AvosFactoryReleaseIntelligenceController {
  constructor(
    private readonly learning: AvosFactoryDeploymentLearningService,
    private readonly intelligence: AvosFactoryReleaseIntelligenceService,
    private readonly improvement: AvosFactoryContinuousImprovementService,
    private readonly memory: AvosFactoryReleaseLearningMemoryService,
    private readonly smoke: AvosFactoryReleaseIntelligenceSmokeService
  ) {}

  @Post("analyze")
  analyze(
    @Body()
    input: Parameters<
      AvosFactoryReleaseIntelligenceService["analyze"]
    >[0]
  ) {
    return this.intelligence.analyze(input);
  }

  @Get("reports")
  reports(@Query("limit") limit?: string) {
    const parsed = Number(limit);

    return {
      items: this.intelligence.list(
        Number.isFinite(parsed) ? Math.trunc(parsed) : 100
      )
    };
  }

  @Get("reports/:id")
  report(@Param("id") id: string) {
    return this.intelligence.get(id) ?? null;
  }

  @Get("signals")
  signals(@Query("limit") limit?: string) {
    const parsed = Number(limit);

    return {
      items: this.learning.list(
        Number.isFinite(parsed) ? Math.trunc(parsed) : 200
      )
    };
  }

  @Post("improvements/propose")
  propose(
    @Body()
    input: Parameters<
      AvosFactoryContinuousImprovementService["propose"]
    >[0]
  ) {
    return this.improvement.propose(input);
  }

  @Post("improvements/approve")
  approve(
    @Body()
    input: Parameters<
      AvosFactoryContinuousImprovementService["approve"]
    >[0]
  ) {
    return this.improvement.approve(input);
  }

  @Post("improvements/implement")
  implement(
    @Body()
    input: Parameters<
      AvosFactoryContinuousImprovementService["implement"]
    >[0]
  ) {
    return this.improvement.implement(input);
  }

  @Get("improvements")
  improvements(@Query("limit") limit?: string) {
    const parsed = Number(limit);

    return {
      items: this.improvement.list(
        Number.isFinite(parsed) ? Math.trunc(parsed) : 200
      )
    };
  }

  @Post("memory/capture")
  captureMemory(
    @Body()
    input: Parameters<
      AvosFactoryReleaseLearningMemoryService["capture"]
    >[0]
  ) {
    return this.memory.capture(input);
  }

  @Get("memory")
  memoryList(@Query("limit") limit?: string) {
    const parsed = Number(limit);

    return {
      items: this.memory.list(
        Number.isFinite(parsed) ? Math.trunc(parsed) : 200
      )
    };
  }

  @Post("smoke/run")
  smokeRun() {
    return this.smoke.run();
  }
}
