import {
  existsSync,
} from "node:fs";
import {
  resolve,
} from "node:path";
import {
  CodeGenCliCommand,
  CodeGenCliCommandContext,
  CodeGenCliCommandResult,
} from "../codegen-cli.contracts";

export class CodeGenDoctorCommand
  implements CodeGenCliCommand {
  readonly key = "doctor";
  readonly name =
    "CodeGen Doctor";
  readonly description =
    "Checks AVOS CodeGen runtime health";
  readonly aliases = [
    "health",
    "diagnose",
  ];

  execute(
    context:
      CodeGenCliCommandContext,
  ): CodeGenCliCommandResult {
    const required = [
      "package.json",
      "templates",
      "blueprints",
      "dist",
    ];

    const checks =
      required.map(
        (path) => ({
          path,
          exists:
            existsSync(
              resolve(
                context.cwd,
                path,
              ),
            ),
        }),
      );

    const success =
      checks.every(
        (check) =>
          check.exists,
      );

    return {
      success,
      command:
        this.key,
      message:
        success
          ? "AVOS CodeGen runtime is healthy"
          : "AVOS CodeGen runtime has missing components",
      data: {
        node:
          process.version,
        platform:
          process.platform,
        cwd:
          context.cwd,
        checks,
      },
    };
  }
}
