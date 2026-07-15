import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { IndustryMegaBundle2Service } from "./industry-mega-bundle-2.service";
import {
  IndustryAsset,
  IndustryCode,
  IndustryOperation,
  IndustryRisk,
} from "./industry-mega-bundle-2.types";

@Controller("industry-mega-bundle-2")
export class IndustryMegaBundle2Controller {
  constructor(private readonly industries: IndustryMegaBundle2Service) {}

  @Get()
  framework() {
    return this.industries.framework();
  }

  @Post(":industry/assets")
  createAsset(
    @Param("industry") industry: IndustryCode,
    @Body()
    input: Omit<
      IndustryAsset,
      "id" | "industry" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.industries.createAsset(industry, input);
  }

  @Get("assets")
  listAssets(
    @Query("industry") industry?: IndustryCode,
    @Query("tenantId") tenantId?: string,
  ) {
    return this.industries.listAssets(industry, tenantId);
  }

  @Patch("assets/:id/activate")
  activateAsset(@Param("id") id: string) {
    return this.industries.activateAsset(id);
  }

  @Post(":industry/operations")
  createOperation(
    @Param("industry") industry: IndustryCode,
    @Body()
    input: Omit<
      IndustryOperation,
      "id" | "industry" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.industries.createOperation(industry, input);
  }

  @Patch("operations/:id/status")
  updateOperationStatus(
    @Param("id") id: string,
    @Body() body: { status: IndustryOperation["status"] },
  ) {
    return this.industries.updateOperationStatus(id, body.status);
  }

  @Post("risks")
  createRisk(
    @Body()
    input: Omit<IndustryRisk, "id" | "createdAt">,
  ) {
    return this.industries.createRisk(input);
  }

  @Get("dashboard")
  dashboard(@Query("industry") industry?: IndustryCode) {
    return this.industries.dashboard(industry);
  }
}