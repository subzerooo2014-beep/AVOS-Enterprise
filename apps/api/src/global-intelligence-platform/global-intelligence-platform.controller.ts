import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { GlobalIntelligencePlatformService } from "./global-intelligence-platform.service";
import {
  IntelligenceCapability,
  IntelligenceDecision,
  IntelligenceFeedback,
  IntelligenceNode,
  IntelligenceScenario,
} from "./global-intelligence-platform.types";

@Controller("global-intelligence-platform")
export class GlobalIntelligencePlatformController {
  constructor(
    private readonly intelligence: GlobalIntelligencePlatformService,
  ) {}

  @Get()
  framework() {
    return this.intelligence.framework();
  }

  @Post(":capability/nodes")
  registerNode(
    @Param("capability") capability: IntelligenceCapability,
    @Body()
    input: Omit<
      IntelligenceNode,
      "id" | "capability" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.intelligence.registerNode(capability, input);
  }

  @Get("nodes")
  listNodes(
    @Query("capability") capability?: IntelligenceCapability,
    @Query("tenantId") tenantId?: string,
  ) {
    return this.intelligence.listNodes(capability, tenantId);
  }

  @Patch("nodes/:id/activate")
  activateNode(@Param("id") id: string) {
    return this.intelligence.activateNode(id);
  }

  @Post("decisions")
  createDecision(
    @Body()
    input: Omit<
      IntelligenceDecision,
      "id" | "approvalStatus" | "executionStatus" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.intelligence.createDecision(input);
  }

  @Patch("decisions/:id/approval")
  approveDecision(
    @Param("id") id: string,
    @Body() body: { approved: boolean },
  ) {
    return this.intelligence.approveDecision(id, body.approved);
  }

  @Post("decisions/:id/execute")
  executeDecision(@Param("id") id: string) {
    return this.intelligence.executeDecision(id);
  }

  @Post("scenarios")
  simulateScenario(
    @Body()
    input: Omit<IntelligenceScenario, "id" | "createdAt">,
  ) {
    return this.intelligence.simulateScenario(input);
  }

  @Post("decisions/:id/feedback")
  recordFeedback(
    @Param("id") id: string,
    @Body()
    input: Omit<
      IntelligenceFeedback,
      "id" | "decisionId" | "createdAt"
    >,
  ) {
    return this.intelligence.recordFeedback(id, input);
  }

  @Get("command-center")
  commandCenter() {
    return this.intelligence.commandCenter();
  }
}