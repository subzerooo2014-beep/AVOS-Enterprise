import { randomUUID } from "node:crypto";
import {
  ValidationEvidence,
  ValidationFinding,
  ValidationGateDefinition,
  ValidationGateResult,
  ValidationPipelineStatus,
  ValidationSeverity,
} from "./contracts";
import { ValidationCommandRunner } from "./command-runner";
import {
  PromotionDecision,
  PromotionDecisionEngine,
} from "./promotion-engine";

export interface ValidationPipelineInput {
  workspaceDirectory: string;
  gates: ValidationGateDefinition[];
  stopOnRequiredFailure?: boolean;
}

export interface ValidationPipelineResult {
  success: boolean;
  status: ValidationPipelineStatus;
  gateResults: ValidationGateResult[];
  promotion: PromotionDecision;
  findings: ValidationFinding[];
  evidence: ValidationEvidence[];
  enterpriseBrainPayload: Record<string, unknown>;
  evolutionCenterPayload: Record<string, unknown>;
  completedAt: string;
}

export class GenesisValidationOrchestrator {
  constructor(
    readonly runner = new ValidationCommandRunner(),
    readonly promotionEngine = new PromotionDecisionEngine(),
  ) {}

  async execute(
    input: ValidationPipelineInput,
  ): Promise<ValidationPipelineResult> {
    const gateResults: ValidationGateResult[] = [];
    const findings: ValidationFinding[] = [];

    for (const gate of input.gates) {
      const result = await this.runner.run(
        input.workspaceDirectory,
        gate,
      );

      gateResults.push(result);

      if (result.status === "failed") {
        findings.push({
          code: "GENESIS_VALIDATION_GATE_FAILED",
          severity: gate.required
            ? ValidationSeverity.ERROR
            : ValidationSeverity.WARNING,
          message: `Validation gate ${gate.key} failed.`,
          subject: gate.key,
          metadata: {
            exitCode: result.exitCode,
            durationMs: result.durationMs,
          },
        });

        if (gate.required && input.stopOnRequiredFailure) {
          break;
        }
      }
    }

    const promotion = this.promotionEngine.decide(gateResults);

    const status = !promotion.approved
      ? ValidationPipelineStatus.BLOCKED
      : promotion.qualityScore < 90
        ? ValidationPipelineStatus.DEGRADED
        : ValidationPipelineStatus.READY;

    const evidence: ValidationEvidence[] = [
      {
        id: randomUUID(),
        category: "genesis-engine-v2-validation",
        action: "validation-pipeline.completed",
        message: `Validation pipeline completed with strategy ${promotion.strategy}.`,
        metadata: {
          workspaceDirectory: input.workspaceDirectory,
          gates: gateResults.length,
          passed: gateResults.filter((gate) => gate.status === "passed").length,
          failed: gateResults.filter((gate) => gate.status === "failed").length,
          qualityScore: promotion.qualityScore,
          promotionApproved: promotion.approved,
          strategy: promotion.strategy,
        },
        createdAt: new Date().toISOString(),
      },
    ];

    return {
      success: promotion.approved,
      status,
      gateResults,
      promotion,
      findings,
      evidence,
      enterpriseBrainPayload: {
        type: "generated-system-validation",
        workspaceDirectory: input.workspaceDirectory,
        qualityScore: promotion.qualityScore,
        gates: gateResults.map((gate) => ({
          key: gate.key,
          status: gate.status,
          required: gate.required,
          durationMs: gate.durationMs,
        })),
      },
      evolutionCenterPayload: {
        type: "generated-system-promotion",
        workspaceDirectory: input.workspaceDirectory,
        approved: promotion.approved,
        strategy: promotion.strategy,
        controls: promotion.controls,
        failedRequiredGates: promotion.failedRequiredGates,
      },
      completedAt: new Date().toISOString(),
    };
  }
}
