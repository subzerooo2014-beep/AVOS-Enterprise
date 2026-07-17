import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { CapabilityBlueprintRegistryService } from "./capability-blueprint-registry.service";
import { CapabilitySpecificationCompilerService } from "./capability-specification-compiler.service";
import { CapabilityDependencyPlannerService } from "./capability-dependency-planner.service";
import { CapabilityContractGeneratorService } from "./capability-contract-generator.service";
import { CapabilityCodeGeneratorService } from "./capability-code-generator.service";
import { CapabilityTestGeneratorService } from "./capability-test-generator.service";
import { CapabilityGovernanceValidatorService } from "./capability-governance-validator.service";
import { CapabilityProductionCertificationService } from "./capability-production-certification.service";
import { CapabilityReleasePackagerService } from "./capability-release-packager.service";
import {
  CapabilityBlueprint,
  CapabilityProductionRun
} from "./capability-production.contracts";

@Injectable()
export class CapabilityProductionOrchestratorService {
  private readonly runs = new Map<string, CapabilityProductionRun>();

  constructor(
    private readonly blueprints: CapabilityBlueprintRegistryService,
    private readonly specifications: CapabilitySpecificationCompilerService,
    private readonly dependencies: CapabilityDependencyPlannerService,
    private readonly contracts: CapabilityContractGeneratorService,
    private readonly code: CapabilityCodeGeneratorService,
    private readonly tests: CapabilityTestGeneratorService,
    private readonly governance: CapabilityGovernanceValidatorService,
    private readonly certification: CapabilityProductionCertificationService,
    private readonly packaging: CapabilityReleasePackagerService
  ) {}

  run(
    input: Omit<CapabilityBlueprint, "id" | "createdAt">,
    approvedBy: string
  ): CapabilityProductionRun {
    const blueprint = this.blueprints.register(input);
    const run: CapabilityProductionRun = {
      id: randomUUID(),
      blueprintId: blueprint.id,
      status: "planned",
      artifactIds: [],
      startedAt: new Date().toISOString()
    };

    this.runs.set(run.id, run);

    try {
      const specification = this.specifications.compile(blueprint);
      const dependencyPlan = this.dependencies.plan(blueprint);
      const artifacts = [
        this.contracts.generate(blueprint, specification),
        this.code.generate(blueprint, specification),
        this.tests.generate(blueprint)
      ];

      run.status = "generated";
      run.specificationId = specification.id;
      run.dependencyPlanId = dependencyPlan.id;
      run.artifactIds = artifacts.map((artifact) => artifact.id);

      const governanceReport = this.governance.validate(
        blueprint,
        dependencyPlan,
        artifacts
      );

      run.status = governanceReport.passed ? "validated" : "failed";
      run.governanceReportId = governanceReport.id;

      if (!governanceReport.passed) {
        run.completedAt = new Date().toISOString();
        return run;
      }

      const certificate = this.certification.certify(
        governanceReport,
        approvedBy
      );

      run.certificateId = certificate.id;
      run.status =
        certificate.status === "certified"
          ? "certified"
          : "failed";

      if (certificate.status !== "certified") {
        run.completedAt = new Date().toISOString();
        return run;
      }

      const releasePackage = this.packaging.package(
        blueprint,
        certificate,
        artifacts
      );

      run.releasePackageId = releasePackage.id;
      run.status = "packaged";
      run.completedAt = new Date().toISOString();
      return run;
    }
    catch {
      run.status = "failed";
      run.completedAt = new Date().toISOString();
      return run;
    }
  }

  list(limit = 100): CapabilityProductionRun[] {
    return [...this.runs.values()].slice(-Math.max(1, limit)).reverse();
  }
}
