import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { DependencyCertificationService } from "./certification.service";
import { DependencyCertificationRecord } from "./certification.types";

@Controller("enterprise-dependency-graph/certification")
export class DependencyCertificationController {
  constructor(private readonly service: DependencyCertificationService) {}

  @Get("status") status() { return this.service.status(); }
  @Get("records") list() { return this.service.list(); }
  @Get("records/:id") get(@Param("id") id: string) { return this.service.get(id); }
  @Post("records") create(@Body() body: Pick<DependencyCertificationRecord, "name" | "description"> & Partial<Pick<DependencyCertificationRecord, "score" | "dependency">>) { return this.service.create(body); }
  @Post("records/:id/activate") activate(@Param("id") id: string) { return this.service.activate(id); }
  @Post("records/:id/archive") archive(@Param("id") id: string) { return this.service.archive(id); }
  @Get("records/:id/evaluate") evaluate(@Param("id") id: string) { return this.service.evaluate(id); }
}