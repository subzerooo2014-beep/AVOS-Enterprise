import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { MetadataRelationshipService } from "./relationship.service";
import { MetadataRelationshipRecord } from "./relationship.types";

@Controller("enterprise-metadata-layer/relationship")
export class MetadataRelationshipController {
  constructor(private readonly service: MetadataRelationshipService) {}

  @Get("status") status() { return this.service.status(); }
  @Get("records") list() { return this.service.list(); }
  @Get("records/:id") get(@Param("id") id: string) { return this.service.get(id); }
  @Post("records") create(@Body() body: Pick<MetadataRelationshipRecord, "name" | "description"> & Partial<Pick<MetadataRelationshipRecord, "score" | "metadata">>) { return this.service.create(body); }
  @Post("records/:id/activate") activate(@Param("id") id: string) { return this.service.activate(id); }
  @Post("records/:id/archive") archive(@Param("id") id: string) { return this.service.archive(id); }
  @Get("records/:id/evaluate") evaluate(@Param("id") id: string) { return this.service.evaluate(id); }
}