import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { MetadataRegistryService } from "./registry.service";
import { MetadataRegistryRecord } from "./registry.types";

@Controller("enterprise-metadata-layer/registry")
export class MetadataRegistryController {
  constructor(private readonly service: MetadataRegistryService) {}

  @Get("status") status() { return this.service.status(); }
  @Get("records") list() { return this.service.list(); }
  @Get("records/:id") get(@Param("id") id: string) { return this.service.get(id); }
  @Post("records") create(@Body() body: Pick<MetadataRegistryRecord, "name" | "description"> & Partial<Pick<MetadataRegistryRecord, "score" | "metadata">>) { return this.service.create(body); }
  @Post("records/:id/activate") activate(@Param("id") id: string) { return this.service.activate(id); }
  @Post("records/:id/archive") archive(@Param("id") id: string) { return this.service.archive(id); }
  @Get("records/:id/evaluate") evaluate(@Param("id") id: string) { return this.service.evaluate(id); }
}