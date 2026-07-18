import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  FailureDiagnosisRequest,
  FailureDiagnosisResult
} from "./failure-diagnosis.contracts";
import { FailureClassificationService } from "./failure-classification.service";
import { FailureDependencyAnalyzerService } from "./failure-dependency-analyzer.service";
import { FailureRecoveryPlannerService } from "./failure-recovery-planner.service";
import { FailureRootCauseAnalyzerService } from "./failure-root-cause-analyzer.service";
import { FailureStackTraceAnalyzerService } from "./failure-stack-trace-analyzer.service";
import { FailureSuggestedFixGeneratorService } from "./failure-suggested-fix-generator.service";

@Injectable()
export class FailureDiagnosisEngineService {
  constructor(
    private readonly classifier: FailureClassificationService,
    private readonly dependencyAnalyzer: FailureDependencyAnalyzerService,
    private readonly recoveryPlanner: FailureRecoveryPlannerService,
    private readonly rootCauseAnalyzer: FailureRootCauseAnalyzerService,
    private readonly stackAnalyzer: FailureStackTraceAnalyzerService,
    private readonly fixGenerator: FailureSuggestedFixGeneratorService
  ) {}

  diagnose(
    request: FailureDiagnosisRequest
  ): FailureDiagnosisResult {
    if (!request.message?.trim()) {
      throw new Error(
        "Failure diagnosis requires an error message."
      );
    }

    if (!request.approvedBy?.startsWith("human:")) {
      throw new Error(
        "Human Final Authority approval is required."
      );
    }

    const classification =
      this.classifier.classify(request);

    const dependencyHints =
      this.dependencyAnalyzer.analyze(
        request.message,
        request.stack
      );

    const stackFrames =
      this.stackAnalyzer.analyze(request.stack);

    const rootCause =
      this.rootCauseAnalyzer.analyze(
        request,
        classification.category,
        dependencyHints,
        stackFrames
      );

    const suggestedFixes =
      this.fixGenerator.generate(
        classification.category,
        classification.severity,
        request,
        dependencyHints
      );

    const recoveryPlan =
      this.recoveryPlanner.plan(
        classification.category,
        classification.severity
      );

    return {
      id: `failure-diagnosis:${randomUUID()}`,
      category: classification.category,
      severity: classification.severity,
      rootCause,
      dependencyHints,
      stackFrames,
      suggestedFixes,
      recoveryPlan,
      humanFinalAuthority: true,
      diagnosedAt: new Date().toISOString()
    };
  }

  smoke() {
    const result = this.diagnose({
      message:
        "TS2306: File './vehicle-pricing.types' is not a module. Build failed.",
      stack:
        "at compile (src/vehicles/intelligence/vehicle-pricing-ai.service.ts:2:38)",
      command:
        "pnpm exec tsc --noEmit -p tsconfig.json",
      exitCode: 1,
      workspacePath:
        "apps/api/src/vehicles/intelligence",
      approvedBy: "human:khalifa"
    });

    const checks = {
      categoryDetected:
        result.category === "typescript",
      severityDetected:
        result.severity === "high",
      rootCauseGenerated:
        result.rootCause.confidence > 0,
      stackAnalyzed:
        result.stackFrames.length > 0,
      suggestedFixesGenerated:
        result.suggestedFixes.length > 0,
      recoveryPlanGenerated:
        result.recoveryPlan.length >= 6,
      humanFinalAuthority:
        result.humanFinalAuthority === true
    };

    const success =
      Object.values(checks).every(Boolean);

    return {
      success,
      score: success ? 100 : 0,
      checks,
      result
    };
  }

  health() {
    return {
      status: "healthy",
      score: 100,
      failureClassification: true,
      dependencyAnalysis: true,
      stackTraceAnalysis: true,
      rootCauseAnalysis: true,
      suggestedFixGeneration: true,
      recoveryPlanning: true,
      humanFinalAuthority: true
    };
  }
}
