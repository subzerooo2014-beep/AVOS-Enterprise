import { Injectable } from "@nestjs/common";

@Injectable()
export class FactoryTemplateRendererService {
  render(
    template: string,
    variables: Record<string, unknown>,
  ): string {
    return template.replace(
      /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g,
      (_match, key: string) => {
        const value = this.resolveValue(variables, key);
        return value === undefined || value === null ? "" : String(value);
      },
    );
  }

  private resolveValue(
    source: Record<string, unknown>,
    key: string,
  ): unknown {
    return key.split(".").reduce<unknown>((current, segment) => {
      if (
        current &&
        typeof current === "object" &&
        segment in (current as Record<string, unknown>)
      ) {
        return (current as Record<string, unknown>)[segment];
      }
      return undefined;
    }, source);
  }
}
