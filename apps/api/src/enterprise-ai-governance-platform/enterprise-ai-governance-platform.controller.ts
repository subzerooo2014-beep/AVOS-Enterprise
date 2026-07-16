import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AiAuditCenterService } from "./ai-audit-center.service";
import { AiComplianceService } from "./ai-compliance.service";
import { AiModelGovernanceRegistryService } from "./ai-model-governance-registry.service";
import { AiModelEvaluationService } from "./ai-model-evaluation.service";
import { AiPolicyRegistryService } from "./ai-policy-registry.service";
import { AiRiskCenterService } from "./ai-risk-center.service";
import { EnterpriseAiGovernancePlatformService } from "./enterprise-ai-governance-platform.service";
import { PromptGovernanceService } from "./prompt-governance.service";
import type {
  AiEvaluationRecord,
  AiGovernancePolicyRecord,
  AiGovernedModelRecord,
  AiGovernedPromptRecord,
  AiRiskAssessmentRecord,
} from "./enterprise-ai-governance.types";

@Controller("enterprise-ai-governance-platform")
export class EnterpriseAiGovernancePlatformController {
  constructor(
    private readonly platform: EnterpriseAiGovernancePlatformService,
    private readonly policies: AiPolicyRegistryService,
    private readonly models: AiModelGovernanceRegistryService,
    private readonly prompts: PromptGovernanceService,
    private readonly evaluations: AiModelEvaluationService,
    private readonly risks: AiRiskCenterService,
    private readonly audits: AiAuditCenterService,
    private readonly compliance: AiComplianceService,
  ) {}

  @Get("status")
  status() {
    return this.platform.health();
  }

  @Get("diagnostics")
  diagnostics() {
    return this.platform.diagnostics();
  }

  @Post("policies")
  registerPolicy(
    @Body()
    body: Omit<AiGovernancePolicyRecord, "createdAt" | "updatedAt">,
  ) {
    const policy = this.policies.register(body);

    this.audits.record(
      "system",
      "REGISTER_POLICY",
      "AI_POLICY",
      policy.id,
      "SUCCESS",
    );

    return { success: true, policy };
  }

  @Post("models")
  registerModel(
    @Body()
    body: Omit<AiGovernedModelRecord, "createdAt" | "updatedAt">,
  ) {
    const model = this.models.register(body);

    this.audits.record(
      "system",
      "REGISTER_MODEL",
      "AI_MODEL",
      model.id,
      "SUCCESS",
    );

    return { success: true, model };
  }

  @Post("models/:id/approve")
  approveModel(@Param("id") id: string) {
    const model = this.models.approve(id);

    this.audits.record(
      "system",
      "APPROVE_MODEL",
      "AI_MODEL",
      id,
      "SUCCESS",
    );

    return { success: true, model };
  }

  @Post("prompts")
  registerPrompt(
    @Body()
    body: Omit<AiGovernedPromptRecord, "createdAt" | "updatedAt">,
  ) {
    const prompt = this.prompts.register(body);

    this.audits.record(
      "system",
      "REGISTER_PROMPT",
      "AI_PROMPT",
      prompt.id,
      "SUCCESS",
    );

    return { success: true, prompt };
  }

  @Post("prompts/:id/approve")
  approvePrompt(@Param("id") id: string) {
    const prompt = this.prompts.approve(id);

    this.audits.record(
      "system",
      "APPROVE_PROMPT",
      "AI_PROMPT",
      id,
      "SUCCESS",
    );

    return { success: true, prompt };
  }

  @Post("evaluations")
  evaluateModel(
    @Body()
    body: Omit<AiEvaluationRecord, "id" | "passed" | "evaluatedAt">,
  ) {
    const evaluation = this.evaluations.evaluate(body);

    this.audits.record(
      "system",
      "EVALUATE_MODEL",
      "AI_MODEL",
      evaluation.modelId,
      evaluation.passed ? "PASSED" : "FAILED",
      { evaluationId: evaluation.id },
    );

    return { success: true, evaluation };
  }

  @Post("risks")
  assessRisk(
    @Body()
    body: Omit<AiRiskAssessmentRecord, "id" | "level" | "assessedAt">,
  ) {
    const assessment = this.risks.assess(
      body.targetType,
      body.targetId,
      body.score,
      body.findings,
      body.mitigations,
    );

    this.audits.record(
      "system",
      "ASSESS_RISK",
      body.targetType,
      body.targetId,
      assessment.level,
      { riskAssessmentId: assessment.id },
    );

    return { success: true, assessment };
  }

  @Post("policy-evaluate")
  evaluatePolicy(@Body() body: { context: Record<string, unknown> }) {
    return {
      success: true,
      decision: this.policies.evaluate(body.context),
    };
  }

  @Get("compliance")
  complianceReport() {
    return {
      success: true,
      report: this.compliance.validate(),
    };
  }
}
