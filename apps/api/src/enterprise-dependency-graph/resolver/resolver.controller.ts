import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { DependencyResolverService } from "./resolver.service";
import { DependencyResolverRecord } from "./resolver.types";

@Controller("enterprise-dependency-graph/resolver")
export class DependencyResolverController {
  constructor(private readonly service: DependencyResolverService) {}

  @Get("status") status() { return this.service.status(); }
  @Get("records") list() { return this.service.list(); }
  @Get("records/:id") get(@Param("id") id: string) { return this.service.get(id); }
  @Post("records") create(@Body() body: Pick<DependencyResolverRecord, "name" | "description"> & Partial<Pick<DependencyResolverRecord, "score" | "dependency">>) { return this.service.create(body); }
  @Post("records/:id/activate") activate(@Param("id") id: string) { return this.service.activate(id); }
  @Post("records/:id/archive") archive(@Param("id") id: string) { return this.service.archive(id); }
  @Get("records/:id/evaluate") evaluate(@Param("id") id: string) { return this.service.evaluate(id); }
}