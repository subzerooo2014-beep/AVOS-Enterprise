import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { AutonomousEnterpriseOsService } from "./autonomous-enterprise-os.service";
import {
  AutonomousCapability,
  AutonomousDecision,
  AutonomousEconomyItem,
  AutonomousEnterpriseDomain,
  AutonomousMission,
  AutonomousPolicy,
} from "./autonomous-enterprise-os.types";

@Controller("autonomous-enterprise-os")
export class AutonomousEnterpriseOsController {
  constructor(private readonly autonomous: AutonomousEnterpriseOsService) {}

  @Get()
  framework() {
    return this.autonomous.framework();
  }

  @Post(":domain/capabilities")
  registerCapability(
    @Param("domain") domain: AutonomousEnterpriseDomain,
    @Body()
    input: Omit<
      AutonomousCapability,
      "id" | "domain" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.autonomous.registerCapability(domain, input);
  }

  @Patch("capabilities/:id/activate")
  activateCapability(@Param("id") id: string) {
    return this.autonomous.activateCapability(id);
  }

  @Post("capabilities/:id/missions")
  createMission(
    @Param("id") id: string,
    @Body()
    input: Omit<
      AutonomousMission,
      "id" | "capabilityId" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.autonomous.createMission(id, input);
  }

  @Post("missions/:id/start")
  startMission(@Param("id") id: string) {
    return this.autonomous.startMission(id);
  }

  @Post("missions/:id/complete")
  completeMission(
    @Param("id") id: string,
    @Body() body: { evidence: string },
  ) {
    return this.autonomous.completeMission(id, body.evidence);
  }

  @Post("missions/:id/decisions")
  createDecision(
    @Param("id") id: string,
    @Body()
    input: Omit<
      AutonomousDecision,
      "id" | "missionId" | "approved" | "executed" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.autonomous.createDecision(id, input);
  }

  @Patch("decisions/:id/approve")
  approveDecision(@Param("id") id: string) {
    return this.autonomous.approveDecision(id);
  }

  @Post("decisions/:id/execute")
  executeDecision(@Param("id") id: string) {
    return this.autonomous.executeDecision(id);
  }

  @Post("policies")
  registerPolicy(
    @Body()
    input: Omit<AutonomousPolicy, "id" | "createdAt" | "updatedAt">,
  ) {
    return this.autonomous.registerPolicy(input);
  }

  @Post("economy/items")
  publishEconomyItem(
    @Body()
    input: Omit<
      AutonomousEconomyItem,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.autonomous.publishEconomyItem(input);
  }

  @Get("capabilities")
  listCapabilities(@Query("domain") domain?: AutonomousEnterpriseDomain) {
    return this.autonomous.listCapabilities(domain);
  }

  @Get("command-center")
  commandCenter() {
    return this.autonomous.commandCenter();
  }
}