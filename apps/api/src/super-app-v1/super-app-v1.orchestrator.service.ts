import { Injectable } from "@nestjs/common";
import { SuperAppAgentsService } from "./super-app-v1.agents.service";
import { SuperAppMemoryService } from "./super-app-v1.memory.service";
import { SuperAppWorkflowService } from "./super-app-v1.workflow.service";

@Injectable()
export class SuperAppOrchestratorService {
  constructor(
    private readonly memory: SuperAppMemoryService,
    private readonly agents: SuperAppAgentsService,
    private readonly workflows: SuperAppWorkflowService,
  ) {}

  execute(userId: string, intent: string) {
    this.memory.rememberQuery(userId, intent);
    const userMemory = this.memory.get(userId);
    const workflow = this.workflows.create(userId, intent);
    const agentResults = this.agents.runMesh(intent, userMemory);
    const completed = this.workflows.complete(workflow.id, agentResults);

    const overallScore = Math.round(
      agentResults.reduce((sum, result) => sum + result.score, 0) /
        agentResults.length,
    );

    return {
      success: true,
      system: "AVOS Super App Phase 1",
      workflow: completed,
      memory: userMemory,
      overallScore,
      completedAgents: agentResults.filter((result) => result.success).length,
      nextActions: [
        "review-recommended-vehicles",
        "compare-finance-offers",
        "request-insurance-quotes",
        "book-inspection",
      ],
    };
  }

  dashboard(userId: string) {
    const memory = this.memory.get(userId);
    const workflows = this.workflows
      .list()
      .filter((workflow) => workflow.userId === userId);

    return {
      success: true,
      userId,
      marketStatus: "ACTIVE",
      marketScore: 92,
      opportunities: 14,
      alerts: 3,
      activeWorkflows: workflows.filter(
        (workflow) => workflow.status === "RUNNING",
      ).length,
      completedWorkflows: workflows.filter(
        (workflow) => workflow.status === "COMPLETED",
      ).length,
      favorites: memory.favoriteVehicles.length,
      recentQueries: memory.lastQueries,
      agentMeshStatus: "READY",
    };
  }
}