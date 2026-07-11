import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ReputationService } from "./reputation.service";

@Controller("reputation")
export class ReputationController {
  constructor(private service: ReputationService) {}

  @Post("snapshot")
  snapshot(@Body() body: any) {
    return this.service.snapshot(body.entityType, body.entityId, body.metrics || {});
  }

  @Get()
  list() {
    return this.service.list();
  }

  @Get("timeline/:entityType/:entityId")
  timeline(@Param("entityType") entityType: string, @Param("entityId") entityId: string) {
    return this.service.timeline(entityType, entityId);
  }
}
