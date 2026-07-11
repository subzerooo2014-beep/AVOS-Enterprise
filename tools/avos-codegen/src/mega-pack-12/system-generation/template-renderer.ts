import {
  SystemGenerationComponentRequest,
  SystemGenerationJsonValue,
} from "./contracts";

export class SystemGenerationTemplateRenderer {
  render(
    template: string,
    context: {
      component:
        SystemGenerationComponentRequest;
      variables:
        Record<
          string,
          SystemGenerationJsonValue
        >;
    },
  ): string {
    return template.replace(
      /\{\{\s*([A-Za-z0-9_.]+)\s*\}\}/g,
      (
        _match,
        expression: string,
      ) =>
        this.stringify(
          this.resolve(
            expression,
            context,
          ),
        ),
    );
  }

  private resolve(
    expression: string,
    context: {
      component:
        SystemGenerationComponentRequest;
      variables:
        Record<
          string,
          SystemGenerationJsonValue
        >;
    },
  ): unknown {
    const parts =
      expression.split(".");

    let current: unknown =
      context;

    for (const part of parts) {
      if (
        current === null ||
        typeof current !==
          "object"
      ) {
        return undefined;
      }

      current =
        (
          current as
            Record<
              string,
              unknown
            >
        )[part];
    }

    return current;
  }

  private stringify(
    value: unknown,
  ): string {
    if (
      value === undefined ||
      value === null
    ) {
      return "";
    }

    if (
      typeof value ===
        "string" ||
      typeof value ===
        "number" ||
      typeof value ===
        "boolean"
    ) {
      return String(value);
    }

    return JSON.stringify(
      value,
      null,
      2,
    );
  }
}
