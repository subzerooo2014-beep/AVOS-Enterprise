import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { KnowledgeCapitalService } from "./capital.service";
import { KnowledgeCapitalRecord } from "./capital.types";

@Controller("knowledge-fabric/capital")
export class KnowledgeCapitalController {
  constructor(private readonly service: KnowledgeCapitalService) {}

  @Get("status") status() { return this.service.status(); }
  @Get("records") list() { return this.service.list(); }
  @Get("records/:id") get(@Param("id") id: string) { return this.service.get(id); }
  @Post("records") create(@Body() body: Pick<KnowledgeCapitalRecord, "name" | "description"> & Partial<Pick<KnowledgeCapitalRecord, "score" | "metadata">>) { return this.service.create(body); }
  @Post("records/:id/activate") activate(@Param("id") id: string) { return this.service.activate(id); }
  @Post("records/:id/suspend") suspend(@Param("id") id: string) { return this.service.suspend(id); }
  @Get("records/:id/evaluate") evaluate(@Param("id") id: string) { return this.service.evaluate(id); }
}