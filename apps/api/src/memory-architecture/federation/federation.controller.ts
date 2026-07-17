import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { MemoryFederationService } from "./federation.service";
import { MemoryFederationRecord } from "./federation.types";

@Controller("memory-architecture/federation")
export class MemoryFederationController {
  constructor(private readonly service: MemoryFederationService) {}

  @Get("status") status() { return this.service.status(); }
  @Get("records") list() { return this.service.list(); }
  @Get("records/:id") get(@Param("id") id: string) { return this.service.get(id); }
  @Post("records") create(@Body() body: Pick<MemoryFederationRecord, "name" | "description"> & Partial<Pick<MemoryFederationRecord, "score" | "metadata">>) { return this.service.create(body); }
  @Post("records/:id/activate") activate(@Param("id") id: string) { return this.service.activate(id); }
  @Post("records/:id/archive") archive(@Param("id") id: string) { return this.service.archive(id); }
  @Get("records/:id/evaluate") evaluate(@Param("id") id: string) { return this.service.evaluate(id); }
}