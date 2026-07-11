import {
  CodeGenJsonValue,
} from "../../core/codegen.contracts";
import {
  CodeGenValidationError,
} from "../../core/codegen.errors";
import {
  indentText,
  stringifyTemplateValue,
  toCamelCase,
  toConstantCase,
  toKebabCase,
  toPascalCase,
  toSnakeCase,
  toTitleCase,
} from "../utilities/codegen-template-value.utilities";

export type CodeGenTemplateHelper = (
  value: CodeGenJsonValue | undefined,
  args: string[],
) => string;

export class CodeGenTemplateHelperRegistry {
  private readonly helpers =
    new Map<string, CodeGenTemplateHelper>();

  constructor() {
    this.registerDefaults();
  }

  register(
    key: string,
    helper: CodeGenTemplateHelper,
    replace = false,
  ): void {
    const normalizedKey =
      key.trim().toLowerCase();

    if (!normalizedKey) {
      throw new CodeGenValidationError(
        "Template helper key is required",
      );
    }

    if (
      this.helpers.has(normalizedKey) &&
      !replace
    ) {
      throw new CodeGenValidationError(
        `Template helper already exists: ${normalizedKey}`,
      );
    }

    this.helpers.set(
      normalizedKey,
      helper,
    );
  }

  execute(
    key: string,
    value: CodeGenJsonValue | undefined,
    args: string[] = [],
  ): string {
    const normalizedKey =
      key.trim().toLowerCase();

    const helper =
      this.helpers.get(normalizedKey);

    if (!helper) {
      throw new CodeGenValidationError(
        `Template helper was not found: ${normalizedKey}`,
      );
    }

    return helper(value, args);
  }

  has(key: string): boolean {
    return this.helpers.has(
      key.trim().toLowerCase(),
    );
  }

  list(): string[] {
    return Array.from(
      this.helpers.keys(),
    ).sort();
  }

  private registerDefaults(): void {
    this.register(
      "pascalCase",
      (value) =>
        toPascalCase(
          stringifyTemplateValue(value),
        ),
    );

    this.register(
      "camelCase",
      (value) =>
        toCamelCase(
          stringifyTemplateValue(value),
        ),
    );

    this.register(
      "kebabCase",
      (value) =>
        toKebabCase(
          stringifyTemplateValue(value),
        ),
    );

    this.register(
      "snakeCase",
      (value) =>
        toSnakeCase(
          stringifyTemplateValue(value),
        ),
    );

    this.register(
      "constantCase",
      (value) =>
        toConstantCase(
          stringifyTemplateValue(value),
        ),
    );

    this.register(
      "titleCase",
      (value) =>
        toTitleCase(
          stringifyTemplateValue(value),
        ),
    );

    this.register(
      "upper",
      (value) =>
        stringifyTemplateValue(value)
          .toUpperCase(),
    );

    this.register(
      "lower",
      (value) =>
        stringifyTemplateValue(value)
          .toLowerCase(),
    );

    this.register(
      "trim",
      (value) =>
        stringifyTemplateValue(value)
          .trim(),
    );

    this.register(
      "json",
      (value) =>
        JSON.stringify(
          value ?? null,
          null,
          2,
        ),
    );

    this.register(
      "indent",
      (value, args) =>
        indentText(
          stringifyTemplateValue(value),
          Number(args[0] ?? "2"),
        ),
    );

    this.register(
      "default",
      (value, args) => {
        const rendered =
          stringifyTemplateValue(value);

        return rendered ||
          args.join(" ");
      },
    );
  }
}
