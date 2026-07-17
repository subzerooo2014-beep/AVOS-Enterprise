import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { MetadataAnalyticsService } from "./analytics.service";
import { MetadataAnalyticsRecord } from "./analytics.types";

@Controller("enterprise-metadata-layer/analytics")
export class MetadataAnalyticsController {
  constructor(private readonly service: MetadataAnalyticsService) {}

  @Get("status") status() { return this.service.status(); }
  @Get("records") list() { return this.service.list(); }
  @Get("records/:id") get(@Param("id") id: string) { return this.service.get(id); }
  @Post("records") create(@Body() body: Pick<MetadataAnalyticsRecord, "name" | "description"> & Partial<Pick<MetadataAnalyticsRecord, "score" | "metadata">>) { return this.service.create(body); }
  @Post("records/:id/activate") activate(@Param("id") id: string) { return this.service.activate(id); }
  @Post("records/:id/archive") archive(@Param("id") id: string) { return this.service.archive(id); }
  @Get("records/:id/evaluate") evaluate(@Param("id") id: string) { return this.service.evaluate(id); }
}