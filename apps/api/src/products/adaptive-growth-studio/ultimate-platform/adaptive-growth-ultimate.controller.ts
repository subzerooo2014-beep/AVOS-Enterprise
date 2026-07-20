import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { AdaptiveGrowthCapabilityDispatcherService } from "./adaptive-growth-capability-dispatcher.service";
import { AdaptiveGrowthCapabilityRegistryService } from "./adaptive-growth-capability-registry.service";
import { AdaptiveGrowthEnterpriseEventBusService } from "./adaptive-growth-enterprise-event-bus.service";
import { AdaptiveGrowthEnterpriseOrchestratorService } from "./adaptive-growth-enterprise-orchestrator.service";
import { AdaptiveGrowthLearningEngineService } from "./adaptive-growth-learning-engine.service";
import { AdaptiveGrowthMultiAgentCoordinatorService } from "./adaptive-growth-multi-agent-coordinator.service";
import { AdaptiveGrowthStrategyOptimizerService } from "./adaptive-growth-strategy-optimizer.service";
import { AdaptiveGrowthUltimateArchitectureReviewService } from "./adaptive-growth-ultimate-architecture-review.service";
import { AdaptiveGrowthUltimateCertificationService } from "./adaptive-growth-ultimate-certification.service";
import { AdaptiveGrowthUltimatePlatformService } from "./adaptive-growth-ultimate-platform.service";
import { AdaptiveGrowthUltimateReadinessService } from "./adaptive-growth-ultimate-readiness.service";
import { AdaptiveGrowthUltimateSmokeService } from "./adaptive-growth-ultimate-smoke.service";
import { AdaptiveGrowthUltimateVerificationService } from "./adaptive-growth-ultimate-verification.service";
import { AdaptiveGrowthWorkflowEngineService } from "./adaptive-growth-workflow-engine.service";

@Controller("avos/products/adaptive-growth-studio/ultimate")
export class AdaptiveGrowthUltimateController {
  constructor(
    private readonly platform: AdaptiveGrowthUltimatePlatformService,
    private readonly registry: AdaptiveGrowthCapabilityRegistryService,
    private readonly dispatcher: AdaptiveGrowthCapabilityDispatcherService,
    private readonly orchestrator: AdaptiveGrowthEnterpriseOrchestratorService,
    private readonly workflows: AdaptiveGrowthWorkflowEngineService,
    private readonly events: AdaptiveGrowthEnterpriseEventBusService,
    private readonly learning: AdaptiveGrowthLearningEngineService,
    private readonly optimizer: AdaptiveGrowthStrategyOptimizerService,
    private readonly agents: AdaptiveGrowthMultiAgentCoordinatorService,
    private readonly review: AdaptiveGrowthUltimateArchitectureReviewService,
    private readonly verification: AdaptiveGrowthUltimateVerificationService,
    private readonly smoke: AdaptiveGrowthUltimateSmokeService,
    private readonly readiness: AdaptiveGrowthUltimateReadinessService,
    private readonly certification: AdaptiveGrowthUltimateCertificationService,
  ) {}

  @Get("status")
  status() {
    return this.platform.status();
  }

  @Get("dashboard")
  dashboard() {
    return this.platform.executiveDashboard();
  }

  @Get("capabilities")
  capabilities() {
    return this.registry.list();
  }

  @Post("dispatch")
  dispatch(@Body() input: Parameters<AdaptiveGrowthCapabilityDispatcherService["dispatch"]>[0]) {
    return this.dispatcher.dispatch(input);
  }

  @Post("orchestrate")
  orchestrate(@Body() input: Parameters<AdaptiveGrowthEnterpriseOrchestratorService["coordinate"]>[0]) {
    return this.orchestrator.coordinate(input);
  }

  @Post("workflows")
  createWorkflow(@Body() input: Parameters<AdaptiveGrowthWorkflowEngineService["create"]>[0]) {
    return this.workflows.create(input);
  }

  @Post("workflows/:id/run")
  runWorkflow(@Param("id") id: string) {
    return this.workflows.run(id);
  }

  @Post("workflows/:id/recover")
  recoverWorkflow(@Param("id") id: string) {
    return this.workflows.recover(id);
  }

  @Post("workflows/:id/compensate")
  compensateWorkflow(@Param("id") id: string) {
    return this.workflows.compensate(id);
  }

  @Get("workflows")
  listWorkflows() {
    return this.workflows.list();
  }

  @Get("events")
  eventsList(@Query("limit") limit?: string) {
    return this.events.list(limit ? Number(limit) : 100);
  }

  @Post("learning/:workflowId")
  learn(@Param("workflowId") workflowId: string) {
    return this.learning.learn(workflowId);
  }

  @Get("learning")
  outcomes() {
    return this.learning.list();
  }

  @Post("strategies/:key/optimize")
  optimize(
    @Param("key") key: string,
    @Body() parameters: Record<string, unknown>,
  ) {
    return this.optimizer.optimize(key, parameters);
  }

  @Get("strategies")
  strategies() {
    return this.optimizer.list();
  }

  @Post("agents/execute")
  executeAgents(@Body() input: Parameters<AdaptiveGrowthMultiAgentCoordinatorService["execute"]>[0]) {
    return this.agents.execute(input);
  }

  @Get("agents/tasks")
  agentTasks() {
    return this.agents.listTasks();
  }

  @Post("review/run")
  reviewRun() {
    return this.review.run();
  }

  @Get("review/status")
  reviewStatus() {
    return this.review.status();
  }

  @Post("verification/run")
  verify() {
    return this.verification.run();
  }

  @Get("verification/status")
  verificationStatus() {
    return this.verification.status();
  }

  @Post("smoke/run")
  smokeRun() {
    return this.smoke.run();
  }

  @Get("smoke/status")
  smokeStatus() {
    return this.smoke.status();
  }

  @Post("readiness/run")
  readinessRun() {
    return this.readiness.run();
  }

  @Get("readiness/status")
  readinessStatus() {
    return this.readiness.status();
  }

  @Post("certification/certify")
  certify(@Body() input: { approvedBy?: string }) {
    return this.certification.certify(input?.approvedBy);
  }

  @Get("certification/status")
  certificationStatus() {
    return this.certification.status();
  }
}