import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { TrustEngineService } from "./trust-engine.service";

@Controller("trust-engine")
export class TrustEngineController {
  constructor(private service: TrustEngineService) {}

  @Post("profile")
  buildProfile(@Body() body: any) {
    return this.service.buildProfile(body.entityType, body.entityId, body.factors || {});
  }

  @Get("profiles")
  listProfiles() {
    return this.service.listProfiles();
  }

  @Get("explain/:entityType/:entityId")
  explain(@Param("entityType") entityType: string, @Param("entityId") entityId: string) {
    return this.service.explain(entityType, entityId);
  }
}
