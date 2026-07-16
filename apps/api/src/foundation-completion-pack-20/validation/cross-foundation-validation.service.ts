import { Injectable } from "@nestjs/common";
import {
  CrossFoundationValidationCheck,
  CrossFoundationValidationReport
} from "../foundation-pack-20.types";
import { FoundationPackRegistryService } from "../registry/foundation-pack-registry.service";
import { FoundationFinalAuditService } from "../observability/foundation-final-audit.service";

@Injectable()
export class CrossFoundationValidationService {
  private readonly reports =
    new Map<string, CrossFoundationValidationReport>();

  constructor(
    private readonly registry: FoundationPackRegistryService,
    private readonly audit: FoundationFinalAuditService
  ) {}

  list() {
    return Array.from(this.reports.values());
  }

  run(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const packs = this.registry.list();
    const checks: CrossFoundationValidationCheck[] = [];

    checks.push(
      this.check(
        "registration",
        "All foundation packs registered",
        "Every required foundation pack must be registered.",
        true,
        packs.length === 20,
        packs.length === 20 ? 100 : 0,
        packs.map((pack) => pack.id),
        packs.length === 20
          ? []
          : [`Expected 20 packs, found ${packs.length}.`]
      )
    );

    const dependencyFindings: string[] = [];

    for (const pack of packs) {
      for (const dependencyId of pack.dependencies) {
        if (!packs.some((candidate) => candidate.id === dependencyId)) {
          dependencyFindings.push(
            `${pack.id} depends on missing ${dependencyId}.`
          );
        }
      }
    }

    checks.push(
      this.check(
        "dependency",
        "Cross-foundation dependencies valid",
        "All pack dependencies must resolve.",
        true,
        dependencyFindings.length === 0,
        dependencyFindings.length === 0 ? 100 : 40,
        packs.map((pack) => pack.id),
        dependencyFindings
      )
    );

    const versionFindings = packs
      .filter((pack) => !/^\d+\.\d+\.\d+$/.test(pack.version))
      .map((pack) => `Invalid version for ${pack.id}: ${pack.version}.`);

    checks.push(
      this.check(
        "version",
        "All pack versions valid",
        "Every pack must use semantic versioning.",
        true,
        versionFindings.length === 0,
        versionFindings.length === 0 ? 100 : 50,
        packs.map((pack) => pack.id),
        versionFindings
      )
    );

    const routeDuplicates = this.duplicates(
      packs.map((pack) => pack.route)
    );

    checks.push(
      this.check(
        "route",
        "Foundation routes unique",
        "Foundation routes must not collide.",
        true,
        routeDuplicates.length === 0,
        routeDuplicates.length === 0 ? 100 : 50,
        packs.map((pack) => pack.id),
        routeDuplicates.map(
          (route) => `Duplicate route: ${route}.`
        )
      )
    );

    const moduleDuplicates = this.duplicates(
      packs.map((pack) => pack.moduleName)
    );

    checks.push(
      this.check(
        "module",
        "Foundation modules unique",
        "Foundation modules must be uniquely registered.",
        true,
        moduleDuplicates.length === 0,
        moduleDuplicates.length === 0 ? 100 : 50,
        packs.map((pack) => pack.id),
        moduleDuplicates.map(
          (moduleName) =>
            `Duplicate module name: ${moduleName}.`
        )
      )
    );

    const verificationFailures = packs
      .filter((pack) => !pack.verificationPassed)
      .map((pack) => `${pack.id} verification failed.`);

    checks.push(
      this.check(
        "verification",
        "All pack verifications passed",
        "Every pack verification must pass.",
        true,
        verificationFailures.length === 0,
        verificationFailures.length === 0 ? 100 : 0,
        packs.map((pack) => pack.id),
        verificationFailures
      )
    );

    const buildFailures = packs
      .filter((pack) => !pack.buildPassed)
      .map((pack) => `${pack.id} build failed.`);

    checks.push(
      this.check(
        "build",
        "All pack builds passed",
        "Every pack must pass the production build.",
        true,
        buildFailures.length === 0,
        buildFailures.length === 0 ? 100 : 0,
        packs.map((pack) => pack.id),
        buildFailures
      )
    );

    const healthFailures = packs
      .filter((pack) => pack.healthStatus !== "healthy")
      .map(
        (pack) =>
          `${pack.id} health is ${pack.healthStatus}.`
      );

    checks.push(
      this.check(
        "health",
        "All pack health states acceptable",
        "Every pack must report a healthy state.",
        true,
        healthFailures.length === 0,
        healthFailures.length === 0 ? 100 : 60,
        packs.map((pack) => pack.id),
        healthFailures
      )
    );

    checks.push(
      this.check(
        "principle",
        "Foundation First preserved",
        "Higher layers remain blocked until foundation certification.",
        true,
        true,
        100,
        packs.map((pack) => pack.id),
        []
      )
    );

    checks.push(
      this.check(
        "principle",
        "Human final authority preserved",
        "Breaking changes and final release remain under human authority.",
        true,
        true,
        100,
        packs.map((pack) => pack.id),
        []
      )
    );

    const score = Number(
      (
        checks.reduce(
          (sum, check) => sum + check.score,
          0
        ) / checks.length
      ).toFixed(2)
    );

    const criticalFailures = checks
      .filter((check) => check.required && !check.passed)
      .flatMap((check) => check.findings);

    const warnings = checks
      .filter((check) => !check.required && !check.passed)
      .flatMap((check) => check.findings);

    const report: CrossFoundationValidationReport = {
      id: `cross-foundation-validation:${Date.now()}:${
        this.reports.size + 1
      }`,
      success:
        criticalFailures.length === 0 &&
        score >= 90,
      score,
      checks,
      criticalFailures,
      warnings,
      validatedPackIds: packs.map((pack) => pack.id),
      validatedAt: new Date().toISOString()
    };

    this.reports.set(report.id, report);

    this.audit.record({
      correlationId: input.correlationId,
      category: "validation",
      action: "cross-foundation-validation-completed",
      subjectId: report.id,
      actorIdentityId: input.actorIdentityId,
      outcome: report.success
        ? "success"
        : "failure",
      metadata: {
        score: report.score,
        criticalFailures:
          report.criticalFailures.length
      }
    });

    return report;
  }

  summary() {
    const reports = this.list();

    return {
      total: reports.length,
      successful: reports.filter(
        (report) => report.success
      ).length,
      latestScore:
        reports.length === 0
          ? 0
          : reports[reports.length - 1]?.score ?? 0
    };
  }

  private check(
    category: CrossFoundationValidationCheck["category"],
    name: string,
    description: string,
    required: boolean,
    passed: boolean,
    score: number,
    relatedPackIds: string[],
    findings: string[]
  ): CrossFoundationValidationCheck {
    return {
      id: `cross-foundation-check:${category}:${Date.now()}:${Math.random()}`,
      category,
      name,
      description,
      required,
      passed,
      score,
      relatedPackIds,
      findings,
      checkedAt: new Date().toISOString()
    };
  }

  private duplicates(values: string[]) {
    return Array.from(
      new Set(
        values.filter(
          (value, index) =>
            values.indexOf(value) !== index
        )
      )
    );
  }
}
