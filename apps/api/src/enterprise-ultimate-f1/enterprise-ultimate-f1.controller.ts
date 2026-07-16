import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { EnterpriseUltimateF1Service } from "./enterprise-ultimate-f1.service";
import {
  F1Activity,
  F1Command,
  F1Recommendation,
  F1Widget,
  F1Workspace,
} from "./enterprise-ultimate-f1.types";

@Controller("enterprise-ultimate-f1")
export class EnterpriseUltimateF1Controller {
  constructor(private readonly service: EnterpriseUltimateF1Service) {}

  @Get()
  framework() {
    return this.service.framework();
  }

  @Post("workspaces")
  createWorkspace(
    @Body() input: Omit<F1Workspace, "id" | "createdAt" | "updatedAt">,
  ) {
    return this.service.createWorkspace(input);
  }

  @Post("widgets")
  createWidget(
    @Body() input: Omit<F1Widget, "id" | "createdAt" | "updatedAt">,
  ) {
    return this.service.createWidget(input);
  }

  @Post("workspaces/:workspaceId/widgets/:widgetId")
  attachWidget(
    @Param("workspaceId") workspaceId: string,
    @Param("widgetId") widgetId: string,
  ) {
    return this.service.attachWidget(workspaceId, widgetId);
  }

  @Post("activities")
  publishActivity(
    @Body() input: Omit<F1Activity, "id" | "createdAt">,
  ) {
    return this.service.publishActivity(input);
  }

  @Post("commands")
  dispatchCommand(
    @Body()
    input: Omit<F1Command, "id" | "status" | "result" | "createdAt" | "updatedAt">,
  ) {
    return this.service.dispatchCommand(input);
  }

  @Post("recommendations")
  createRecommendation(
    @Body()
    input: Omit<F1Recommendation, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    return this.service.createRecommendation(input);
  }

  @Patch("recommendations/:id/accept")
  acceptRecommendation(@Param("id") id: string) {
    return this.service.acceptRecommendation(id);
  }

  @Get("search")
  search(@Query("q") query: string, @Query("tenantId") tenantId?: string) {
    return this.service.search(query ?? "", tenantId);
  }

  @Get("business-pulse/:tenantId")
  businessPulse(@Param("tenantId") tenantId: string) {
    return this.service.businessPulse(tenantId);
  }

  @Get("command-center")
  commandCenter(@Query("tenantId") tenantId?: string) {
    return this.service.commandCenter(tenantId);
  }
}