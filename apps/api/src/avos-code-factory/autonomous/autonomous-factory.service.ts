import { Injectable } from "@nestjs/common";
import {
  AutonomousFactoryBlueprintInput,
  AutonomousFactoryRun,
} from "../contracts/autonomous-factory.contracts";
import { CertifyAutonomousRunDto } from "../dto/certify-autonomous-run.dto";
import { ExecuteAutonomousFactoryDto } from "../dto/execute-autonomous-factory.dto";
import { FactoryEventBusService } from "../events/event-bus.service";
import { createFactoryId } from "../utils/factory-id.util";
import { FactoryBlueprintCompilerService } from "./blueprint-compiler.service";
import { FactoryCapabilityComposerService } from "./capability-composer.service";
import { FactoryCodeQualityEngineService } from "./code-quality-engine.service";
import { FactoryDependencyResolverService } from "./dependency-resolver.service";
import { FactoryProductionCertificationService } from "./production-certification.service";

@Injectable()
export class AutonomousSoftwareFactoryService {
  private readonly runs = new Map<string, AutonomousFactoryRun>();

  constructor(
    private readonly compiler: FactoryBlueprintCompilerService,
    private readonly dependencies: FactoryDependencyResolverService,
    private readonly composer: FactoryCapabilityComposerService,
    private readonly quality: FactoryCodeQualityEngineService,
    private readonly certification: FactoryProductionCertificationService,
    private readonly events: FactoryEventBusService,
  ) {}

  async execute(
    dto: ExecuteAutonomousFactoryDto,
  ): Promise<AutonomousFactoryRun> {
    const startedAt = new Date().toISOString();

    const run: AutonomousFactoryRun = {
      id: createFactoryId("factory-autonomous-run"),
      projectId: dto.projectId,
      status: "compiling",
      packageIds: [],
      qualityReports: [],
      errors: [],
      metadata: dto.metadata ?? {},
      startedAt,
    };

    this.runs.set(run.id, run);

    await this.events.publish(
      "factory.autonomous.started",
      "autonomous-software-factory",
      {
        runId: run.id,
        projectId: run.projectId,
        name: dto.name,
        capabilities: dto.capabilities.length,
      },
      { subject: run.id },
    );

    try {
      const input: AutonomousFactoryBlueprintInput = {
        projectId: dto.projectId,
        name: dto.name,
        objective: dto.objective,
        version: dto.version,
        capabilities: dto.capabilities.map((capability) => ({
          name: capability.name,
          objective: capability.objective,
          version: capability.version,
          dependencies: capability.dependencies,
          exposeApi: capability.exposeApi,
          persistence: capability.persistence,
          humanApprovalRequired:
            capability.humanApprovalRequired,
          metadata: capability.metadata,
        })),
        applications: dto.applications?.map((application) => ({
          name: application.name,
          framework: application.framework as
            | "nestjs"
            | "nextjs"
            | "flutter"
            | "node"
            | "generic",
          objective: application.objective,
          capabilities: application.capabilities,
          metadata: application.metadata,
        })),
        qualityThreshold: dto.qualityThreshold,
        humanFinalAuthority: dto.humanFinalAuthority,
        metadata: dto.metadata,
      };

      run.blueprint = this.compiler.compile(input);

      run.status = "resolving";
      run.dependencyResolution = this.dependencies.resolve(
        run.blueprint,
      );

      if (!run.dependencyResolution.valid) {
        run.status = "rejected";
        run.errors.push(
          ...run.dependencyResolution.missingDependencies.map(
            (value) => `Missing dependency: ${value}`,
          ),
          ...run.dependencyResolution.cyclicDependencies.map(
            (cycle) => `Dependency cycle: ${cycle.join(" -> ")}`,
          ),
        );

        return this.complete(run);
      }

      run.status = "generating";
      const compositions = await this.composer.compose(run.blueprint);

      run.packageIds = compositions.map(
        (composition) => composition.generation.package.id,
      );

      run.status = "quality-checking";
      run.qualityReports = run.packageIds.map((packageId) =>
        this.quality.analyze(packageId),
      );

      const qualityPassed = run.qualityReports.every(
        (report) =>
          report.passed &&
          report.score >= run.blueprint!.qualityThreshold,
      );

      run.status = qualityPassed ? "certifying" : "rejected";

      if (!qualityPassed) {
        run.errors.push(
          `Quality threshold ${run.blueprint.qualityThreshold} was not satisfied.`,
        );
      }

      const completed = this.complete(run);

      await this.events.publish(
        qualityPassed
          ? "factory.autonomous.awaiting-approval"
          : "factory.autonomous.rejected",
        "autonomous-software-factory",
        {
          runId: completed.id,
          projectId: completed.projectId,
          packageIds: completed.packageIds,
          qualityScores: completed.qualityReports.map(
            (report) => report.score,
          ),
          humanFinalAuthority: true,
        },
        { subject: completed.id },
      );

      return completed;
    } catch (error) {
      run.status = "failed";
      run.errors.push(
        error instanceof Error ? error.message : String(error),
      );
      const completed = this.complete(run);

      await this.events.publish(
        "factory.autonomous.failed",
        "autonomous-software-factory",
        {
          runId: completed.id,
          projectId: completed.projectId,
          errors: completed.errors,
        },
        { subject: completed.id },
      );

      throw error;
    }
  }

  async certify(dto: CertifyAutonomousRunDto) {
    const run = this.runs.get(dto.runId);

    if (!run) {
      throw new Error(
        `Autonomous factory run '${dto.runId}' was not found.`,
      );
    }

    const certification = this.certification.certify(
      run,
      dto.approved,
      dto.approvedBy,
      dto.metadata,
    );

    run.certification = certification;
    run.status =
      certification.status === "certified"
        ? "completed"
        : "rejected";

    await this.events.publish(
      certification.status === "certified"
        ? "factory.autonomous.certified"
        : "factory.autonomous.certification-rejected",
      "autonomous-software-factory",
      {
        runId: run.id,
        certificationId: certification.id,
        status: certification.status,
        score: certification.score,
        approvedBy: certification.metadata.approvedBy,
      },
      { subject: certification.id },
    );

    return certification;
  }

  get(id: string) {
    return this.runs.get(id);
  }

  list() {
    return [...this.runs.values()].sort((a, b) =>
      b.startedAt.localeCompare(a.startedAt),
    );
  }

  status() {
    const runs = this.list();

    return {
      totalRuns: runs.length,
      completed: runs.filter(
        (run) => run.status === "completed",
      ).length,
      awaitingApproval: runs.filter(
        (run) => run.status === "certifying",
      ).length,
      rejected: runs.filter(
        (run) => run.status === "rejected",
      ).length,
      failed: runs.filter(
        (run) => run.status === "failed",
      ).length,
      generatedApplications: runs.reduce(
        (sum, run) => sum + run.packageIds.length,
        0,
      ),
      certifiedRuns: runs.filter(
        (run) => run.certification?.status === "certified",
      ).length,
      humanFinalAuthority: true,
      generatedAt: new Date().toISOString(),
    };
  }

  private complete(run: AutonomousFactoryRun) {
    run.completedAt = new Date().toISOString();
    run.durationMs =
      new Date(run.completedAt).getTime() -
      new Date(run.startedAt).getTime();
    return run;
  }
}

