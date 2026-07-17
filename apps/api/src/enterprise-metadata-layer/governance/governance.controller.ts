import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { MetadataGovernanceService } from "./governance.service";
import { MetadataGovernanceRecord } from "./governance.types";

@Controller("enterprise-metadata-layer/governance")
export class MetadataGovernanceController {
  constructor(private readonly service: MetadataGovernanceService) {}

  @Get("status") status() { return this.service.status(); }
  @Get("records") list() { return this.service.list(); }
  @Get("records/:id") get(@Param("id") id: string) { return this.service.get(id); }
  @Post("records") create(@Body() body: Pick<MetadataGovernanceRecord, "name" | "description"> & Partial<Pick<MetadataGovernanceRecord, "score" | "metadata">>) { return this.service.create(body); }
  @Post("records/:id/activate") activate(@Param("id") id: string) { return this.service.activate(id); }
  @Post("records/:id/archive") archive(@Param("id") id: string) { return this.service.archive(id); }
  @Get("records/:id/evaluate") evaluate(@Param("id") id: string) { return this.service.evaluate(id); }
}