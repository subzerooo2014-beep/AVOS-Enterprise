import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { DependencyRegistryService } from "./registry.service";
import { DependencyRegistryRecord } from "./registry.types";

@Controller("enterprise-dependency-graph/registry")
export class DependencyRegistryController {
  constructor(private readonly service: DependencyRegistryService) {}

  @Get("status") status() { return this.service.status(); }
  @Get("records") list() { return this.service.list(); }
  @Get("records/:id") get(@Param("id") id: string) { return this.service.get(id); }
  @Post("records") create(@Body() body: Pick<DependencyRegistryRecord, "name" | "description"> & Partial<Pick<DependencyRegistryRecord, "score" | "dependency">>) { return this.service.create(body); }
  @Post("records/:id/activate") activate(@Param("id") id: string) { return this.service.activate(id); }
  @Post("records/:id/archive") archive(@Param("id") id: string) { return this.service.archive(id); }
  @Get("records/:id/evaluate") evaluate(@Param("id") id: string) { return this.service.evaluate(id); }
}