import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { MetadataLineageService } from "./lineage.service";
import { MetadataLineageRecord } from "./lineage.types";

@Controller("enterprise-metadata-layer/lineage")
export class MetadataLineageController {
  constructor(private readonly service: MetadataLineageService) {}

  @Get("status") status() { return this.service.status(); }
  @Get("records") list() { return this.service.list(); }
  @Get("records/:id") get(@Param("id") id: string) { return this.service.get(id); }
  @Post("records") create(@Body() body: Pick<MetadataLineageRecord, "name" | "description"> & Partial<Pick<MetadataLineageRecord, "score" | "metadata">>) { return this.service.create(body); }
  @Post("records/:id/activate") activate(@Param("id") id: string) { return this.service.activate(id); }
  @Post("records/:id/archive") archive(@Param("id") id: string) { return this.service.archive(id); }
  @Get("records/:id/evaluate") evaluate(@Param("id") id: string) { return this.service.evaluate(id); }
}