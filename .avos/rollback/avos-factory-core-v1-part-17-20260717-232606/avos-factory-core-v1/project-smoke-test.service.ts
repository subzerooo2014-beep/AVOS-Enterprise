import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { mkdtemp, readFile, rm } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import {
  ProjectSmokeTestResult
} from "./project-execution.contracts";
import {
  ProjectGenerationPlan
} from "./project-generator.contracts";
import {
  ProjectExecutionService
} from "./project-execution.service";
import {
  ProjectManifestService
} from "./project-manifest.service";
import {
  ProjectRollbackEngineService
} from "./project-rollback-engine.service";

@Injectable()
export class ProjectSmokeTestService {
  constructor(
    private readonly execution:
      ProjectExecutionService,
    private readonly rollback:
      ProjectRollbackEngineService
  ) {}

  async run(): Promise<ProjectSmokeTestResult> {
    const root = await mkdtemp(
      join(tmpdir(), "avos-factory-part-5b-")
    );

    const checks: Record<string, boolean> = {
      executionSucceeded: false,
      projectCreated: false,
      manifestCreated: false,
      manifestAuthorityPreserved: false,
      verificationPassed: false,
      rollbackSucceeded: false,
      cleanupCompleted: false
    };

    const plan: ProjectGenerationPlan = {
      id: randomUUID(),
      requestId: randomUUID(),
      name: "AVOS Factory Smoke Project",
      projectId: "avos.smoke.factory-project",
      kind: "typescript-library",
      status: "approved",
      outputPath: "factory-smoke-project",
      requestedBy: "system:part-5b-smoke",
      approvedBy: "human:khalifa",
      humanApproved: true,
      requiresHumanApproval: true,
      createdAt: new Date().toISOString(),
      variables: {
        humanFinalAuthority: true
      },
      warnings: [],
      structure: [
        {
          id: "src-directory",
          kind: "directory",
          relativePath: "src"
        },
        {
          id: "index-source",
          kind: "source",
          relativePath: "src/index.ts",
          content: [
            'export const generatedBy = "AVOS Factory";',
            "export const humanFinalAuthority = true;",
            ""
          ].join("\n"),
          dependsOn: ["src-directory"]
        },
        {
          id: "readme",
          kind: "documentation",
          relativePath: "README.md",
          content: "# AVOS Factory Smoke Project\n"
        }
      ]
    };

    let generatedProjectPath =
      join(root, plan.outputPath);

    let rollbackRestored = false;

    try {
      const result = await this.execution.execute({
        plan,
        options: {
          projectRoot: root,
          humanApproved: true,
          approvedBy: "human:khalifa",
          verifyAfterCommit: true
        }
      });

      checks.executionSucceeded = result.success;
      checks.projectCreated = result.targetPath === generatedProjectPath;
      checks.verificationPassed =
        result.verification?.valid === true;

      const manifestContent = await readFile(
        join(
          generatedProjectPath,
          ProjectManifestService.relativeManifestPath
        ),
        "utf8"
      );

      const manifest = JSON.parse(
        manifestContent
      ) as {
        humanFinalAuthority?: boolean;
      };

      checks.manifestCreated = true;
      checks.manifestAuthorityPreserved =
        manifest.humanFinalAuthority === true;

      if (!result.success) {
        throw new Error(
          result.error ??
          "Smoke project execution failed."
        );
      }

      const rollbackResult = await this.rollback.rollback({
        transactionId: result.transactionId,
        requestedBy: "system:part-5b-smoke",
        humanApproved: true,
        approvedBy: "human:khalifa",
        reason: "AVOS Factory Part 5B controlled smoke-test rollback."
      });

      rollbackRestored =
        rollbackResult.success;

      checks.rollbackSucceeded =
        rollbackResult.success;

      return {
        success:
          Object.values(checks)
            .filter((_, index) =>
              index <
              Object.keys(checks).length - 1
            )
            .every(Boolean),
        checks,
        generatedProjectPath,
        rollbackRestored,
        cleanupCompleted: false,
        executedAt: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        checks,
        generatedProjectPath,
        rollbackRestored,
        cleanupCompleted: false,
        executedAt: new Date().toISOString(),
        error:
          error instanceof Error
            ? error.message
            : String(error)
      };
    } finally {
      await rm(root, {
        recursive: true,
        force: true
      });

      checks.cleanupCompleted = true;
    }
  }
}
