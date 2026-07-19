import { Injectable } from "@nestjs/common";
import { InspectionRuntimeReport } from "./inspection-plugin.types";
import { InspectionPolicyDecision } from "./inspection-policy.service";

export interface InspectionEnterpriseReport {
  readonly reportId: string;
  readonly version: string;
  readonly generatedAt: string;
  readonly summary: {
    readonly plugins: number;
    readonly passed: number;
    readonly warnings: number;
    readonly failed: number;
    readonly skipped: number;
    readonly score: number;
  };
  readonly policy: InspectionPolicyDecision;
  readonly categories: Readonly<
    Record<
      string,
      {
        readonly passed: number;
        readonly warnings: number;
        readonly failed: number;
        readonly skipped: number;
      }
    >
  >;
  readonly risks: readonly string[];
  readonly recommendations: readonly string[];
  readonly runtime: InspectionRuntimeReport;
}

@Injectable()
export class InspectionReportService {
  create(
    runtime: InspectionRuntimeReport,
    policy: InspectionPolicyDecision,
  ): InspectionEnterpriseReport {
    const score =
      runtime.pluginCount === 0
        ? 0
        : Number(((runtime.passed / runtime.pluginCount) * 100).toFixed(2));

    const categories: Record<
      string,
      {
        passed: number;
        warnings: number;
        failed: number;
        skipped: number;
      }
    > = {};

    for (const result of runtime.results) {
      categories[result.category] ??= {
        passed: 0,
        warnings: 0,
        failed: 0,
        skipped: 0,
      };

      if (result.status === "pass") {
        categories[result.category].passed += 1;
      } else if (result.status === "warn") {
        categories[result.category].warnings += 1;
      } else if (result.status === "fail") {
        categories[result.category].failed += 1;
      } else {
        categories[result.category].skipped += 1;
      }
    }

    const risks = runtime.results
      .filter((result) => result.status === "fail" || result.status === "warn")
      .map((result) => `${result.name}: ${result.message}`);

    const recommendations = runtime.results.flatMap((result) =>
      result.recommendations.map(
        (recommendation) =>
          `[${recommendation.priority}] ${recommendation.title}: ${recommendation.description}`,
      ),
    );

    return {
      reportId: `IC-REPORT-${runtime.executionId}`,
      version: "1.6.0",
      generatedAt: new Date().toISOString(),
      summary: {
        plugins: runtime.pluginCount,
        passed: runtime.passed,
        warnings: runtime.warnings,
        failed: runtime.failed,
        skipped: runtime.skipped,
        score,
      },
      policy,
      categories,
      risks,
      recommendations,
      runtime,
    };
  }
}
