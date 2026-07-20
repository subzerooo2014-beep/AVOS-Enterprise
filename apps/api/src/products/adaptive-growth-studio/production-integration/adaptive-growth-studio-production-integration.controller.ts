import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AdaptiveGrowthStudioProductionIntegrationService } from "./adaptive-growth-studio-production-integration.service";

@Controller("avos/products/adaptive-growth-studio/frontend")
export class AdaptiveGrowthStudioProductionIntegrationController {
  constructor(private readonly integration: AdaptiveGrowthStudioProductionIntegrationService) {}

  @Get("bootstrap")
  bootstrap(@Query("tenantId") tenantId?: string, @Query("userId") userId?: string, @Query("workspaceId") workspaceId?: string) {
    return this.integration.bootstrap({ tenantId, userId, workspaceId });
  }

  @Get("navigation")
  navigation() { return this.integration.navigation(); }

  @Get("health")
  health() { return this.integration.healthStatus(); }

  @Post("workspaces")
  createWorkspace(@Body() body: any) { return this.integration.createWorkspace(body); }

  @Post("dashboards/executive")
  composeDashboard(@Body() body: any) { return this.integration.composeDashboard(body); }
}