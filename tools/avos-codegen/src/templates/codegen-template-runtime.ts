import {
  CodeGenJsonValue,
} from "../core/codegen.contracts";
import {
  CodeGenRenderedTemplate,
  CodeGenTemplateDefinition,
} from "./codegen-template.contracts";
import {
  CodeGenTemplateEngine,
} from "./codegen-template-engine";

export interface InitializeTemplateRuntimeInput {
  templateRoot: string;
  replace?: boolean;
}

export interface RenderTemplateRuntimeInput {
  templateKey: string;
  variables:
    Record<
      string,
      CodeGenJsonValue
    >;
  strict?: boolean;
  partials?:
    Record<string, string>;
}

export class CodeGenTemplateRuntime {
  private initialized = false;
  private initializedAt:
    string | undefined;

  constructor(
    readonly engine =
      new CodeGenTemplateEngine(),
  ) {}

  async initialize(
    input:
      InitializeTemplateRuntimeInput,
  ): Promise<{
    templates:
      CodeGenTemplateDefinition[];
    warnings: string[];
  }> {
    const result =
      await this.engine.loadDirectory(
        input.templateRoot,
        input.replace ?? false,
      );

    this.initialized = true;
    this.initializedAt =
      new Date().toISOString();

    return result;
  }

  render(
    input:
      RenderTemplateRuntimeInput,
  ): CodeGenRenderedTemplate {
    return this.engine.render(
      input.templateKey,
      {
        variables:
          input.variables,
        strict:
          input.strict ?? true,
        ...(input.partials
          ? {
              partials:
                input.partials,
            }
          : {}),
      },
    );
  }

  renderMany(
    templateKeys:
      readonly string[],
    variables:
      Record<
        string,
        CodeGenJsonValue
      >,
    strict = true,
  ): CodeGenRenderedTemplate[] {
    return this.engine.renderMany(
      templateKeys,
      {
        variables,
        strict,
      },
    );
  }

  snapshot() {
    return {
      initialized:
        this.initialized,
      ...(this.initializedAt
        ? {
            initializedAt:
              this.initializedAt,
          }
        : {}),
      engine:
        this.engine.snapshot(),
      generatedAt:
        new Date().toISOString(),
    };
  }
}
