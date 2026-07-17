import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ArchitectureEvolutionService } from "./evolution.service";
import { ArchitectureEvolutionRecord } from "./evolution.types";

@Controller("architecture-intelligence/evolution")
export class ArchitectureEvolutionController {
  constructor(private readonly service: ArchitectureEvolutionService) {}

  @Get("status")
  status() {
    return this.service.status();
  }

  @Get("records")
  list() {
    return this.service.list();
  }

  @Get("records/:id")
  get(@Param("id") id: string) {
    return this.service.get(id);
  }

  @Post("records")
  create(
    @Body()
    body: Pick<ArchitectureEvolutionRecord, "name" | "description"> &
      Partial<Pick<ArchitectureEvolutionRecord, "score" | "architecture" | "findings">>,
  ) {
    return this.service.create(body);
  }

  @Post("records/:id/activate")
  activate(@Param("id") id: string) {
    return this.service.activate(id);
  }

  @Post("records/:id/archive")
  archive(@Param("id") id: string) {
    return this.service.archive(id);
  }

  @Get("records/:id/assess")
  assess(@Param("id") id: string) {
    return this.service.assess(id);
  }
}