import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { EnterpriseUltimateF5Service } from "./enterprise-ultimate-f5.service";
import {
  F5Activity,
  F5Briefing,
  F5DigitalEmployee,
  F5Mission,
  F5Workspace,
} from "./enterprise-ultimate-f5.types";

@Controller("enterprise-ultimate-f5")
export class EnterpriseUltimateF5Controller {
  constructor(private readonly service: EnterpriseUltimateF5Service) {}

  @Get()
  framework() {
    return this.service.framework();
  }

  @Post("workspaces")
  createWorkspace(
    @Body()
    input: Omit<F5Workspace, "id" | "status" | "createdAt" | "updatedAt">,
  ) {
    return this.service.createWorkspace(input);
  }

  @Patch("workspaces/:id/personalize")
  personalizeWorkspace(
    @Param("id") id: string,
    @Body()
    input: {
      theme?: F5Workspace["theme"];
      direction?: F5Workspace["direction"];
      widgets?: string[];
    },
  ) {
    return this.service.personalizeWorkspace(id, input);
  }

  @Post("missions")
  createMission(
    @Body()
    input: Omit<
      F5Mission,
      "id" | "status" | "progress" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.service.createMission(input);
  }

  @Patch("missions/:id/progress")
  updateMissionProgress(
    @Param("id") id: string,
    @Body() body: { progress: number },
  ) {
    return this.service.updateMissionProgress(id, body.progress);
  }

  @Post("briefings")
  createBriefing(
    @Body() input: Omit<F5Briefing, "id" | "createdAt">,
  ) {
    return this.service.createBriefing(input);
  }

  @Post("activities")
  publishActivity(
    @Body() input: Omit<F5Activity, "id" | "createdAt">,
  ) {
    return this.service.publishActivity(input);
  }

  @Post("digital-employees")
  createDigitalEmployee(
    @Body()
    input: Omit<
      F5DigitalEmployee,
      "id" | "status" | "assignedTasks" | "completedTasks" | "createdAt" | "updatedAt"
    >,
  ) {
    return this.service.createDigitalEmployee(input);
  }

  @Post("digital-employees/:id/assign")
  assignDigitalEmployee(@Param("id") id: string) {
    return this.service.assignDigitalEmployee(id);
  }

  @Post("digital-employees/:id/complete-task")
  completeDigitalEmployeeTask(@Param("id") id: string) {
    return this.service.completeDigitalEmployeeTask(id);
  }

  @Get("command-palette")
  commandPalette(
    @Query("q") query: string,
    @Query("tenantId") tenantId?: string,
  ) {
    return this.service.commandPalette(query ?? "", tenantId);
  }

  @Get("cockpit")
  cockpit(@Query("tenantId") tenantId?: string) {
    return this.service.cockpit(tenantId);
  }
}