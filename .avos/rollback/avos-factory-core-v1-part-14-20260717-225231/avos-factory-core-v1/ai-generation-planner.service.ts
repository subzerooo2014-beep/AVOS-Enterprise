import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosBlueprint,
  BlueprintStep
} from "./blueprint.contracts";
import {
  AiGenerationPlan,
  AiGenerationPlanStep,
  AiGenerationRequest,
  AiPromptAnalysis
} from "./ai-generator.contracts";

@Injectable()
export class AiGenerationPlannerService {
  createPlan(
    request: AiGenerationRequest,
    analysis: AiPromptAnalysis
  ): AiGenerationPlan {
    const requestId =
      request.id ?? randomUUID();

    const steps =
      this.createSteps(
        request,
        analysis
      );

    const blueprintSteps:
      BlueprintStep[] =
      steps.map((step) => ({
        id: step.id,
        name: step.name,
        type: step.type,
        target: step.target,
        pluginId:
          step.providerId,
        outputPath:
          step.outputPath,
        input:
          structuredClone(
            step.input
          ),
        dependsOn: [
          ...step.dependsOn
        ],
        requiresApproval:
          step.requiresApproval,
        enabled: true
      }));

    const blueprint:
      AvosBlueprint = {
      id:
        `ai.${this.toIdentifier(
          analysis.requestedName
        )}`,
      name:
        `AI Generated ${analysis.requestedName}`,
      version: "1.0.0",
      status:
        analysis.requiresHumanApproval
          ? "draft"
          : "approved",
      metadata: {
        createdBy:
          request.requestedBy,
        createdAt:
          new Date().toISOString(),
        description:
          request.prompt,
        tags: [
          "ai-generated",
          analysis.intent,
          analysis.target
        ],
        humanFinalAuthority: true,
        correlationId:
          request.correlationId,
        source:
          "avos.ai-generator"
      },
      variables:
        Object.entries(
          request.variables ?? {}
        ).map(
          ([name, value]) => ({
            name,
            value,
            required: false
          })
        ),
      steps: blueprintSteps
    };

    const requiresHumanApproval =
      analysis.requiresHumanApproval ||
      steps.some(
        (step) =>
          step.requiresApproval
      );

    const approved =
      requiresHumanApproval
        ? (
            request.humanApproved === true &&
            Boolean(request.approvedBy)
          )
        : true;

    return {
      id: randomUUID(),
      requestId,
      status:
        approved
          ? "approved"
          : requiresHumanApproval
            ? "awaiting-approval"
            : "planned",
      createdAt:
        new Date().toISOString(),
      requestedBy:
        request.requestedBy,
      analysis,
      blueprint,
      steps,
      requiresHumanApproval,
      approved,
      approvedBy:
        approved
          ? request.approvedBy
          : undefined,
      warnings:
        requiresHumanApproval &&
        !approved
          ? [
              "Plan requires Human Final Authority approval."
            ]
          : []
    };
  }

  private createSteps(
    request: AiGenerationRequest,
    analysis: AiPromptAnalysis
  ): AiGenerationPlanStep[] {
    const artifacts =
      analysis.intent ===
      "create-feature"
        ? [
            {
              suffix: "service",
              target:
                "nestjs-service"
            },
            {
              suffix: "controller",
              target:
                "nestjs-controller"
            },
            {
              suffix: "module",
              target:
                "nestjs-module"
            }
          ]
        : [{
            suffix:
              analysis.target.replace(
                "nestjs-",
                ""
              ),
            target:
              analysis.target
          }];

    return artifacts.map(
      (artifact, index) => ({
        id:
          `ai-step-${index + 1}-${artifact.suffix}`,
        name:
          `Generate ${artifact.suffix}`,
        type: "generator",
        target:
          artifact.target,
        providerId:
          analysis.providerId,
        outputPath:
          request.outputPath,
        input: {
          name:
            analysis.requestedName,
          className:
            analysis.requestedName,
          prompt:
            request.prompt,
          projectContext:
            request.projectContext,
          artifact:
            artifact.suffix
        },
        dependsOn:
          index === 0
            ? []
            : [
                `ai-step-${index}-${artifacts[index - 1]?.suffix}`
              ],
        requiresApproval:
          analysis.requiresHumanApproval
      })
    );
  }

  private toIdentifier(
    value: string
  ): string {
    return value
      .trim()
      .replace(
        /([a-z0-9])([A-Z])/g,
        "$1-$2"
      )
      .replace(
        /[^A-Za-z0-9]+/g,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        ""
      )
      .toLowerCase() ||
      "generated-capability";
  }
}
