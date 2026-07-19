import { Injectable } from "@nestjs/common";
import {
  FactoryBuildReport,
} from "../contracts/materialization.contracts";
import { BuildPackageDto } from "../dto/build-package.dto";
import { FactoryEventBusService } from "../events/event-bus.service";
import { createFactoryId } from "../utils/factory-id.util";
import { FactoryCommandRunnerService } from "./command-runner.service";
import { FactoryMaterializerService } from "./materializer.service";
import { FactoryOutputPackagerService } from "./output-packager.service";
import { FactoryRollbackService } from "./rollback.service";
import { FactoryProductionVerificationService } from "./verification.service";

@Injectable()
export class FactoryBuildEngineService {
  private readonly reports = new Map<string, FactoryBuildReport>();

  constructor(
    private readonly materializer: FactoryMaterializerService,
    private readonly runner: FactoryCommandRunnerService,
    private readonly verifier: FactoryProductionVerificationService,
    private readonly packager: FactoryOutputPackagerService,
    private readonly rollback: FactoryRollbackService,
    private readonly events: FactoryEventBusService,
  ) {}

  async build(dto: BuildPackageDto): Promise<FactoryBuildReport> {
    const startedAt = new Date().toISOString();
    const report: FactoryBuildReport = {
      id: createFactoryId("factory-build-report"),
      projectId: "pending",
      packageId: dto.packageId,
      status: "queued",
      workspacePath: dto.targetDirectory ?? "",
      commands: [],
      verification: {
        passed: false,
        checks: {},
        notes: [],
      },
      errors: [],
      startedAt,
      metadata: dto.metadata ?? {},
    };

    this.reports.set(report.id, report);

    try {
      report.status = "materializing";

      const existingWorkspacePath = dto.targetDirectory;
      const rollbackPath = existingWorkspacePath
        ? this.rollback.createBackup(existingWorkspacePath)
        : undefined;

      report.rollbackPath = rollbackPath;

      const materialization = this.materializer.materialize(
        dto.packageId,
        dto.targetDirectory,
        dto.overwrite ?? false,
      );

      report.projectId = materialization.projectId;
      report.workspacePath = materialization.workspacePath;
      report.materializationId = materialization.id;

      await this.events.publish(
        "factory.materialization.completed",
        "factory-build-engine",
        {
          reportId: report.id,
          projectId: report.projectId,
          packageId: dto.packageId,
          workspacePath: report.workspacePath,
          files: materialization.files.length,
        },
        { subject: report.id },
      );

      report.status = "building";

      const commands =
        dto.commands ??
        [
          ...(dto.installDependencies ? ["pnpm install"] : []),
          "pnpm exec tsc --noEmit",
          "pnpm build",
        ];

      for (const command of commands) {
        const result = this.runner.run(command, report.workspacePath);
        report.commands.push(result);

        if (result.exitCode !== 0) {
          throw new Error(
            `Build command '${command}' failed with exit code ${result.exitCode}.`,
          );
        }
      }

      report.status = "verifying";
      report.verification = this.verifier.verify(
        report.workspacePath,
        report.commands,
      );

      if (!report.verification.passed) {
        throw new Error("Production verification failed.");
      }

      report.status = "packaging";
      report.outputPackagePath = this.packager.packageWorkspace(
        report.workspacePath,
        report.projectId,
      );

      report.status = "completed";
      report.completedAt = new Date().toISOString();
      report.durationMs =
        new Date(report.completedAt).getTime() -
        new Date(report.startedAt).getTime();

      await this.events.publish(
        "factory.build.completed",
        "factory-build-engine",
        {
          reportId: report.id,
          projectId: report.projectId,
          packageId: report.packageId,
          workspacePath: report.workspacePath,
          outputPackagePath: report.outputPackagePath,
        },
        { subject: report.id },
      );

      return report;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      report.errors.push(message);

      this.rollback.restore(report.workspacePath, report.rollbackPath);
      report.status = "rolled-back";
      report.completedAt = new Date().toISOString();
      report.durationMs =
        new Date(report.completedAt).getTime() -
        new Date(report.startedAt).getTime();

      await this.events.publish(
        "factory.build.failed",
        "factory-build-engine",
        {
          reportId: report.id,
          packageId: report.packageId,
          workspacePath: report.workspacePath,
          errors: report.errors,
          rollbackPath: report.rollbackPath,
        },
        { subject: report.id },
      );

      throw error;
    }
  }

  get(id: string) {
    return this.reports.get(id);
  }

  list() {
    return [...this.reports.values()].sort((a, b) =>
      b.startedAt.localeCompare(a.startedAt),
    );
  }

  status() {
    const reports = this.list();

    return {
      total: reports.length,
      completed: reports.filter((report) => report.status === "completed").length,
      rolledBack: reports.filter((report) => report.status === "rolled-back").length,
      active: reports.filter((report) =>
        !["completed", "failed", "rolled-back"].includes(report.status),
      ).length,
      generatedAt: new Date().toISOString(),
    };
  }
}
