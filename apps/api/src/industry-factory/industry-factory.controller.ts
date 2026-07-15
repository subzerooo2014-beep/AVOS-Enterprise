import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { IndustryFactoryService } from "./industry-factory.service";
import {
  IndustryBlueprint,
  IndustryGenerationJob,
  IndustryInstallation,
  IndustryMarketplaceEntry,
} from "./industry-factory.types";

@Controller("industry-factory")
export class IndustryFactoryController {
  constructor(private readonly factory: IndustryFactoryService) {}

  @Get()
  framework() {
    return this.factory.framework();
  }

  @Post("blueprints")
  createBlueprint(
    @Body()
    input: Omit<
      IndustryBlueprint,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.factory.createBlueprint(input);
  }

  @Post("blueprints/:id/validate")
  validateBlueprint(@Param("id") id: string) {
    return this.factory.validateBlueprint(id);
  }

  @Patch("blueprints/:id/publish")
  publishBlueprint(@Param("id") id: string) {
    return this.factory.publishBlueprint(id);
  }

  @Post("blueprints/:id/generation-jobs")
  createGenerationJob(
    @Param("id") id: string,
    @Body() input: Pick<IndustryGenerationJob, "namespace" | "outputPath">,
  ) {
    return this.factory.createGenerationJob(id, input);
  }

  @Post("generation-jobs/:id/execute")
  executeGeneration(@Param("id") id: string) {
    return this.factory.executeGeneration(id);
  }

  @Post("generation-jobs/:id/installations")
  createInstallation(
    @Param("id") id: string,
    @Body()
    body: {
      targetEnvironment: IndustryInstallation["targetEnvironment"];
    },
  ) {
    return this.factory.createInstallation(id, body.targetEnvironment);
  }

  @Post("installations/:id/install")
  install(@Param("id") id: string) {
    return this.factory.install(id);
  }

  @Post("installations/:id/rollback")
  rollback(@Param("id") id: string) {
    return this.factory.rollback(id);
  }

  @Post("blueprints/:id/marketplace")
  createMarketplaceEntry(
    @Param("id") id: string,
    @Body()
    input: Pick<IndustryMarketplaceEntry, "publisher" | "visibility">,
  ) {
    return this.factory.createMarketplaceEntry(id, input);
  }

  @Patch("marketplace/:id/publish")
  publishMarketplaceEntry(@Param("id") id: string) {
    return this.factory.publishMarketplaceEntry(id);
  }

  @Get("blueprints")
  listBlueprints() {
    return this.factory.listBlueprints();
  }

  @Get("generation-jobs")
  listJobs() {
    return this.factory.listJobs();
  }

  @Get("command-center")
  commandCenter() {
    return this.factory.commandCenter();
  }
}