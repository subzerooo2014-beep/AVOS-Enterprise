import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ArchitectureObservatoryService } from "./observatory.service";
import { ArchitectureObservatoryRecord } from "./observatory.types";

@Controller("architecture-intelligence/observatory")
export class ArchitectureObservatoryController {
  constructor(private readonly service: ArchitectureObservatoryService) {}

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
    body: Pick<ArchitectureObservatoryRecord, "name" | "description"> &
      Partial<Pick<ArchitectureObservatoryRecord, "score" | "architecture" | "findings">>,
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