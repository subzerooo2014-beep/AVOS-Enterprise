import { Injectable } from "@nestjs/common";
import {
  FoundationSmokeTestResult
} from "../foundation-pack-20.types";
import { FoundationPackRegistryService } from "../registry/foundation-pack-registry.service";
import { CrossFoundationValidationService } from "../validation/cross-foundation-validation.service";
import { FoundationManifestService } from "../manifest/foundation-manifest.service";
import { FoundationCertificationService } from "../certification/foundation-certification.service";
import { FoundationFinalAuditService } from "../observability/foundation-final-audit.service";

@Injectable()
export class FoundationFinalSmokeTestService {
  private readonly results =
    new Map<string, FoundationSmokeTestResult>();

  constructor(
    private readonly registry: FoundationPackRegistryService,
    private readonly validation: CrossFoundationValidationService,
    private readonly manifests: FoundationManifestService,
    private readonly certifications: FoundationCertificationService,
    private readonly audit: FoundationFinalAuditService
  ) {}

  list() {
    return Array.from(this.results.values());
  }

  run(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const packs = this.registry.list();
    const validationReports = this.validation.list();
    const validation =
      validationReports.length === 0
        ? undefined
        : validationReports[validationReports.length - 1];

    const manifestItems = this.manifests.list();
    const manifest =
      manifestItems.length === 0
        ? undefined
        : manifestItems[manifestItems.length - 1];

    const certificationItems = this.certifications.list();
    const certification =
      certificationItems.length === 0
        ? undefined
        : certificationItems[certificationItems.length - 1];

    const tests: FoundationSmokeTestResult["tests"] = [
      {
        id: "smoke:pack-registry",
        name: "All 20 foundation packs registered",
        passed: packs.length === 20,
        details: [
          `Registered packs: ${packs.length}.`
        ]
      },
      {
        id: "smoke:pack-verification",
        name: "All pack verifications passed",
        passed: packs.every(
          (pack) => pack.verificationPassed
        ),
        details: packs
          .filter((pack) => !pack.verificationPassed)
          .map((pack) => pack.id)
      },
      {
        id: "smoke:pack-builds",
        name: "All pack builds passed",
        passed: packs.every(
          (pack) => pack.buildPassed
        ),
        details: packs
          .filter((pack) => !pack.buildPassed)
          .map((pack) => pack.id)
      },
      {
        id: "smoke:cross-validation",
        name: "Cross-foundation validation passed",
        passed:
          validation?.success ?? false,
        details: validation
          ? validation.criticalFailures
          : ["Validation report is missing."]
      },
      {
        id: "smoke:manifest",
        name: "Foundation manifest generated",
        passed:
          Boolean(manifest) &&
          Boolean(manifest?.readiness.ready),
        details: manifest
          ? [
              `Manifest: ${manifest.id}.`,
              `Release: ${manifest.releaseVersion}.`
            ]
          : ["Manifest is missing."]
      },
      {
        id: "smoke:certification",
        name: "Foundation certification issued",
        passed:
          certification?.status === "certified" ||
          certification?.status ===
            "conditionally-certified",
        details: certification
          ? [
              `Certification: ${certification.id}.`,
              `Status: ${certification.status}.`
            ]
          : ["Certification is missing."]
      },
      {
        id: "smoke:human-authority",
        name: "Human final authority preserved",
        passed:
          Boolean(
            certification?.approvedByIdentityId
          ),
        details: certification?.approvedByIdentityId
          ? [
              `Approved by: ${certification.approvedByIdentityId}.`
            ]
          : ["Human approval is missing."]
      }
    ];

    const passed = tests.filter(
      (test) => test.passed
    ).length;

    const failed = tests.length - passed;

    const score = Number(
      (
        passed /
        tests.length *
        100
      ).toFixed(2)
    );

    const result: FoundationSmokeTestResult = {
      id: `foundation-final-smoke:${Date.now()}:${
        this.results.size + 1
      }`,
      stage:
        failed === 0 ? "completed" : "failed",
      tests,
      passed,
      failed,
      score,
      runtimeReady:
        failed === 0 &&
        score === 100,
      testedAt: new Date().toISOString()
    };

    this.results.set(result.id, result);

    this.audit.record({
      correlationId: input.correlationId,
      category: "smoke",
      action: "foundation-final-smoke-test-completed",
      subjectId: result.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        result.runtimeReady
          ? "success"
          : "failure",
      metadata: {
        score,
        passed,
        failed,
        runtimeReady: result.runtimeReady
      }
    });

    return result;
  }

  summary() {
    const results = this.list();

    return {
      total: results.length,
      successful: results.filter(
        (result) => result.runtimeReady
      ).length,
      latestScore:
        results.length === 0
          ? 0
          : results[results.length - 1]?.score ?? 0
    };
  }
}
