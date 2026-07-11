import {
  resolve,
} from "node:path";
import {
  CodeGenBlueprintBootstrapService,
} from "../../blueprints/bootstrap/codegen-blueprint-bootstrap.service";
import {
  CodeGenCliCommand,
  CodeGenCliCommandContext,
  CodeGenCliCommandResult,
} from "../codegen-cli.contracts";

export class CodeGenListCommand
  implements CodeGenCliCommand {
  readonly key = "list";
  readonly name =
    "List CodeGen Assets";
  readonly description =
    "Lists discovered blueprints and templates";
  readonly aliases = [
    "ls",
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
    const result =
      await this.bootstrap.initialize({
        codegenRoot:
          resolve(
            context.cwd,
          ),
        replace: true,
      });

    return {
      success: true,
      command:
        this.key,
      message:
        "CodeGen assets discovered",
      data: {
        blueprints:
          result.blueprints.map(
            (blueprint) => ({
              key:
                blueprint.key,
              name:
                blueprint.name,
              category:
                blueprint.category,
              templates:
                blueprint
                  .templateBindings
                  .length,
            }),
          ),
        templates:
          result.templates.map(
            (template) => ({
              key:
                template.key,
              name:
                template.name,
              targetPath:
                template.targetPath,
            }),
          ),
        warnings:
          result.warnings,
      },
    };
  }
}
