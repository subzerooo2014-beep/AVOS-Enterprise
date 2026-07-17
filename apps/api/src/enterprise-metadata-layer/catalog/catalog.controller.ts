import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { MetadataCatalogService } from "./catalog.service";
import { MetadataCatalogRecord } from "./catalog.types";

@Controller("enterprise-metadata-layer/catalog")
export class MetadataCatalogController {
  constructor(private readonly service: MetadataCatalogService) {}

  @Get("status") status() { return this.service.status(); }
  @Get("records") list() { return this.service.list(); }
  @Get("records/:id") get(@Param("id") id: string) { return this.service.get(id); }
  @Post("records") create(@Body() body: Pick<MetadataCatalogRecord, "name" | "description"> & Partial<Pick<MetadataCatalogRecord, "score" | "metadata">>) { return this.service.create(body); }
  @Post("records/:id/activate") activate(@Param("id") id: string) { return this.service.activate(id); }
  @Post("records/:id/archive") archive(@Param("id") id: string) { return this.service.archive(id); }
  @Get("records/:id/evaluate") evaluate(@Param("id") id: string) { return this.service.evaluate(id); }
}