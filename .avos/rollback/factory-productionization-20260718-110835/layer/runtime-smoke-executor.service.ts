import { Injectable } from "@nestjs/common";
import {
  existsSync,
  readFileSync,
  statSync
} from "node:fs";
import { resolve } from "node:path";
import {
  RuntimeSmokeCheck,
  RuntimeSmokeExecutionRequest,
  RuntimeSmokeExecutionResult
} from "./runtime-smoke-executor.contracts";
import { CapabilityProductionPathsService } from "./capability-production-paths.service";

@Injectable()
export class RuntimeSmokeExecutorService {
  constructor(
    private readonly paths: CapabilityProductionPathsService
  ) {}

  execute(
    request: RuntimeSmokeExecutionRequest
  ): RuntimeSmokeExecutionResult {
    const started = Date.now();
    const startedAt = new Date(started).toISOString();
    const workspacePath = resolve(request.workspacePath);
    const checks: RuntimeSmokeCheck[] = [];

    this.assertSafeWorkspace(workspacePath);

    checks.push(
      this.runCheck(
        "workspace-exists",
        () => {
          if (!existsSync(workspacePath)) {
            throw new Error("Workspace does not exist.");
          }

          if (!statSync(workspacePath).isDirectory()) {
            throw new Error("Workspace path is not a directory.");
          }

          return "Generated capability workspace is available.";
        }
      )
    );

    const expectedFiles = request.expectedFiles ?? [
      "generation.manifest.json"
    ];

    for (const relativePath of expectedFiles) {
      checks.push(
        this.runCheck(
          `file:${relativePath}`,
          () => {
            const target = resolve(workspacePath, relativePath);
            this.assertInsideWorkspace(workspacePath, target);

            if (!existsSync(target)) {
              throw new Error(
                `Expected generated file is missing: ${relativePath}`
              );
            }

            return `Expected generated file exists: ${relativePath}`;
          }
        )
      );
    }

    checks.push(
      this.runCheck(
        "manifest-readable",
        () => {
          const manifestPath = resolve(
            workspacePath,
            "generation.manifest.json"
          );

          if (!existsSync(manifestPath)) {
            return "Generation manifest is not required for this workspace.";
          }

          const parsed = JSON.parse(
            readFileSync(manifestPath, "utf8")
          ) as Record<string, unknown>;

          if (!parsed || typeof parsed !== "object") {
            throw new Error("Generation manifest is invalid.");
          }

          return "Generation manifest is readable.";
        }
      )
    );

    const requireHumanFinalAuthority =
      request.requireHumanFinalAuthority ?? true;

    const humanFinalAuthority = this.readHumanFinalAuthority(
      workspacePath
    );

    checks.push(
      this.runCheck(
        "human-final-authority",
        () => {
          if (
            requireHumanFinalAuthority &&
            !humanFinalAuthority
          ) {
            throw new Error(
              "Human Final Authority evidence is missing."
            );
          }

          return humanFinalAuthority
            ? "Human Final Authority evidence verified."
            : "Human Final Authority verification was not required.";
        }
      )
    );

    checks.push(
      this.runCheck(
        "source-structure",
        () => {
          const sourcePath = resolve(workspacePath, "src");

          if (!existsSync(sourcePath)) {
            throw new Error(
              "Generated source directory is missing."
            );
          }

          return "Generated source structure is available.";
        }
      )
    );

    const passed = checks.filter(
      (check) => check.status === "passed"
    ).length;
    const failed = checks.filter(
      (check) => check.status === "failed"
    ).length;
    const scorable = Math.max(1, passed + failed);
    const score = Math.round((passed / scorable) * 100);
    const completed = Date.now();

    return {
      success: failed === 0,
      score,
      workspacePath,
      checks,
      startedAt,
      completedAt: new Date(completed).toISOString(),
      durationMs: completed - started,
      humanFinalAuthority
    };
  }

  health() {
    return {
      status: "healthy",
      score: 100,
      runtimeSmokeExecutor: true,
      workspaceBoundaryProtection: true,
      manifestValidation: true,
      sourceStructureValidation: true,
      humanFinalAuthority: true
    };
  }

  private runCheck(
    name: string,
    operation: () => string
  ): RuntimeSmokeCheck {
    const started = Date.now();

    try {
      const message = operation();

      return {
        name,
        status: "passed",
        message,
        durationMs: Date.now() - started
      };
    } catch (error) {
      return {
        name,
        status: "failed",
        message:
          error instanceof Error
            ? error.message
            : "Unknown runtime smoke error.",
        durationMs: Date.now() - started
      };
    }
  }

  private readHumanFinalAuthority(
    workspacePath: string
  ): boolean {
    const candidates = [
      resolve(workspacePath, "generation.manifest.json"),
      resolve(workspacePath, "capability.workspace.json"),
      resolve(workspacePath, "capability.blueprint.json")
    ];

    for (const candidate of candidates) {
      if (!existsSync(candidate)) {
        continue;
      }

      try {
        const parsed = JSON.parse(
          readFileSync(candidate, "utf8")
        ) as Record<string, unknown>;

        if (parsed.humanFinalAuthority === true) {
          return true;
        }

        const blueprint = parsed.blueprint;

        if (
          blueprint &&
          typeof blueprint === "object" &&
          "approvedBy" in blueprint &&
          typeof blueprint.approvedBy === "string" &&
          blueprint.approvedBy.startsWith("human:")
        ) {
          return true;
        }

        if (
          typeof parsed.approvedBy === "string" &&
          parsed.approvedBy.startsWith("human:")
        ) {
          return true;
        }
      } catch {
        continue;
      }
    }

    return false;
  }

  private assertSafeWorkspace(
    workspacePath: string
  ): void {
    const generatedRoot = resolve(
      this.paths.getGeneratedRoot()
    );

    if (
      workspacePath === generatedRoot ||
      workspacePath.startsWith(`${generatedRoot}\\`) ||
      workspacePath.startsWith(`${generatedRoot}/`)
    ) {
      return;
    }

    throw new Error(
      "Runtime smoke workspace is outside the approved generated root."
    );
  }

  private assertInsideWorkspace(
    workspacePath: string,
    targetPath: string
  ): void {
    if (
      targetPath === workspacePath ||
      targetPath.startsWith(`${workspacePath}\\`) ||
      targetPath.startsWith(`${workspacePath}/`)
    ) {
      return;
    }

    throw new Error(
      "Runtime smoke target escapes the generated workspace."
    );
  }
}
