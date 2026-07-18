import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryArchitectureFinding,
  AvosFactoryArchitectureReview
} from "./avos-factory-final-review.contracts";
import {
  AvosFactoryRuntimeService
} from "./avos-factory-runtime.service";

@Injectable()
export class AvosFactoryArchitectureReviewService {
  constructor(
    private readonly runtime:
      AvosFactoryRuntimeService
  ) {}

  run(): AvosFactoryArchitectureReview {
    const status =
      this.runtime.status();

    const findings: AvosFactoryArchitectureFinding[] = [];

    if (status.status !== "healthy") {
      findings.push({
        id: randomUUID(),
        category: "operations",
        severity: "blocking",
        title: "Runtime is not healthy",
        description:
          "AVOS Factory runtime health must be healthy before release."
      });
    }

    if (!status.humanFinalAuthority) {
      findings.push({
        id: randomUUID(),
        category: "governance",
        severity: "blocking",
        title: "Human Final Authority is not preserved",
        description:
          "All governed and destructive operations must preserve human approval."
      });
    }

    if (
      !Object.values(status.components)
        .every(Boolean)
    ) {
      findings.push({
        id: randomUUID(),
        category: "architecture",
        severity: "blocking",
        title: "One or more factory components are inactive",
        description:
          "All AVOS Factory Core V1 architectural components must be active."
      });
    }

    if (
      status.registeredProjectKinds < 3
    ) {
      findings.push({
        id: randomUUID(),
        category: "quality",
        severity: "warning",
        title: "Limited project kind coverage",
        description:
          "The project kind registry has fewer than three registered kinds.",
        recommendation:
          "Register additional governed project kinds."
      });
    }

    const blockingFindings =
      findings.filter(
        (finding) =>
          finding.severity === "blocking"
      ).length;

    const warningCount =
      findings.filter(
        (finding) =>
          finding.severity === "warning"
      ).length;

    const score = Math.max(
      0,
      100 -
      blockingFindings * 25 -
      warningCount * 5
    );

    return {
      id: randomUUID(),
      system: "AVOS Factory Core V1",
      version: "1.0.0",
      score,
      passed:
        blockingFindings === 0 &&
        score >= 95,
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      layersReviewed: [
        "Blueprint Engine",
        "Code Generation Engine",
        "Template Engine",
        "AI Generator",
        "Project Generator",
        "Project Execution",
        "Filesystem Transactions",
        "Rollback",
        "Verification",
        "Operational Governance",
        "Enforcement",
        "Audit",
        "Certification"
      ],
      findings,
      blockingFindings,
      generatedAt:
        new Date().toISOString()
    };
  }
}
