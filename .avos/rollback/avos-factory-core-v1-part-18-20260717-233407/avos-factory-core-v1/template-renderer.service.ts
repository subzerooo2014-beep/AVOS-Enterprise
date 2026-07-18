import { Injectable } from "@nestjs/common";
import {
  AvosTemplate
} from "./template.contracts";
import {
  TemplateParserService
} from "./template-parser.service";
import {
  TemplateRenderError
} from "./template.errors";

@Injectable()
export class TemplateRendererService {
  constructor(
    private readonly parser:
      TemplateParserService
  ) {}

  render(
    template: AvosTemplate,
    suppliedVariables:
      Record<string, unknown> = {},
    strict = true
  ): {
    content: string;
    resolvedVariables:
      Record<string, unknown>;
    unresolvedVariables: string[];
    warnings: string[];
  } {
    const resolvedVariables =
      this.buildVariableContext(
        template,
        suppliedVariables
      );

    let content =
      template.content;

    content =
      this.renderConditionals(
        content,
        resolvedVariables
      );

    const unresolved =
      new Set<string>();

    content = content.replace(
      /\{\{\s*([A-Za-z_][A-Za-z0-9_.]*)\s*\}\}/g,
      (
        fullMatch: string,
        variableName: string
      ) => {
        const value =
          this.parser.resolveValue(
            resolvedVariables,
            variableName
          );

        if (value === undefined) {
          unresolved.add(variableName);
          return strict
            ? fullMatch
            : "";
        }

        return this.parser.stringifyValue(
          value
        );
      }
    );

    const unresolvedVariables =
      [...unresolved];

    if (
      strict &&
      unresolvedVariables.length > 0
    ) {
      throw new TemplateRenderError(
        `Unresolved template variables: ${unresolvedVariables.join(", ")}`
      );
    }

    return {
      content,
      resolvedVariables,
      unresolvedVariables,
      warnings:
        unresolvedVariables.length > 0
          ? [
              `Unresolved variables: ${unresolvedVariables.join(", ")}`
            ]
          : []
    };
  }

  private buildVariableContext(
    template: AvosTemplate,
    suppliedVariables:
      Record<string, unknown>
  ): Record<string, unknown> {
    const context:
      Record<string, unknown> = {};

    for (
      const definition
      of template.variables ?? []
    ) {
      if (
        definition.defaultValue !==
        undefined
      ) {
        context[definition.name] =
          structuredClone(
            definition.defaultValue
          );
      }
    }

    for (
      const [name, value]
      of Object.entries(
        suppliedVariables
      )
    ) {
      context[name] =
        structuredClone(value);
    }

    const missingRequired =
      (template.variables ?? [])
        .filter(
          (definition) =>
            definition.required === true &&
            context[definition.name] ===
              undefined
        )
        .map(
          (definition) =>
            definition.name
        );

    if (
      missingRequired.length > 0
    ) {
      throw new TemplateRenderError(
        `Missing required variables: ${missingRequired.join(", ")}`
      );
    }

    return context;
  }

  private renderConditionals(
    content: string,
    variables:
      Record<string, unknown>
  ): string {
    let result = content;

    const ifExpression =
      /\{\{#if\s+([A-Za-z_][A-Za-z0-9_.]*)\s*\}\}([\s\S]*?)\{\{\/if\}\}/g;

    result = result.replace(
      ifExpression,
      (
        _match: string,
        variableName: string,
        body: string
      ) => {
        const value =
          this.parser.resolveValue(
            variables,
            variableName
          );

        return this.parser.isTruthy(value)
          ? body
          : "";
      }
    );

    const unlessExpression =
      /\{\{#unless\s+([A-Za-z_][A-Za-z0-9_.]*)\s*\}\}([\s\S]*?)\{\{\/unless\}\}/g;

    result = result.replace(
      unlessExpression,
      (
        _match: string,
        variableName: string,
        body: string
      ) => {
        const value =
          this.parser.resolveValue(
            variables,
            variableName
          );

        return this.parser.isTruthy(value)
          ? ""
          : body;
      }
    );

    return result;
  }
}
