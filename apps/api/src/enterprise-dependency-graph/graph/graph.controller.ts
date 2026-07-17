import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { DependencyGraphService } from "./graph.service";
import { DependencyGraphRecord } from "./graph.types";

@Controller("enterprise-dependency-graph/graph")
export class DependencyGraphController {
  constructor(private readonly service: DependencyGraphService) {}

  @Get("status") status() { return this.service.status(); }
  @Get("records") list() { return this.service.list(); }
  @Get("records/:id") get(@Param("id") id: string) { return this.service.get(id); }
  @Post("records") create(@Body() body: Pick<DependencyGraphRecord, "name" | "description"> & Partial<Pick<DependencyGraphRecord, "score" | "dependency">>) { return this.service.create(body); }
  @Post("records/:id/activate") activate(@Param("id") id: string) { return this.service.activate(id); }
  @Post("records/:id/archive") archive(@Param("id") id: string) { return this.service.archive(id); }
  @Get("records/:id/evaluate") evaluate(@Param("id") id: string) { return this.service.evaluate(id); }
}