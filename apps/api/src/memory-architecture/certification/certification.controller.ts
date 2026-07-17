import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { MemoryCertificationService } from "./certification.service";
import { MemoryCertificationRecord } from "./certification.types";

@Controller("memory-architecture/certification")
export class MemoryCertificationController {
  constructor(private readonly service: MemoryCertificationService) {}

  @Get("status") status() { return this.service.status(); }
  @Get("records") list() { return this.service.list(); }
  @Get("records/:id") get(@Param("id") id: string) { return this.service.get(id); }
  @Post("records") create(@Body() body: Pick<MemoryCertificationRecord, "name" | "description"> & Partial<Pick<MemoryCertificationRecord, "score" | "metadata">>) { return this.service.create(body); }
  @Post("records/:id/activate") activate(@Param("id") id: string) { return this.service.activate(id); }
  @Post("records/:id/archive") archive(@Param("id") id: string) { return this.service.archive(id); }
  @Get("records/:id/evaluate") evaluate(@Param("id") id: string) { return this.service.evaluate(id); }
}