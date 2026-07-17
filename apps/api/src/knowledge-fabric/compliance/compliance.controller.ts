import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { KnowledgeControlComplianceService } from "./compliance.service";
import { KnowledgeComplianceRecord } from "./compliance.types";

@Controller("knowledge-fabric/compliance")
export class KnowledgeComplianceController {
  constructor(private readonly service: KnowledgeControlComplianceService) {}

  @Get("status") status() { return this.service.status(); }
  @Get("records") list() { return this.service.list(); }
  @Get("records/:id") get(@Param("id") id: string) { return this.service.get(id); }
  @Post("records") create(@Body() body: Pick<KnowledgeComplianceRecord, "name" | "description"> & Partial<Pick<KnowledgeComplianceRecord, "score" | "metadata">>) { return this.service.create(body); }
  @Post("records/:id/activate") activate(@Param("id") id: string) { return this.service.activate(id); }
  @Post("records/:id/suspend") suspend(@Param("id") id: string) { return this.service.suspend(id); }
  @Get("records/:id/evaluate") evaluate(@Param("id") id: string) { return this.service.evaluate(id); }
}