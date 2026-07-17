import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { MemoryAiService } from "./ai.service";
import { MemoryAiRecord } from "./ai.types";

@Controller("memory-architecture/ai")
export class MemoryAiController {
  constructor(private readonly service: MemoryAiService) {}

  @Get("status") status() { return this.service.status(); }
  @Get("records") list() { return this.service.list(); }
  @Get("records/:id") get(@Param("id") id: string) { return this.service.get(id); }
  @Post("records") create(@Body() body: Pick<MemoryAiRecord, "name" | "description"> & Partial<Pick<MemoryAiRecord, "score" | "metadata">>) { return this.service.create(body); }
  @Post("records/:id/activate") activate(@Param("id") id: string) { return this.service.activate(id); }
  @Post("records/:id/archive") archive(@Param("id") id: string) { return this.service.archive(id); }
  @Get("records/:id/evaluate") evaluate(@Param("id") id: string) { return this.service.evaluate(id); }
}