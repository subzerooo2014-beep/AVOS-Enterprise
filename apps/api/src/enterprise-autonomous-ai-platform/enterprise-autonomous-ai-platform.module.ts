import { Module } from "@nestjs/common";
import { AiAgentRegistryService } from "./ai-agent-registry.service";
import { AiContextEngineService } from "./ai-context-engine.service";
import { AiExecutionOrchestratorService } from "./ai-execution-orchestrator.service";
import { AiMemoryRouterService } from "./ai-memory-router.service";
import { AiPolicyEngineService } from "./ai-policy-engine.service";
import { AiSkillRegistryService } from "./ai-skill-registry.service";
import { AiTaskPlannerService } from "./ai-task-planner.service";
import { AiToolRegistryService } from "./ai-tool-registry.service";
import { AiWorkflowBridgeService } from "./ai-workflow-bridge.service";
import { EnterpriseAutonomousAiPlatformController } from "./enterprise-autonomous-ai-platform.controller";
import { EnterpriseAutonomousAiPlatformService } from "./enterprise-autonomous-ai-platform.service";

@Module({
  controllers: [EnterpriseAutonomousAiPlatformController],
  providers: [
    AiAgentRegistryService,
    AiContextEngineService,
    AiExecutionOrchestratorService,
    AiMemoryRouterService,
    AiPolicyEngineService,
    AiSkillRegistryService,
    AiTaskPlannerService,
    AiToolRegistryService,
    AiWorkflowBridgeService,
    EnterpriseAutonomousAiPlatformService,
  ],
  exports: [
    AiAgentRegistryService,
    AiContextEngineService,
    AiExecutionOrchestratorService,
    AiMemoryRouterService,
    AiPolicyEngineService,
    AiSkillRegistryService,
    AiTaskPlannerService,
    AiToolRegistryService,
    AiWorkflowBridgeService,
    EnterpriseAutonomousAiPlatformService,
  ],
})
export class EnterpriseAutonomousAiPlatformModule {}
