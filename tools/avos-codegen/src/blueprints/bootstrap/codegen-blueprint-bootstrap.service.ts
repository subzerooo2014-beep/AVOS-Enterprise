import {
  resolve,
} from "node:path";
import {
  CodeGenBlueprintRuntimeDiscovery,
} from "../runtime/codegen-blueprint-runtime-discovery";
import {
  CodeGenBlueprintRuntimeRegistry,
} from "../runtime/codegen-blueprint-runtime-registry";
import {
  CodeGenTemplateEngine,
} from "../../templates/codegen-template-engine";
import {
  CodeGenBlueprintBootstrapResult,
} from "./codegen-blueprint-bootstrap.contracts";

export class CodeGenBlueprintBootstrapService {
  constructor(
    readonly blueprintRegistry =
      new CodeGenBlueprintRuntimeRegistry(),
    readonly templateEngine =
      new CodeGenTemplateEngine(),
  ) {}

  async initialize(
    input: {
      codegenRoot: string;
      replace?: boolean;
    },
  ): Promise<
    CodeGenBlueprintBootstrapResult
  > {
    const templatesRoot =
      resolve(
        input.codegenRoot,
        "templates",
      );

    const blueprintsRoot =
      resolve(
        input.codegenRoot,
        "blueprints",
      );

    const templateResult =
      await this.templateEngine.loadDirectory(
        templatesRoot,
        input.replace ?? false,
      );

    const discovery =
      new CodeGenBlueprintRuntimeDiscovery(
        this.blueprintRegistry,
      );

    const blueprintResult =
      await discovery.discoverDirectory(
        blueprintsRoot,
        input.replace ?? false,
      );

    return {
      blueprints:
        blueprintResult.registered,
      templates:
        templateResult.templates,
      warnings: [
        ...templateResult.warnings,
        ...blueprintResult.warnings,
        ...blueprintResult.errors,
      ],
      initializedAt:
        new Date().toISOString(),
    };
  }
}
