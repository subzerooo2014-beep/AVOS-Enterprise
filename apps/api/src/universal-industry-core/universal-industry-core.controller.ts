import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { UniversalIndustryCoreService } from "./universal-industry-core.service";
import {
  IndustryAsset,
  IndustryDefinition,
  IndustryDocument,
  IndustryFinancialEntry,
  IndustryInsight,
  IndustryKpi,
  IndustryPlugin,
  IndustryRisk,
  IndustryRuntimeInstance,
  IndustryTemplate,
  IndustryWorkflow,
} from "./universal-industry-core.types";

@Controller("universal-industry-core")
export class UniversalIndustryCoreController {
  constructor(private readonly core: UniversalIndustryCoreService) {}

  @Get()
  framework() {
    return this.core.framework();
  }

  @Post("industries")
  registerIndustry(
    @Body()
    input: Omit<
      IndustryDefinition,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.core.registerIndustry(input);
  }

  @Patch("industries/:id/activate")
  activateIndustry(@Param("id") id: string) {
    return this.core.activateIndustry(id);
  }

  @Post("industries/:code/runtimes")
  provisionRuntime(
    @Param("code") code: string,
    @Body()
    input: Omit<
      IndustryRuntimeInstance,
      "id" | "industryCode" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.core.provisionRuntime(code, input);
  }

  @Patch("runtimes/:id/activate")
  activateRuntime(@Param("id") id: string) {
    return this.core.activateRuntime(id);
  }

  @Post("runtimes/:id/workflows")
  createWorkflow(
    @Param("id") id: string,
    @Body()
    input: Omit<
      IndustryWorkflow,
      "id" | "runtimeId" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.core.createWorkflow(id, input);
  }

  @Patch("workflows/:id/activate")
  activateWorkflow(@Param("id") id: string) {
    return this.core.activateWorkflow(id);
  }

  @Post("runtimes/:id/assets")
  registerAsset(
    @Param("id") id: string,
    @Body()
    input: Omit<
      IndustryAsset,
      "id" | "runtimeId" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.core.registerAsset(id, input);
  }

  @Post("runtimes/:id/finance")
  recordFinancialEntry(
    @Param("id") id: string,
    @Body()
    input: Omit<IndustryFinancialEntry, "id" | "runtimeId" | "createdAt">,
  ) {
    return this.core.recordFinancialEntry(id, input);
  }

  @Post("runtimes/:id/risks")
  registerRisk(
    @Param("id") id: string,
    @Body()
    input: Omit<
      IndustryRisk,
      "id" | "runtimeId" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.core.registerRisk(id, input);
  }

  @Post("runtimes/:id/insights")
  createInsight(
    @Param("id") id: string,
    @Body()
    input: Omit<IndustryInsight, "id" | "runtimeId" | "createdAt">,
  ) {
    return this.core.createInsight(id, input);
  }

  @Post("runtimes/:id/kpis")
  recordKpi(
    @Param("id") id: string,
    @Body()
    input: Omit<
      IndustryKpi,
      "id" | "runtimeId" | "status" | "recordedAt"
    >,
  ) {
    return this.core.recordKpi(id, input);
  }

  @Post("runtimes/:id/documents")
  registerDocument(
    @Param("id") id: string,
    @Body()
    input: Omit<
      IndustryDocument,
      "id" | "runtimeId" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.core.registerDocument(id, input);
  }

  @Post("plugins")
  registerPlugin(
    @Body()
    input: Omit<IndustryPlugin, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    return this.core.registerPlugin(input);
  }

  @Post("templates")
  publishTemplate(
    @Body()
    input: Omit<
      IndustryTemplate,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.core.publishTemplate(input);
  }

  @Get("industries")
  listIndustries() {
    return this.core.listIndustries();
  }

  @Get("command-center")
  commandCenter() {
    return this.core.commandCenter();
  }
}