import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EnterpriseEcosystemService } from "./enterprise-ecosystem.service";
import {
  EcosystemExecutionRequest,
  EcosystemPartner,
} from "./enterprise-ecosystem.types";

@Controller("enterprise-ecosystem")
export class EnterpriseEcosystemController {
  constructor(private readonly ecosystem: EnterpriseEcosystemService) {}

  @Get("health")
  health() {
    return this.ecosystem.health();
  }

  @Get("hubs")
  hubs() {
    return this.ecosystem.hubs();
  }

  @Get("hubs/:key")
  hub(@Param("key") key: string) {
    return this.ecosystem.hub(key);
  }

  @Post("partners")
  registerPartner(
    @Body()
    input: Omit<EcosystemPartner, "id" | "active" | "createdAt">,
  ) {
    return this.ecosystem.registerPartner(input);
  }

  @Get("hubs/:key/partners")
  partnersForHub(@Param("key") key: string) {
    return this.ecosystem.partnersForHub(key);
  }

  @Post("hubs/:key/execute")
  execute(
    @Param("key") key: string,
    @Body() request: EcosystemExecutionRequest,
  ) {
    return this.ecosystem.execute(key, request);
  }
}