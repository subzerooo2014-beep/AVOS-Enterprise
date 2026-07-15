import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { GrowthRevenueExpansionService } from "./growth-revenue-expansion.service";
import {
  GrowthCapability,
  GrowthExperiment,
  GrowthInitiative,
  RevenueOpportunity,
} from "./growth-revenue-expansion.types";

@Controller("growth-revenue-expansion")
export class GrowthRevenueExpansionController {
  constructor(
    private readonly growth: GrowthRevenueExpansionService,
  ) {}

  @Get()
  framework() {
    return this.growth.framework();
  }

  @Post(":capability/initiatives")
  createInitiative(
    @Param("capability") capability: GrowthCapability,
    @Body()
    input: Omit<
      GrowthInitiative,
      "id" | "capability" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.growth.createInitiative(capability, input);
  }

  @Get("initiatives")
  listInitiatives(
    @Query("capability") capability?: GrowthCapability,
    @Query("tenantId") tenantId?: string,
  ) {
    return this.growth.listInitiatives(capability, tenantId);
  }

  @Patch("initiatives/:id/activate")
  activateInitiative(@Param("id") id: string) {
    return this.growth.activateInitiative(id);
  }

  @Patch("initiatives/:id/progress")
  updateProgress(
    @Param("id") id: string,
    @Body() body: { currentValue: number },
  ) {
    return this.growth.updateProgress(id, body.currentValue);
  }

  @Post("initiatives/:id/experiments")
  createExperiment(
    @Param("id") id: string,
    @Body()
    input: Omit<
      GrowthExperiment,
      "id" | "initiativeId" | "winner" | "status" | "createdAt" | "completedAt"
    >,
  ) {
    return this.growth.createExperiment(id, input);
  }

  @Post("experiments/:id/complete")
  completeExperiment(
    @Param("id") id: string,
    @Body()
    input: {
      controlValue: number;
      variantValue: number;
      confidence: number;
    },
  ) {
    return this.growth.completeExperiment(id, input);
  }

  @Post("revenue-opportunities")
  createRevenueOpportunity(
    @Body()
    input: Omit<
      RevenueOpportunity,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.growth.createRevenueOpportunity(input);
  }

  @Patch("revenue-opportunities/:id/status")
  updateOpportunityStatus(
    @Param("id") id: string,
    @Body() body: { status: RevenueOpportunity["status"] },
  ) {
    return this.growth.updateOpportunityStatus(id, body.status);
  }

  @Get("command-center")
  commandCenter() {
    return this.growth.commandCenter();
  }
}