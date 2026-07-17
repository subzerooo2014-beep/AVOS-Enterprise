import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { KnowledgeAutomationService } from "./automation.service";
import { KnowledgeAutomationRecord } from "./automation.types";

@Controller("knowledge-fabric/automation")
export class KnowledgeAutomationController {
  constructor(private readonly service: KnowledgeAutomationService) {}

  @Get("status") status() { return this.service.status(); }
  @Get("records") list() { return this.service.list(); }
  @Get("records/:id") get(@Param("id") id: string) { return this.service.get(id); }
  @Post("records") create(@Body() body: Pick<KnowledgeAutomationRecord, "name" | "description"> & Partial<Pick<KnowledgeAutomationRecord, "score" | "metadata">>) { return this.service.create(body); }
  @Post("records/:id/activate") activate(@Param("id") id: string) { return this.service.activate(id); }
  @Post("records/:id/suspend") suspend(@Param("id") id: string) { return this.service.suspend(id); }
  @Get("records/:id/evaluate") evaluate(@Param("id") id: string) { return this.service.evaluate(id); }
}