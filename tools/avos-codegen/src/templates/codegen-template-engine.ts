import {
  randomUUID,
} from "node:crypto";
import {
  CodeGenMetadata,
  CodeGenVersion,
} from "../core/codegen.contracts";
import {
  CodeGenValidationError,
} from "../core/codegen.errors";
import {
  CodeGenCompiledTemplate,
  CodeGenLoadedTemplate,
  CodeGenRenderedTemplate,
  CodeGenTemplateDefinition,
  CodeGenTemplateRenderContext,
  CodeGenTemplateStatus,
  CodeGenTemplateType,
  CodeGenTemplateVariable,
} from "./codegen-template.contracts";
import {
  CodeGenTemplateCache,
} from "./cache/codegen-template-cache";
import {
  CodeGenTemplateCatalog,
} from "./catalog/codegen-template-catalog";
import {
  CodeGenTemplateCompiler,
} from "./compiler/codegen-template-compiler";
import {
  CodeGenTemplateRenderer,
} from "./compiler/codegen-template-renderer";
import {
  CodeGenTemplateLoader,
} from "./loading/codegen-template-loader";

export interface CreateTemplateInput {
  key: string;
  name: string;
  description?: string;
  type?: CodeGenTemplateType;
  version: CodeGenVersion;
  targetPath: string;
  content: string;
  variables?: CodeGenTemplateVariable[];
  tags?: string[];
  metadata?: CodeGenMetadata;
}

export class CodeGenTemplateEngine {
  constructor(
    readonly catalog =
      new CodeGenTemplateCatalog(),
    readonly compiler =
      new CodeGenTemplateCompiler(),
    readonly renderer =
      new CodeGenTemplateRenderer(),
    readonly loader =
      new CodeGenTemplateLoader(),
    readonly cache =
      new CodeGenTemplateCache(),
  ) {}

  create(
    input: CreateTemplateInput,
  ): CodeGenTemplateDefinition {
    const key = input.key.trim();

    if (!key) {
      throw new CodeGenValidationError(
        "Template key is required",
      );
    }

    if (this.catalog.find(key)) {
      throw new CodeGenValidationError(
        `Template already exists: ${key}`,
      );
    }

    const now =
      new Date().toISOString();

    const template:
      CodeGenTemplateDefinition = {
      id: randomUUID(),
      key,
      name: input.name.trim(),
      ...(input.description
        ? {
            description:
              input.description,
          }
        : {}),
      type:
        input.type ??
        CodeGenTemplateType.FILE,
      status:
        CodeGenTemplateStatus.ACTIVE,
      version:
        structuredClone(
          input.version,
        ),
      targetPath:
        input.targetPath,
      content:
        input.content,
      variables:
        structuredClone(
          input.variables ?? [],
        ),
      tags:
        Array.from(
          new Set(
            input.tags ?? [],
          ),
        ),
      metadata:
        structuredClone(
          input.metadata ?? {},
        ),
      createdAt: now,
      updatedAt: now,
    };

    this.catalog.register(
      template,
    );

    return structuredClone(template);
  }

  register(
    template:
      CodeGenTemplateDefinition,
    replace = false,
  ): CodeGenTemplateDefinition {
    if (replace) {
      this.cache.remove(
        template.key,
      );
    }

    return this.catalog.register(
      template,
      replace,
    );
  }

  async loadManifest(
    manifestPath: string,
    replace = false,
  ): Promise<
    CodeGenTemplateDefinition
  > {
    const loaded =
      await this.loader.loadManifest(
        manifestPath,
      );

    return this.registerLoaded(
      loaded,
      replace,
    );
  }

  async loadDirectory(
    rootPath: string,
    replace = false,
  ): Promise<{
    templates:
      CodeGenTemplateDefinition[];
    warnings: string[];
  }> {
    const result =
      await this.loader.loadDirectory(
        rootPath,
      );

    const templates =
      result.loaded.map(
        (loaded) =>
          this.registerLoaded(
            loaded,
            replace,
          ),
      );

    return {
      templates,
      warnings:
        result.warnings,
    };
  }

