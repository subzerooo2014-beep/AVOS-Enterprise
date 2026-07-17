
import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { KnowledgeApprovalService } from "./knowledge-approval.service";
import { KnowledgeAuditService } from "./knowledge-audit.service";
import { KnowledgeGovernanceEngineService } from "./knowledge-governance-engine.service";
import { KnowledgeGovernanceHealthService } from "./knowledge-governance-health.service";
import { KnowledgeGovernanceMetricsService } from "./knowledge-governance-metrics.service";
import { KnowledgeLifecycleService } from "./knowledge-lifecycle.service";
import { KnowledgePolicyEngineService } from "./knowledge-policy-engine.service";
import { KnowledgeRetentionService } from "./knowledge-retention.service";
import { KnowledgeGovernanceContext, KnowledgeGovernanceSubject, KnowledgeLifecycleState, KnowledgePolicyRule, KnowledgeRetentionPolicy } from "./knowledge-governance.types";

@Controller("knowledge-fabric/governance")
export class KnowledgeGovernanceController {
  constructor(
    private readonly engine: KnowledgeGovernanceEngineService,
    private readonly healthService: KnowledgeGovernanceHealthService,
    private readonly policies: KnowledgePolicyEngineService,
    private readonly approvals: KnowledgeApprovalService,
    private readonly audit: KnowledgeAuditService,
    private readonly retention: KnowledgeRetentionService,
    private readonly lifecycle: KnowledgeLifecycleService,
    private readonly metrics: KnowledgeGovernanceMetricsService,
  ) {}

  @Get("status") status() { return this.healthService.status(); }
  @Get("health") health() { return this.healthService.status(); }
  @Get("metrics") getMetrics() { return this.metrics.snapshot(); }
  @Get("policies") getPolicies() { return this.policies.list(); }
  @Post("policies") registerPolicy(@Body() body: KnowledgePolicyRule) { return this.policies.register(body); }
  @Post("evaluate") evaluate(@Body() body: { subject: KnowledgeGovernanceSubject; context: KnowledgeGovernanceContext }) { return this.engine.govern(body.subject, body.context); }
  @Get("approvals") getApprovals(@Query("status") status?: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED") { return this.approvals.list(status); }
  @Post("approvals/:id/decision") decide(@Param("id") id: string, @Body() body: { approverId: string; approved: boolean; reason?: string }) { return this.approvals.decide(id, body.approverId, body.approved, body.reason); }
  @Get("audit") getAudit(@Query("knowledgeId") knowledgeId?: string, @Query("limit") limit?: string) { return this.audit.list(knowledgeId, limit ? Number(limit) : 100); }
  @Get("retention/policies") getRetentionPolicies() { return this.retention.list(); }
  @Post("retention/policies") registerRetention(@Body() body: KnowledgeRetentionPolicy) { return this.retention.register(body); }
  @Post("retention/evaluate") evaluateRetention(@Body() body: KnowledgeGovernanceSubject) { return this.retention.evaluate(body); }
  @Get("lifecycle/:knowledgeId") getLifecycle(@Param("knowledgeId") knowledgeId: string) { return { knowledgeId, state: this.lifecycle.get(knowledgeId) }; }
  @Post("lifecycle/:knowledgeId/transition") transition(@Param("knowledgeId") knowledgeId: string, @Body() body: { target: KnowledgeLifecycleState; actorId: string }) { return { knowledgeId, state: this.lifecycle.transition(knowledgeId, body.target, body.actorId) }; }
}