import { Module } from "@nestjs/common";
import { EnterpriseAiOsController } from "./enterprise-ai-os.controller";
import { EnterpriseAiOsService } from "./enterprise-ai-os.service";

import { AgentPolicy } from "./policies/agent.policy";
import { TaskPolicy } from "./policies/task.policy";
import { MemoryPolicy } from "./policies/memory.policy";
import { KnowledgePolicy } from "./policies/knowledge.policy";
import { WorkflowPolicy } from "./policies/workflow.policy";
import { GovernancePolicy } from "./policies/governance.policy";
import { LearningPolicy } from "./policies/learning.policy";
import { PromptPolicy } from "./policies/prompt.policy";

import { PlannerAgent } from "./agents/planner.agent";
import { ResearchAgent } from "./agents/research.agent";
import { DecisionAgent } from "./agents/decision.agent";
import { RecommendationAgent } from "./agents/recommendation.agent";
import { WorkflowAgent } from "./agents/workflow.agent";
import { RiskAgent } from "./agents/risk.agent";
import { MarketAgent } from "./agents/market.agent";
import { CustomerAgent } from "./agents/customer.agent";

import { PlanningEngine } from "./engines/planning.engine";
import { ReasoningEngine } from "./engines/reasoning.engine";
import { EnterpriseDecisionEngine } from "./engines/decision.engine";
import { EnterpriseRecommendationEngine } from "./engines/recommendation.engine";
import { LearningEngine } from "./engines/learning.engine";
import { SimulationEngine } from "./engines/simulation.engine";
import { GovernanceEngine } from "./engines/governance.engine";
import { OrchestrationEngine } from "./engines/orchestration.engine";
import { KnowledgeRetrievalEngine } from "./engines/knowledge-retrieval.engine";
import { MemoryRelevanceEngine } from "./engines/memory-relevance.engine";

import { AgentRegistryService } from "./services/agent-registry.service";
import { TaskRuntimeService } from "./services/task-runtime.service";
import { MemoryStoreService } from "./services/memory-store.service";
import { KnowledgeGraphService } from "./services/knowledge-graph.service";
import { WorkflowRuntimeService } from "./services/workflow-runtime.service";
import { LearningStoreService } from "./services/learning-store.service";
import { PromptTemplateService } from "./services/prompt-template.service";
import { AiAuditService } from "./services/ai-audit.service";
import { AiAlertService } from "./services/ai-alert.service";
import { AiReportingService } from "./services/ai-reporting.service";
import { AiDashboardService } from "./services/ai-dashboard.service";
import { AiMetricsService } from "./services/ai-metrics.service";
import { AiGovernanceLogService } from "./services/ai-governance-log.service";
import { AiModelRegistryService } from "./services/ai-model-registry.service";
import { AiCapabilityRegistryService } from "./services/ai-capability-registry.service";
import { AiSchedulerService } from "./services/ai-scheduler.service";
import { AiNotificationService } from "./services/ai-notification.service";

@Module({
  controllers: [EnterpriseAiOsController],
  providers: [
    EnterpriseAiOsService,

    AgentPolicy,
    TaskPolicy,
    MemoryPolicy,
    KnowledgePolicy,
    WorkflowPolicy,
    GovernancePolicy,
    LearningPolicy,
    PromptPolicy,

    PlannerAgent,
    ResearchAgent,
    DecisionAgent,
    RecommendationAgent,
    WorkflowAgent,
    RiskAgent,
    MarketAgent,
    CustomerAgent,

    PlanningEngine,
    ReasoningEngine,
    EnterpriseDecisionEngine,
    EnterpriseRecommendationEngine,
    LearningEngine,
    SimulationEngine,
    GovernanceEngine,
    OrchestrationEngine,
    KnowledgeRetrievalEngine,
    MemoryRelevanceEngine,

    AgentRegistryService,
    TaskRuntimeService,
    MemoryStoreService,
    KnowledgeGraphService,
    WorkflowRuntimeService,
    LearningStoreService,
    PromptTemplateService,
    AiAuditService,
    AiAlertService,
    AiReportingService,
    AiDashboardService,
    AiMetricsService,
    AiGovernanceLogService,
    AiModelRegistryService,
    AiCapabilityRegistryService,
    AiSchedulerService,
    AiNotificationService,
  ],
  exports: [EnterpriseAiOsService],
})
export class EnterpriseAiOsModule {}
