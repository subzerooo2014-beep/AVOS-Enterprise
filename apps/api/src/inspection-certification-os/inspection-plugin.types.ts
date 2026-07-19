import {
  InspectionEvidence,
  InspectionResult,
  InspectionSeverity,
} from "./inspection-certification.types";

export interface InspectionMetric {
  readonly name: string;
  readonly value: number;
  readonly unit?: string;
}

export interface InspectionRecommendation {
  readonly title: string;
  readonly description: string;
  readonly priority: "low" | "medium" | "high" | "critical";
}

export interface InspectionExecutionContext {
  readonly repositoryRoot: string;
  readonly apiRoot: string;
  readonly webRoot: string;
  readonly environment: string;
  readonly correlationId: string;
  readonly startedAt: string;
  readonly metadata: Readonly<Record<string, string | number | boolean>>;
}

export interface InspectionPluginResult extends InspectionResult {
  readonly pluginId: string;
  readonly pluginVersion: string;
  readonly metrics: readonly InspectionMetric[];
  readonly recommendations: readonly InspectionRecommendation[];
  readonly files: readonly string[];
}

export interface InspectionPlugin {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly category: string;
  readonly severity: InspectionSeverity;
  readonly priority: number;
  readonly timeoutMs: number;
  readonly enabled: boolean;
  readonly dependencies: readonly string[];

  inspect(
    context: InspectionExecutionContext,
  ): Promise<InspectionPluginResult>;
}

export interface InspectionRuntimeReport {
  readonly executionId: string;
  readonly startedAt: string;
  readonly completedAt: string;
  readonly durationMs: number;
  readonly pluginCount: number;
  readonly passed: number;
  readonly warnings: number;
  readonly failed: number;
  readonly skipped: number;
  readonly evidence: readonly InspectionEvidence[];
  readonly results: readonly InspectionPluginResult[];
}
