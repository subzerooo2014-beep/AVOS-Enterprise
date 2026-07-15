import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { IndustryMegaBundle1Service } from "./industry-mega-bundle-1.service";
import {
  IndustryAiInsight,
  IndustryCode,
  IndustryMetric,
  IndustryRecord,
} from "./industry-mega-bundle-1.types";

@Controller("industry-mega-bundle-1")
export class IndustryMegaBundle1Controller {
  constructor(private readonly industries: IndustryMegaBundle1Service) {}

  @Get()
  framework() {
    return this.industries.framework();
  }

  @Post(":industry/records")
  createRecord(
    @Param("industry") industry: IndustryCode,
    @Body()
    input: Omit<
      IndustryRecord,
      "id" | "industry" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.industries.createRecord(industry, input);
  }

  @Get("records")
  listRecords(
    @Query("industry") industry?: IndustryCode,
    @Query("tenantId") tenantId?: string,
  ) {
    return this.industries.listRecords(industry, tenantId);
  }

  @Patch("records/:id/activate")
  activateRecord(@Param("id") id: string) {
    return this.industries.activateRecord(id);
  }

  @Patch("records/:id/complete")
  completeRecord(@Param("id") id: string) {
    return this.industries.completeRecord(id);
  }

  @Post("metrics")
  recordMetric(@Body() input: IndustryMetric) {
    return this.industries.recordMetric(input);
  }

  @Post("ai/insights")
  createInsight(
    @Body()
    input: Omit<IndustryAiInsight, "id" | "createdAt">,
  ) {
    return this.industries.createInsight(input);
  }

  @Get("dashboard")
  dashboard(@Query("industry") industry?: IndustryCode) {
    return this.industries.dashboard(industry);
  }
}