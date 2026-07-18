import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AiGenerationExecutionResult,
  AiGenerationPlan,
  AiGenerationRequest
} from "./ai-generator.contracts";
import {
  AiGeneratorApprovalRequiredError,
  AiGeneratorPolicyError
} from "./ai-generator.errors";
import {
  AiGenerationPlannerService
} from "./ai-generation-planner.service";
import {
  AiGeneratorHistoryService
} from "./ai-generator-history.service";
import {
  AiGeneratorMetricsService
} from "./ai-generator-metrics.service";
import {
  AiGeneratorPolicyService
} from "./ai-generator-policy.service";
import {
  AiGeneratorValidationService
} from "./ai-generator-validation.service";
import {
  AiPromptAnalyzerService
} from "./ai-prompt-analyzer.service";
import {
  BlueprintEngineService
} from "./blueprint-engine.service";
import {
  CodeGenerationEngineService
} from "./code-generation-engine.service";

@Injectable()
export class AiGeneratorService {
  constructor(
    private readonly validation:
      AiGeneratorValidationService,
    private readonly analyzer:
      AiPromptAnalyzerService,
    private readonly policy:
      AiGeneratorPolicyService,
    private readonly planner:
      AiGenerationPlannerService,
    private readonly blueprintEngine:
      BlueprintEngineService,
    private readonly codeGeneration:
      CodeGenerationEngineService,
    private readonly history:
      AiGeneratorHistoryService,
    private readonly metrics:
      AiGeneratorMetricsService
  ) {}

  createPlan(
    request: AiGenerationRequest
  ): AiGenerationPlan {
    const normalizedRequest = {
      ...request,
      id:
        request.id ?? randomUUID()
    };

    const validation =
      this.validation.validate(
        normalizedRequest
      );

    this.validation.assertValid(
      validation
    );

    const analysis =
      this.analyzer.analyze(
        normalizedRequest
      );

    this.metrics.recordAnalysis(
      analysis
    );

    this.history.record({
      requestId:
        normalizedRequest.id,
      action: "analyzed",
      status: "analyzed",
      success: true,
      requestedBy:
        normalizedRequest.requestedBy,
      approvedBy:
        normalizedRequest.approvedBy,
      details: {
        analysis
      }
    });

    const decision =
      this.policy.evaluate(
        normalizedRequest,
        analysis
      );

    if (!decision.allowed) {
      this.metrics.recordRejected();

      this.history.record({
        requestId:
          normalizedRequest.id,
        action: "rejected",
        status: "rejected",
        success: false,
        requestedBy:
          normalizedRequest.requestedBy,
        approvedBy:
          normalizedRequest.approvedBy,
        details: {
          decision
        }
      });

      throw new AiGeneratorPolicyError(
        decision.reasons
      );
    }

    const plan =
      this.planner.createPlan(
        normalizedRequest,
        {
          ...analysis,
          requiresHumanApproval:
            decision.requiresHumanApproval
        }
      );

    this.metrics.recordPlan(plan);

    this.history.record({
      requestId:
        normalizedRequest.id,
      planId:
        plan.id,
      action: "planned",
      status:
        plan.status,
      success: true,
      requestedBy:
        normalizedRequest.requestedBy,
      approvedBy:
        normalizedRequest.approvedBy,
      details: {
        requiresHumanApproval:
          plan.requiresHumanApproval,
        approved:
          plan.approved,
        stepCount:
          plan.steps.length
      }
    });

    return plan;
  }

  async execute(
    request: AiGenerationRequest
  ): Promise<AiGenerationExecutionResult> {
    const startedAt =
      new Date().toISOString();

    const start = Date.now();

    let plan: AiGenerationPlan | undefined;

    try {
      plan =
        this.createPlan(request);

      if (
        plan.requiresHumanApproval &&
        !plan.approved
      ) {
        throw new AiGeneratorApprovalRequiredError();
      }

      this.blueprintEngine.register(
        plan.blueprint
      );

      const executions = [];

      for (
        const step
        of plan.steps
      ) {
        const execution =
          await this.codeGeneration.execute({
            blueprintId:
              plan.blueprint.id,
            blueprintVersion:
              plan.blueprint.version,
            stepId:
              step.id,
            providerId:
              step.providerId,
            target:
              step.target,
            outputPath:
              step.outputPath,
            input:
              structuredClone(
                step.input
              ),
            variables:
              structuredClone(
                request.variables ?? {}
              ),
            dryRun:
              request.dryRun === true,
            overwrite:
              request.overwrite === true,
            requestedBy:
              request.requestedBy,
            approvedBy:
              request.approvedBy,
            humanApproved:
              request.humanApproved,
            correlationId:
              request.correlationId
          });

        executions.push(execution);

        if (!execution.success) {
          throw new Error(
            execution.error ??
            `Generation step "${step.id}" failed.`
          );
        }
      }

      const completedAt =
        new Date().toISOString();

      const result:
        AiGenerationExecutionResult = {
        success: true,
        requestId:
          plan.requestId,
        planId:
          plan.id,
        status: "completed",
        analysis:
          plan.analysis,
        blueprint:
          plan.blueprint,
        executions,
        warnings:
          plan.warnings,
        startedAt,
        completedAt,
        durationMs:
          Date.now() - start
      };

      this.metrics.recordExecution(
        result
      );

      this.history.record({
        requestId:
          plan.requestId,
        planId:
          plan.id,
        action: "executed",
        status: "completed",
        success: true,
        requestedBy:
          request.requestedBy,
        approvedBy:
          request.approvedBy,
        details: {
          executionCount:
            executions.length,
          artifactCount:
            executions.reduce(
              (sum, execution) =>
                sum +
                execution.artifacts.length,
              0
            )
        }
      });

      return result;
    } catch (error) {
      const completedAt =
        new Date().toISOString();

      const message =
        error instanceof Error
          ? error.message
          : "Unknown AI generation error.";

      const fallbackAnalysis =
        plan?.analysis ??
        this.analyzer.analyze(request);

      const fallbackBlueprint =
        plan?.blueprint ?? {
          id: "ai.failed-generation",
          name: "Failed AI Generation",
          version: "1.0.0",
          status: "failed" as const,
          metadata: {
            createdBy:
              request.requestedBy,
            createdAt: startedAt,
            humanFinalAuthority: true
          },
          steps: []
        };

      const result:
        AiGenerationExecutionResult = {
        success: false,
        requestId:
          plan?.requestId ??
          request.id ??
          "unknown",
        planId:
          plan?.id ??
          "unplanned",
        status:
          error instanceof
          AiGeneratorApprovalRequiredError
            ? "awaiting-approval"
            : "failed",
        analysis:
          fallbackAnalysis,
        blueprint:
          fallbackBlueprint,
        executions: [],
        warnings:
          plan?.warnings ?? [],
        startedAt,
        completedAt,
        durationMs:
          Date.now() - start,
        error: message
      };

      this.metrics.recordExecution(
        result
      );

      this.history.record({
        requestId:
          result.requestId,
        planId:
          result.planId,
        action: "failed",
        status:
          result.status,
        success: false,
        requestedBy:
          request.requestedBy,
        approvedBy:
          request.approvedBy,
        details: {
          error: message
        }
      });

      return result;
    }
  }
}
