import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { EnterpriseAiOsService } from "./enterprise-ai-os.service";
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
import { AiDashboardService } from "./services/ai-dashboard.service";
import { AiReportingService } from "./services/ai-reporting.service";
import { AiAlertService } from "./services/ai-alert.service";
import { AiAuditService } from "./services/ai-audit.service";
import { AiCapabilityRegistryService } from "./services/ai-capability-registry.service";

@Controller("enterprise-ai-os")
export class EnterpriseAiOsController {
  constructor(
    private readonly ai: EnterpriseAiOsService,
    private readonly planning: PlanningEngine,
    private readonly reasoning: ReasoningEngine,
    private readonly decisions: EnterpriseDecisionEngine,
    private readonly recommendations: EnterpriseRecommendationEngine,
    private readonly learningEngine: LearningEngine,
    private readonly simulation: SimulationEngine,
    private readonly governance: GovernanceEngine,
    private readonly orchestration: OrchestrationEngine,
    private readonly knowledgeRetrieval: KnowledgeRetrievalEngine,
    private readonly memoryRelevance: MemoryRelevanceEngine,
    private readonly dashboard: AiDashboardService,
    private readonly reports: AiReportingService,
    private readonly alerts: AiAlertService,
    private readonly audit: AiAuditService,
    private readonly capabilities: AiCapabilityRegistryService,
  ) {}

  @Get("health")
  health() {
    return {
      success: true,
      system: "AVOS Enterprise AI OS",
      status: "healthy",
    };
  }

  @Post("agents")
  registerAgent(@Body() body: any) {
    return {
      success: true,
      agent: this.ai.agents.register(body),
    };
  }

  @Get("agents")
  agents() {
    return {
      success: true,
      agents: this.ai.agents.list(),
    };
  }

  @Post("tasks")
  createTask(@Body() body: any) {
    return {
      success: true,
      task: this.ai.tasks.create(body.type, body.input),
    };
  }

  @Post("tasks/:id/assign")
  assignTask(@Param("id") id: string, @Body() body: any) {
    return {
      success: true,
      task: this.ai.tasks.assign(id, body.agentId),
    };
  }

  @Post("tasks/:id/complete")
  completeTask(@Param("id") id: string, @Body() body: any) {
    return {
      success: true,
      task: this.ai.tasks.complete(id, body.result),
    };
  }

  @Post("tasks/:id/fail")
  failTask(@Param("id") id: string, @Body() body: any) {
    return {
      success: true,
      task: this.ai.tasks.fail(id, body.error),
    };
  }

  @Get("tasks")
  tasks() {
    return {
      success: true,
      tasks: this.ai.tasks.list(),
    };
  }

  @Post("plans")
  createPlan(@Body() body: any) {
    return {
      success: true,
      plan: this.planning.create(
        body.objective,
        body.context,
        body.constraints ?? [],
      ),
    };
  }

  @Post("reasoning")
  reason(@Body() body: any) {
    return this.reasoning.reason(body);
  }

  @Post("decisions")
  decision(@Body() body: any) {
    return this.decisions.decide(body.options ?? []);
  }

  @Post("recommendations")
  recommendation(@Body() body: any) {
    return this.recommendations.rank(body.candidates ?? []);
  }

  @Post("memory")
  storeMemory(@Body() body: any) {
    return {
      success: true,
      memory: this.ai.memory.store(body),
    };
  }

  @Post("memory/recall")
  recallMemory(@Body() body: any) {
    return {
      success: true,
      memories: this.ai.memory.recall(
        body.namespace,
        body.key,
        body.minImportance ?? 0,
      ),
    };
  }

  @Post("knowledge/nodes")
  createKnowledgeNode(@Body() body: any) {
    return {
      success: true,
      node: this.ai.knowledge.createNode(body),
    };
  }

  @Post("knowledge/edges")
  createKnowledgeEdge(@Body() body: any) {
    return {
      success: true,
      edge: this.ai.knowledge.createEdge(body),
    };
  }

  @Post("knowledge/query")
  queryKnowledge(@Body() body: any) {
    return this.knowledgeRetrieval.rank(
      body.text,
      this.ai.knowledge.listNodes(),
    );
  }

  @Post("workflows")
  createWorkflow(@Body() body: any) {
    return {
      success: true,
      workflow: this.ai.workflows.create(body),
    };
  }

  @Post("workflows/:id/execute")
  executeWorkflow(@Param("id") id: string, @Body() body: any) {
    return {
      success: true,
      execution: this.ai.workflows.execute(id, body.input ?? {}),
    };
  }

  @Post("learning")
  recordLearning(@Body() body: any) {
    const record = this.ai.learning.record(body);
    const adjustment = this.learningEngine.learn({
      score: body.score,
      accepted: body.accepted ?? true,
    });
    return {
      success: true,
      record,
      adjustment,
    };
  }

  @Post("simulation")
  simulate(@Body() body: any) {
    return this.simulation.simulate(body);
  }

  @Post("governance")
  evaluateGovernance(@Body() body: any) {
    return this.governance.evaluate(body);
  }

  @Post("orchestration")
  orchestrate(@Body() body: any) {
    return this.orchestration.orchestrate(body.tasks ?? []);
  }

  @Post("memory/rank")
  rankMemory(@Body() body: any) {
    return this.memoryRelevance.rank(body.items ?? []);
  }

  @Post("prompts")
  createPrompt(@Body() body: any) {
    return {
      success: true,
      template: this.ai.prompts.create(body),
    };
  }

  @Post("prompts/execute")
  executePrompt(@Body() body: any) {
    return {
      success: true,
      result: this.ai.prompts.execute(
        body.templateCode,
        body.values ?? {},
      ),
    };
  }

  @Post("alerts")
  createAlert(@Body() body: any) {
    return {
      success: true,
      alert: this.alerts.create(body),
    };
  }

  @Post("reports")
  createReport(@Body() body: any) {
    return {
      success: true,
      report: this.reports.create(body),
    };
  }

  @Get("capabilities")
  capabilitiesList() {
    return {
      success: true,
      capabilities: this.capabilities.capabilities(),
    };
  }

  @Get("operations/dashboard")
  operations() {
    return {
      success: true,
      dashboard: this.dashboard.summary(),
    };
  }

  @Get("operations/audit")
  auditEntries() {
    return {
      success: true,
      entries: this.audit.list(),
    };
  }
}
