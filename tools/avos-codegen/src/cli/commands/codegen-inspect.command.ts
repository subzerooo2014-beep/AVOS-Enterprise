import {
  resolve,
} from "node:path";
import {
  CodeGenBlueprintBootstrapService,
} from "../../blueprints/bootstrap/codegen-blueprint-bootstrap.service";
import {
  CodeGenValidationError,
} from "../../core/codegen.errors";
import {
  CodeGenCliCommand,
  CodeGenCliCommandContext,
  CodeGenCliCommandResult,
} from "../codegen-cli.contracts";
import {
  toCodeGenJsonValue,
} from "../runtime/codegen-cli-json.utilities";

export class CodeGenInspectCommand
  implements CodeGenCliCommand {
  readonly key = "inspect";
  readonly name =
    "Inspect CodeGen Asset";
  readonly description =
    "Inspects a blueprint or template";
  readonly aliases = [
    "show",
    "describe",
  ];

  constructor(
    readonly bootstrap =
      new CodeGenBlueprintBootstrapService(),
  ) {}

  async execute(
    context:
      CodeGenCliCommandContext,
  ): Promise<
    CodeGenCliCommandResult
  > {
    const key =
      context.args[0];

    if (!key) {
      throw new CodeGenValidationError(
        "Asset key is required",
      );
    }

    const result =
      await this.bootstrap.initialize({
        codegenRoot:
          resolve(
            context.cwd,
          ),
        replace: true,
      });

    const blueprint =
      result.blueprints.find(
        (item) =>
          item.key === key,
      );

    if (blueprint) {
      return {
        success: true,
        command:
          this.key,
        message:
          `Blueprint found: ${key}`,
        data:
          toCodeGenJsonValue(
            blueprint,
          ),
      };
    }

    const template =
      result.templates.find(
        (item) =>
          item.key === key,
      );

    if (template) {
      return {
        success: true,
        command:
          this.key,
        message:
          `Template found: ${key}`,
        data:
          toCodeGenJsonValue({
            ...template,
            content:
              `[${template.content.length} characters]`,
          }),
      };
    }

    throw new CodeGenValidationError(
      `CodeGen asset was not found: ${key}`,
    );
  }
}
