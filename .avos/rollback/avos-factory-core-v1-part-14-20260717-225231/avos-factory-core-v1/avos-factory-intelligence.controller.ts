import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query
} from "@nestjs/common";
import {
  AvosFactoryGenerationAnalyzerService
} from "./avos-factory-generation-analyzer.service";
import {
  AvosFactoryRecommendationEngineService
} from "./avos-factory-recommendation-engine.service";
import {
  AvosFactoryTemplateIntelligenceService
} from "./avos-factory-template-intelligence.service";
import {
  AvosFactoryBlueprintIntelligenceService
} from "./avos-factory-blueprint-intelligence.service";
import {
  AvosFactoryCapabilityIntelligenceService
} from "./avos-factory-capability-intelligence.service";
import {
  AvosFactoryLearningMemoryService
} from "./avos-factory-learning-memory.service";
import {
  AvosFactoryEnterpriseInsightsService
} from "./avos-factory-enterprise-insights.service";
import {
  AvosFactoryIntelligenceSmokeService
} from "./avos-factory-intelligence-smoke.service";

@Controller("avos/factory/v1/intelligence")
export class AvosFactoryIntelligenceController {
  constructor(
    private readonly analyzer: AvosFactoryGenerationAnalyzerService,
    private readonly recommendations: AvosFactoryRecommendationEngineService,
    private readonly templates: AvosFactoryTemplateIntelligenceService,
    private readonly blueprints: AvosFactoryBlueprintIntelligenceService,
    private readonly capabilities: AvosFactoryCapabilityIntelligenceService,
    private readonly memory: AvosFactoryLearningMemoryService,
    private readonly insights: AvosFactoryEnterpriseInsightsService,
    private readonly smoke: AvosFactoryIntelligenceSmokeService
  ) {}

  @Post("analysis/run")
  analyze(
    @Body()
    input: Parameters<AvosFactoryGenerationAnalyzerService["analyze"]>[0]
  ) {
    return this.analyzer.analyze(input);
  }

  @Get("analysis")
  analyses(@Query("limit") limit?: string) {
    const parsed = Number(limit);

    return {
      items: this.analyzer.list(
        Number.isFinite(parsed) ? Math.trunc(parsed) : 100
      )
    };
  }

  @Post("recommendations/:subjectId/generate")
  generateRecommendations(
    @Param("subjectId") subjectId: string
  ) {
    return {
      items: this.recommendations.generate(subjectId)
    };
  }

  @Post("recommendations/:id/decide")
  decideRecommendation(
    @Param("id") id: string,
    @Body()
    body: {
      status: "approved" | "rejected" | "implemented";
      actor: string;
      approvedBy: string;
      humanApproved: boolean;
    }
  ) {
    return this.recommendations.decide({
      recommendationId: id,
      ...body
    });
  }

  @Get("recommendations")
  recommendationList(@Query("limit") limit?: string) {
    const parsed = Number(limit);

    return {
      items: this.recommendations.list(
        Number.isFinite(parsed) ? Math.trunc(parsed) : 100
      )
    };
  }

  @Get("templates")
  templateIntelligence() {
    return {
      items: this.templates.calculate()
    };
  }

  @Get("blueprints")
  blueprintIntelligence() {
    return {
      items: this.blueprints.calculate()
    };
  }

  @Get("capabilities")
  capabilityIntelligence() {
    return {
      items: this.capabilities.calculate()
    };
  }

  @Post("memory/:subjectId/learn")
  learn(@Param("subjectId") subjectId: string) {
    return {
      items: this.memory.learn(subjectId)
    };
  }

  @Get("memory")
  memoryList(@Query("limit") limit?: string) {
    const parsed = Number(limit);

    return {
      items: this.memory.list(
        Number.isFinite(parsed) ? Math.trunc(parsed) : 100
      )
    };
  }

  @Get("insights")
  enterpriseInsights() {
    return this.insights.generate();
  }

  @Post("smoke/run")
  smokeRun() {
    return this.smoke.run();
  }
}
