import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AiAgentRegistryService } from "./ai-agent-registry.service";
import { AiExecutionOrchestratorService } from "./ai-execution-orchestrator.service";
import { AiMemoryRouterService } from "./ai-memory-router.service";
import { AiPolicyEngineService } from "./ai-policy-engine.service";
import { AiSkillRegistryService } from "./ai-skill-registry.service";
import { AiTaskPlannerService } from "./ai-task-planner.service";
import { AiToolRegistryService } from "./ai-tool-registry.service";
import { AiWorkflowBridgeService } from "./ai-workflow-bridge.service";
import { EnterpriseAutonomousAiPlatformService } from "./enterprise-autonomous-ai-platform.service";
import type {
  AiAgentRecord,
  AiPolicyRecord,
  AiSkillRecord,
  AiToolRecord,
} from "./enterprise-autonomous-ai.types";

@Controller("enterprise-autonomous-ai-platform")
export class EnterpriseAutonomousAiPlatformController {
  constructor(
    private readonly platform: EnterpriseAutonomousAiPlatformService,
    private readonly agents: AiAgentRegistryService,
    private readonly skills: AiSkillRegistryService,
    private readonly tools: AiToolRegistryService,
    private readonly memory: AiMemoryRouterService,
    private readonly planner: AiTaskPlannerService,
    private readonly executor: AiExecutionOrchestratorService,
    private readonly policies: AiPolicyEngineService,
    private readonly workflowBridge: AiWorkflowBridgeService,
  ) {}

  @Get("status")
  status() {
    return this.platform.health();
  }

  @Get("diagnostics")
  diagnostics() {
    return this.platform.diagnostics();
  }

  @Post("agents")
  registerAgent(@Body() body: AiAgentRecord) {
    return { success: true, agent: this.agents.register(body) };
  }

  @Post("skills")
  registerSkill(@Body() body: AiSkillRecord) {
    return { success: true, skill: this.skills.register(body) };
  }

  @Post("tools")
  registerTool(@Body() body: AiToolRecord) {
    return { success: true, tool: this.tools.register(body) };
  }

  @Post("policies")
  registerPolicy(@Body() body: AiPolicyRecord) {
    return { success: true, policy: this.policies.register(body) };
  }

  @Post("memory/:scope/:key")
  setMemory(
    @Param("scope") scope: string,
    @Param("key") key: string,
    @Body() body: { value: unknown },
  ) {
    return { success: true, memory: this.memory.set(scope, key, body.value) };
  }

  @Post("tasks")
  planTask(
    @Body()
    body: {
      objective: string;
      steps: string[];
      context?: Record<string, unknown>;
      agentId?: string;
    },
  ) {
    return {
      success: true,
      task: this.planner.plan(
        body.objective,
        body.steps,
        body.context ?? {},
        body.agentId,
      ),
    };
  }

  @Post("tasks/:taskId/execute")
  executeTask(
    @Param("taskId") taskId: string,
    @Body() body: { agentId: string; toolId?: string },
  ) {
    return this.executor.execute(taskId, body.agentId, body.toolId);
  }

  @Post("workflow-tasks")
  createWorkflowTask(
    @Body()
    body: {
      workflowExecutionId: string;
      objective: string;
      steps: string[];
      agentId?: string;
    },
  ) {
    return {
      success: true,
      task: this.workflowBridge.createWorkflowTask(
        body.workflowExecutionId,
        body.objective,
        body.steps,
        body.agentId,
      ),
    };
  }
}
