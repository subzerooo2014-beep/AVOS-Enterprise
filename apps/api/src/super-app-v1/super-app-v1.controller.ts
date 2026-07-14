import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { SuperAppMemoryService } from "./super-app-v1.memory.service";
import { SuperAppOrchestratorService } from "./super-app-v1.orchestrator.service";

@Controller("super-app-v1")
export class SuperAppV1Controller {
  constructor(
    private readonly orchestrator: SuperAppOrchestratorService,
    private readonly memory: SuperAppMemoryService,
  ) {}

  @Post("execute")
  execute(
    @Body()
    body: {
      userId?: string;
      intent?: string;
    },
  ) {
    return this.orchestrator.execute(
      body?.userId || "demo-user",
      body?.intent || "I want to buy a trusted family SUV",
    );
  }

  @Get("dashboard/:userId")
  dashboard(@Param("userId") userId: string) {
    return this.orchestrator.dashboard(userId);
  }

  @Get("memory/:userId")
  getMemory(@Param("userId") userId: string) {
    return this.memory.get(userId);
  }

  @Post("memory/:userId")
  updateMemory(
    @Param("userId") userId: string,
    @Body()
    body: {
      preferredCategories?: string[];
      preferredBudget?: number;
      preferredCities?: string[];
      viewedVehicles?: string[];
      favoriteVehicles?: string[];
      lastQueries?: string[];
    },
  ) {
    return this.memory.update(userId, body || {});
  }

  @Post("smoke")
  smoke() {
    const result = this.orchestrator.execute(
      "smoke-user",
      "Buy a trusted Land Cruiser with finance and insurance",
    );

    return {
      success:
        result.success &&
        result.workflow.status === "COMPLETED" &&
        result.completedAgents === 7,
      system: "AVOS Super App Phase 1",
      integrationStatus: "running",
      workflowStatus: result.workflow.status,
      completedAgents: result.completedAgents,
      workflowSteps: result.workflow.steps.length,
      overallScore: result.overallScore,
      memoryQueries: result.memory.lastQueries.length,
      capabilities: 6,
    };
  }
}