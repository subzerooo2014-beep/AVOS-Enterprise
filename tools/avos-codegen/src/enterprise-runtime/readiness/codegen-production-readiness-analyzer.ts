import {
  CodeGenProductionReadinessCheck,
  CodeGenProductionReadinessReport,
} from "./codegen-production-readiness.contracts";

export class CodeGenProductionReadinessAnalyzer {
  analyze(
    checks:
      readonly CodeGenProductionReadinessCheck[],
  ): CodeGenProductionReadinessReport {
    const passed =
      checks.filter(
        (check) =>
          check.passed,
      ).length;

    const failed =
      checks.length -
      passed;

    const criticalFailures =
      checks.filter(
        (check) =>
          !check.passed &&
          check.critical,
      ).length;

    const score =
      checks.length === 0
        ? 100
        : Math.round(
            passed /
            checks.length *
            100,
          );

    return {
      ready:
        failed === 0 &&
        criticalFailures === 0,
      checks:
        structuredClone(
          [...checks],
        ),
      passed,
      failed,
      criticalFailures,
      score,
      generatedAt:
        new Date().toISOString(),
    };
  }
}
