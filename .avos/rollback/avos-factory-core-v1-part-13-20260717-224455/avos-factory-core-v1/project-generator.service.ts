import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { ProjectGenerationPlan, ProjectGeneratorRequest } from "./project-generator.contracts";
import { ProjectGeneratorPolicyError } from "./project-generator.errors";
import { ProjectGenerationPlannerService } from "./project-generation-planner.service";
import { ProjectGeneratorHistoryService } from "./project-generator-history.service";
import { ProjectGeneratorMetricsService } from "./project-generator-metrics.service";
import { ProjectGeneratorPolicyService } from "./project-generator-policy.service";
import { ProjectGeneratorValidationService } from "./project-generator-validation.service";

@Injectable()
export class ProjectGeneratorService {
  constructor(
    private readonly validation: ProjectGeneratorValidationService,
    private readonly policy: ProjectGeneratorPolicyService,
    private readonly planner: ProjectGenerationPlannerService,
    private readonly history: ProjectGeneratorHistoryService,
    private readonly metrics: ProjectGeneratorMetricsService
  ) {}

  createPlan(request: ProjectGeneratorRequest): ProjectGenerationPlan {
    const normalized = { ...request, id: request.id ?? randomUUID() };
    const validation = this.validation.validate(normalized);
    this.metrics.recordValidation(validation);
    this.history.record({
      requestId: normalized.id,
      action: "validated",
      status: validation.valid ? "validated" : "failed",
      success: validation.valid,
      requestedBy: normalized.requestedBy,
      approvedBy: normalized.approvedBy,
      details: { errors: validation.errors, warnings: validation.warnings }
    });
    this.validation.assertValid(validation);

    const decision = this.policy.evaluate(normalized);
    if (!decision.allowed) {
      this.metrics.recordRejected();
      throw new ProjectGeneratorPolicyError(decision.reasons);
    }

    const plan = this.planner.createPlan(normalized, decision.requiresHumanApproval);
    this.metrics.recordPlan(plan);
    this.history.record({
      requestId: plan.requestId,
      planId: plan.id,
      projectId: plan.projectId,
      action: "planned",
      status: plan.status,
      success: true,
      requestedBy: plan.requestedBy,
      approvedBy: plan.approvedBy,
      details: { kind: plan.kind, outputPath: plan.outputPath, structureCount: plan.structure.length }
    });
    return plan;
  }
}
