import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { IndustryPackIntegrationService } from "./industry-pack-integration.service";
import { IndustryCompatibilityResult } from "./industry-pack-integration.types";
import { INDUSTRY_PACK_CATALOG } from "./industry-pack-integration.registry";

@Controller("industry-pack-integration")
export class IndustryPackIntegrationController {
  constructor(private readonly integration: IndustryPackIntegrationService) {}

  @Get()
  catalog() {
    return this.integration.catalog();
  }

  @Post("packs/:packCode/discover")
  discoverPack(
    @Param("packCode") packCode: keyof typeof INDUSTRY_PACK_CATALOG,
    @Body() body: { capabilities: string[] },
  ) {
    return this.integration.discoverPack(packCode, body.capabilities);
  }

  @Post("packs/:packCode/compatibility")
  recordCompatibility(
    @Param("packCode") packCode: string,
    @Body() result: IndustryCompatibilityResult,
  ) {
    return this.integration.recordCompatibility(packCode, result);
  }

  @Post("packs/:packCode/adapters")
  createAdapter(@Param("packCode") packCode: string) {
    return this.integration.createAdapter(packCode);
  }

  @Patch("packs/:packCode/adapters/activate")
  activateAdapter(@Param("packCode") packCode: string) {
    return this.integration.activateAdapter(packCode);
  }

  @Post("packs/:packCode/migrations")
  createMigration(
    @Param("packCode") packCode: string,
    @Body() body: { targetCoreVersion?: string },
  ) {
    return this.integration.createMigration(
      packCode,
      body.targetCoreVersion ?? "1.0.0",
    );
  }

  @Post("migrations/:id/execute")
  executeMigration(@Param("id") id: string) {
    return this.integration.executeMigration(id);
  }

  @Get("packs")
  listPacks() {
    return this.integration.listPacks();
  }

  @Get("adapters")
  listAdapters() {
    return this.integration.listAdapters();
  }

  @Get("migrations")
  listMigrations() {
    return this.integration.listMigrations();
  }

  @Get("command-center")
  commandCenter() {
    return this.integration.commandCenter();
  }
}