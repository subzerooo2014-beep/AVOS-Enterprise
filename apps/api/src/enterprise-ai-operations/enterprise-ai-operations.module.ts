import { Module } from '@nestjs/common';
import { EnterpriseAiOperationsController } from './enterprise-ai-operations.controller';
import { AiOperationsEngineService } from './ai-operations-engine.service';
import { AutonomousWorkflowEngineService } from './autonomous-workflow-engine.service';
import { EnterpriseAutomationEngineService } from './enterprise-automation-engine.service';
import { IntelligentTaskOrchestratorService } from './intelligent-task-orchestrator.service';
import { AiDecisionExecutionEngineService } from './ai-decision-execution-engine.service';
import { AiProcessOptimizationEngineService } from './ai-process-optimization-engine.service';
import { WorkflowDesignerEngineService } from './workflow-designer-engine.service';
import { EventDrivenAutomationEngineService } from './event-driven-automation-engine.service';
import { HumanApprovalEngineService } from './human-approval-engine.service';
import { EnterpriseAgentManagerService } from './enterprise-agent-manager.service';
import { MultiAgentCollaborationEngineService } from './multi-agent-collaboration-engine.service';
import { AgentTaskRoutingEngineService } from './agent-task-routing-engine.service';
import { OperationsIntelligenceEngineService } from './operations-intelligence-engine.service';
import { SlaOperationalRiskEngineService } from './sla-operational-risk-engine.service';
import { PredictiveOperationsEngineService } from './predictive-operations-engine.service';
import { DecisionExplainabilityEngineService } from './decision-explainability-engine.service';
import { OperationsCenterDashboardService } from './operations-center-dashboard.service';
import { AiOperationsOrchestratorService } from './ai-operations-orchestrator.service';

@Module({
  controllers: [EnterpriseAiOperationsController],
  providers: [
    AiOperationsEngineService,
    AutonomousWorkflowEngineService,
    EnterpriseAutomationEngineService,
    IntelligentTaskOrchestratorService,
    AiDecisionExecutionEngineService,
    AiProcessOptimizationEngineService,
    WorkflowDesignerEngineService,
    EventDrivenAutomationEngineService,
    HumanApprovalEngineService,
    EnterpriseAgentManagerService,
    MultiAgentCollaborationEngineService,
    AgentTaskRoutingEngineService,
    OperationsIntelligenceEngineService,
    SlaOperationalRiskEngineService,
    PredictiveOperationsEngineService,
    DecisionExplainabilityEngineService,
    OperationsCenterDashboardService,
    AiOperationsOrchestratorService,
  ],
  exports: [
    AiOperationsEngineService,
    AutonomousWorkflowEngineService,
    EnterpriseAutomationEngineService,
    IntelligentTaskOrchestratorService,
    AiDecisionExecutionEngineService,
    AiProcessOptimizationEngineService,
    WorkflowDesignerEngineService,
    EventDrivenAutomationEngineService,
    HumanApprovalEngineService,
    EnterpriseAgentManagerService,
    MultiAgentCollaborationEngineService,
    AgentTaskRoutingEngineService,
    OperationsIntelligenceEngineService,
    SlaOperationalRiskEngineService,
    PredictiveOperationsEngineService,
    DecisionExplainabilityEngineService,
    OperationsCenterDashboardService,
    AiOperationsOrchestratorService,
  ],
})
export class EnterpriseAiOperationsModule {}