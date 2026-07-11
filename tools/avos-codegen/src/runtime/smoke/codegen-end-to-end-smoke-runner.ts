import {
  mkdtemp,
  rm,
} from "node:fs/promises";
import {
  tmpdir,
} from "node:os";
import {
  join,
  resolve,
} from "node:path";
import {
  CodeGenConflictPolicy,
} from "../../output/codegen-output.contracts";
import {
  createCodeGenGenerationRuntime,
} from "../../generation/bootstrap/codegen-generation-bootstrap";
import {
  CodeGenSmokeCheck,
  CodeGenSmokeResult,
} from "./codegen-smoke.contracts";

export class CodeGenEndToEndSmokeRunner {
  async run(
    codegenRoot: string,
  ): Promise<
    CodeGenSmokeResult
  > {
    const startedAt =
      new Date().toISOString();

    const checks:
      CodeGenSmokeCheck[] = [];

    const runtime =
      createCodeGenGenerationRuntime();

    const targetRoot =
      await mkdtemp(
        join(
          tmpdir(),
          "avos-codegen-smoke-",
        ),
      );

    try {
      const bootstrap =
        await runtime.bootstrap.initialize({
          codegenRoot:
            resolve(codegenRoot),
          replace: true,
        });

      checks.push({
        key:
          "bootstrap",
        success:
          bootstrap.blueprints.length > 0 &&
          bootstrap.templates.length > 0,
        details:
          `Blueprints=${bootstrap.blueprints.length}; Templates=${bootstrap.templates.length}`,
      });

      const result =
        await runtime.orchestrator.execute({
          blueprintKey:
            "enterprise-module-v2",
          workspaceRoot:
            resolve(codegenRoot),
          targetRoot,
          variables: {
            moduleName:
              "Smoke Inventory",
          },
          dryRun: true,
          strict: true,
          conflictPolicy:
            CodeGenConflictPolicy.ERROR,
          metadata: {
            source:
              "end-to-end-smoke",
          },
        });

      checks.push({
        key:
          "blueprint-execution",
        success:
          result.success,
        details:
          `Artifacts=${result.runtime.artifacts.length}; Errors=${result.runtime.errors.length}`,
      });

      checks.push({
        key:
          "artifact-generation",
        success:
          result.runtime.artifacts.length >= 2,
        details:
          result.runtime.artifacts
            .map(
              (artifact) =>
                artifact.relativePath,
            )
            .join(", "),
      });

      const completedAt =
        new Date().toISOString();

      return {
        success:
          checks.every(
            (check) =>
              check.success,
          ),
        checks,
        generatedFiles:
          result.runtime.artifacts.length,
        blueprintKey:
          "enterprise-module-v2",
        targetRoot,
        startedAt,
        completedAt,
      };
    } finally {
      await rm(
        targetRoot,
        {
          recursive: true,
          force: true,
        },
      );
    }
  }
}