  get(
    key: string,
  ): CodeGenTemplateDefinition {
    return this.catalog.get(key);
  }

  find(
    key: string,
  ): CodeGenTemplateDefinition | undefined {
    return this.catalog.find(key);
  }

  list():
    CodeGenTemplateDefinition[] {
    return this.catalog.query();
  }

  compile(
    key: string,
  ): CodeGenCompiledTemplate {
    const template =
      this.get(key);

    const checksum =
      this.compiler.checksum(
        template.content,
      );

    const cached =
      this.cache.get(
        template.key,
        checksum,
      );

    if (cached) {
      return cached;
    }

    const compiled =
      this.compiler.compile({
        key:
          template.key,
        source:
          template.content,
      });

    return this.cache.set(
      compiled,
    );
  }

  render(
    key: string,
    context:
      CodeGenTemplateRenderContext,
  ): CodeGenRenderedTemplate {
    const template =
      this.get(key);

    if (
      template.status !==
      CodeGenTemplateStatus.ACTIVE
    ) {
      throw new CodeGenValidationError(
        `Template is not active: ${key}`,
      );
    }

    const variables =
      this.applyDefaults(
        template,
        context,
      );

    this.validateRequiredVariables(
      template,
      variables,
      context.strict,
    );

    const compiled =
      this.compile(key);

    const rendered =
      this.renderer.render(
        compiled,
        {
          ...context,
          variables,
        },
      );

    const targetPath =
      this.renderer.renderString(
        `${key}:target-path`,
        template.targetPath,
        {
          ...context,
          variables,
        },
      );

    return {
      templateKey:
        template.key,
      targetPath,
      content:
        rendered.content,
      checksum:
        this.compiler.checksum(
          rendered.content,
        ),
      diagnostics:
        rendered.diagnostics,
      renderedAt:
        new Date().toISOString(),
    };
  }

  renderMany(
    keys: readonly string[],
    context:
      CodeGenTemplateRenderContext,
  ): CodeGenRenderedTemplate[] {
    return keys.map(
      (key) =>
        this.render(
          key,
          context,
        ),
    );
  }

  remove(
    key: string,
  ): CodeGenTemplateDefinition {
    this.cache.remove(key);
    return this.catalog.remove(key);
  }

  clear(): void {
    this.catalog.clear();
    this.cache.clear();
  }

  snapshot() {
    return {
      templates:
        this.catalog.count(),
      activeTemplates:
        this.catalog
          .listActive()
          .length,
      cache:
        this.cache.snapshot(),
      generatedAt:
        new Date().toISOString(),
    };
  }

  private registerLoaded(
    loaded: CodeGenLoadedTemplate,
    replace: boolean,
  ): CodeGenTemplateDefinition {
    return this.register(
      loaded.definition,
      replace,
    );
  }

  private applyDefaults(
    template:
      CodeGenTemplateDefinition,
    context:
      CodeGenTemplateRenderContext,
  ):
    CodeGenTemplateRenderContext["variables"] {
    const variables =
      structuredClone(
        context.variables,
      );

    for (
      const variable of
      template.variables
    ) {
      if (
        variables[
          variable.key
        ] === undefined &&
        variable.defaultValue !==
          undefined
      ) {
        variables[
          variable.key
        ] =
          structuredClone(
            variable.defaultValue,
          );
      }
    }

    return variables;
  }

  private validateRequiredVariables(
    template:
      CodeGenTemplateDefinition,
    variables:
      CodeGenTemplateRenderContext["variables"],
    strict: boolean,
  ): void {
    if (!strict) {
      return;
    }

    const missing =
      template.variables
        .filter(
          (variable) =>
            variable.required &&
            variables[
              variable.key
            ] === undefined,
        )
        .map(
          (variable) =>
            variable.key,
        );

    if (missing.length > 0) {
      throw new CodeGenValidationError(
        `Required template variables are missing for ${template.key}: ${missing.join(", ")}`,
      );
    }
  }
}
