import {
  resolve,
} from "node:path";
import {
  CodeGenConflictPolicy,
} from "../../output/codegen-output.contracts";
import {
  CodeGenUnifiedGenerationMode,
} from "../../generation/requests/codegen-unified-generation.contracts";
import {
  CodeGenUnifiedGenerationService,
} from "../../generation/codegen-unified-generation.service";
import {
  CodeGenValidationError,
} from "../../core/codegen.errors";
import {
  CodeGenCliCommandContext,
  CodeGenCliCommandResult,
} from "../codegen-cli.contracts";
import {
  toCodeGenJsonValue,
} from "../runtime/codegen-cli-json.utilities";

export abstract class CodeGenGenerationCommandBase {
  constructor(
    readonly generation =
      new CodeGenUnifiedGenerationService(),
  ) {}

  protected async runGeneration(
    context:
      CodeGenCliCommandContext,
    dryRun: boolean,
  ): Promise<
    CodeGenCliCommandResult
  > {
    const key =
      context.args[0];

    if (!key) {
      throw new CodeGenValidationError(
        "Generation key is required",
      );
    }

    const rawMode =
      context.options["mode"];

    const mode =
      typeof rawMode === "string"
        ? rawMode
        : "blueprint";

    if (
      !Object.values(
        CodeGenUnifiedGenerationMode,
      ).includes(
        mode as
          CodeGenUnifiedGenerationMode,
      )
    ) {
      throw new CodeGenValidationError(
        `Unsupported generation mode: ${mode}`,
      );
    }

    const rawVariables =
      context.options["variables"];

    const variables =
      rawVariables &&
      typeof rawVariables === "object" &&
      !Array.isArray(
        rawVariables,
      )
        ? rawVariables
        : {
            moduleName:
              context.options[
                "moduleName"
              ] ??
              "Generated Module",
          };

    const rawTarget =
      context.options["target"];

    const targetRoot =
      typeof rawTarget === "string"
        ? resolve(
            context.cwd,
            rawTarget,
          )
        : resolve(
            context.cwd,
            "generated",
          );

    const rawPolicy =
      context.options["policy"];

    const policy =
      typeof rawPolicy === "string" &&
      Object.values(
        CodeGenConflictPolicy,
      ).includes(
        rawPolicy as
          CodeGenConflictPolicy,
      )
        ? rawPolicy as
            CodeGenConflictPolicy
        : CodeGenConflictPolicy.ERROR;

    const result =
      await this.generation.execute({
        mode:
          mode as
            CodeGenUnifiedGenerationMode,
        key,
        workspaceRoot:
          context.cwd,
        targetRoot,
        variables,
        dryRun,
        strict:
          context.options[
            "strict"
          ] !== false,
        conflictPolicy:
          policy,
        metadata: {
          source:
            "cli",
        },
      });

    return {
      success:
        result.success,
      command:
        dryRun
          ? "preview"
          : "generate",
      message:
        dryRun
          ? "Generation preview completed"
          : "Generation completed",
      data:
        toCodeGenJsonValue(
          result,
        ),
    };
  }
}
