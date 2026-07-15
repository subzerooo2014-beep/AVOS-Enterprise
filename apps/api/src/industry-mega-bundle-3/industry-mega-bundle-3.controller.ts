import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { IndustryMegaBundle3Service } from "./industry-mega-bundle-3.service";
import {
  IndustryAiDecision,
  IndustryCode,
  IndustryEntity,
  IndustryTransaction,
} from "./industry-mega-bundle-3.types";

@Controller("industry-mega-bundle-3")
export class IndustryMegaBundle3Controller {
  constructor(private readonly industries: IndustryMegaBundle3Service) {}

  @Get()
  framework() {
    return this.industries.framework();
  }

  @Post(":industry/entities")
  createEntity(
    @Param("industry") industry: IndustryCode,
    @Body()
    input: Omit<
      IndustryEntity,
      "id" | "industry" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.industries.createEntity(industry, input);
  }

  @Get("entities")
  listEntities(
    @Query("industry") industry?: IndustryCode,
    @Query("tenantId") tenantId?: string,
  ) {
    return this.industries.listEntities(industry, tenantId);
  }

  @Patch("entities/:id/activate")
  activateEntity(@Param("id") id: string) {
    return this.industries.activateEntity(id);
  }

  @Post(":industry/transactions")
  createTransaction(
    @Param("industry") industry: IndustryCode,
    @Body()
    input: Omit<
      IndustryTransaction,
      "id" | "industry" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.industries.createTransaction(industry, input);
  }

  @Patch("transactions/:id/status")
  updateTransactionStatus(
    @Param("id") id: string,
    @Body() body: { status: IndustryTransaction["status"] },
  ) {
    return this.industries.updateTransactionStatus(id, body.status);
  }

  @Post("ai/decisions")
  createDecision(
    @Body()
    input: Omit<IndustryAiDecision, "id" | "createdAt">,
  ) {
    return this.industries.createDecision(input);
  }

  @Get("dashboard")
  dashboard(@Query("industry") industry?: IndustryCode) {
    return this.industries.dashboard(industry);
  }
}