import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { MemoryAnalyticsService } from "./analytics.service";
import { MemoryAnalyticsRecord } from "./analytics.types";

@Controller("memory-architecture/analytics")
export class MemoryAnalyticsController {
  constructor(private readonly service: MemoryAnalyticsService) {}

  @Get("status") status() { return this.service.status(); }
  @Get("records") list() { return this.service.list(); }
  @Get("records/:id") get(@Param("id") id: string) { return this.service.get(id); }
  @Post("records") create(@Body() body: Pick<MemoryAnalyticsRecord, "name" | "description"> & Partial<Pick<MemoryAnalyticsRecord, "score" | "metadata">>) { return this.service.create(body); }
  @Post("records/:id/activate") activate(@Param("id") id: string) { return this.service.activate(id); }
  @Post("records/:id/archive") archive(@Param("id") id: string) { return this.service.archive(id); }
  @Get("records/:id/evaluate") evaluate(@Param("id") id: string) { return this.service.evaluate(id); }
}