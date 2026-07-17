import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ArchitectureRegistryService } from "./registry.service";
import { ArchitectureRegistryRecord } from "./registry.types";

@Controller("architecture-intelligence/registry")
export class ArchitectureRegistryController {
  constructor(private readonly service: ArchitectureRegistryService) {}

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
    body: Pick<ArchitectureRegistryRecord, "name" | "description"> &
      Partial<Pick<ArchitectureRegistryRecord, "score" | "architecture" | "findings">>,
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