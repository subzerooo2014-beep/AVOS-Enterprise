import { Injectable } from "@nestjs/common";
import { AiAgentRegistryService } from "./ai-agent-registry.service";
import { AiExecutionOrchestratorService } from "./ai-execution-orchestrator.service";
import { AiMemoryRouterService } from "./ai-memory-router.service";
import { AiPolicyEngineService } from "./ai-policy-engine.service";
import { AiSkillRegistryService } from "./ai-skill-registry.service";
import { AiTaskPlannerService } from "./ai-task-planner.service";
import { AiToolRegistryService } from "./ai-tool-registry.service";
import type {
  AiPlatformHealth,
  AiPlatformMetrics,
} from "./enterprise-autonomous-ai.types";

@Injectable()
export class EnterpriseAutonomousAiPlatformService {
  constructor(
    private readonly agents: AiAgentRegistryService,
    private readonly skills: AiSkillRegistryService,
    private readonly tools: AiToolRegistryService,
    private readonly memories: AiMemoryRouterService,
    private readonly tasks: AiTaskPlannerService,
    private readonly executions: AiExecutionOrchestratorService,
    private readonly policies: AiPolicyEngineService,
  ) {}

  metrics(): AiPlatformMetrics {
    const tasks = this.tasks.list();
    const executions = this.executions.list();

    return {
      agents: this.agents.count(),
      skills: this.skills.count(),
      tools: this.tools.count(),
      memories: this.memories.count(),
      tasks: tasks.length,
      runningTasks: tasks.filter((item) => item.status === "RUNNING").length,
      completedTasks: tasks.filter((item) => item.status === "COMPLETED").length,
      failedTasks: tasks.filter((item) => item.status === "FAILED").length,
      executions: executions.length,
      deniedExecutions: executions.filter((item) => item.status === "DENIED")
        .length,
      policies: this.policies.count(),
    };
  }

  health(): AiPlatformHealth {
    const metrics = this.metrics();

    return {
      success: true,
      system: "AVOS Enterprise Autonomous AI Platform",
      version: "1.0.0",
      status: metrics.deniedExecutions > 0 ? "DEGRADED" : "READY",
      metrics,
      components: {
        agentRegistry: "READY",
        skillRegistry: "READY",
        toolRegistry: "READY",
        memoryRouter: "READY",
        taskPlanner: "READY",
        executionOrchestrator: "READY",
        safetyPolicyLayer: "READY",
        contextEngine: "READY",
        workflowBridge: "READY",
        observability: "READY",
        existingAiIntegration: "INTEGRATION_READY",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      health: this.health(),
      agents: this.agents.list(),
      skills: this.skills.list(),
      tools: this.tools.list(),
      memories: this.memories.list(),
      tasks: this.tasks.list(),
      executions: this.executions.list(),
      policies: this.policies.list(),
    };
  }
}
