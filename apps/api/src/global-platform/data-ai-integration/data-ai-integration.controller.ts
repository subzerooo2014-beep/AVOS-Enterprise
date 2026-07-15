import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { DataAiIntegrationService } from "./data-ai-integration.service";
import {
  AiModelRegistration,
  FeatureDefinition,
  GlobalDataAsset,
  IntegrationEndpoint,
} from "./data-ai-integration.types";

@Controller("global-platform/data-ai")
export class DataAiIntegrationController {
  constructor(
    private readonly platform: DataAiIntegrationService,
  ) {}

  @Get("health")
  health() {
    return this.platform.getHealth();
  }

  @Get("assets")
  assets() {
    return this.platform.listDataAssets();
  }

  @Post("assets")
  registerAsset(
    @Body()
    input: Omit<GlobalDataAsset, "id" | "createdAt" | "updatedAt">,
  ) {
    return this.platform.registerDataAsset(input);
  }

  @Get("models")
  models() {
    return this.platform.listModels();
  }

  @Post("models")
  registerModel(
    @Body()
    input: Omit<AiModelRegistration, "id" | "createdAt" | "updatedAt">,
  ) {
    return this.platform.registerModel(input);
  }

  @Patch("models/:id/deploy")
  deployModel(@Param("id") id: string) {
    return this.platform.deployModel(id);
  }

  @Get("features")
  features() {
    return this.platform.listFeatures();
  }

  @Post("features")
  registerFeature(
    @Body()
    input: Omit<FeatureDefinition, "id" | "createdAt">,
  ) {
    return this.platform.registerFeature(input);
  }

  @Get("integrations")
  integrations() {
    return this.platform.listIntegrations();
  }

  @Post("integrations")
  registerIntegration(
    @Body()
    input: Omit<IntegrationEndpoint, "id" | "createdAt" | "updatedAt">,
  ) {
    return this.platform.registerIntegration(input);
  }

  @Post("governance/evaluate")
  evaluateGovernance(
    @Body()
    body: {
      classification: GlobalDataAsset["classification"];
      crossRegion: boolean;
      encrypted: boolean;
    },
  ) {
    return this.platform.evaluateGovernance(
      body.classification,
      body.crossRegion,
      body.encrypted,
    );
  }

  @Get("events")
  events() {
    return this.platform.listEvents();
  }
}