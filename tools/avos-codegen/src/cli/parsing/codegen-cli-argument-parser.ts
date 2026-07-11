import {
  CodeGenJsonValue,
} from "../../core/codegen.contracts";
import {
  CodeGenCliParsedInput,
} from "../runtime/codegen-cli-runtime.contracts";

export class CodeGenCliArgumentParser {
  parse(
    argv: readonly string[],
  ): CodeGenCliParsedInput {
    const values =
      [...argv];

    const command =
      values.shift() ??
      "help";

    const args: string[] = [];

    const options:
      Record<
        string,
        CodeGenJsonValue
      > = {};

    for (
      let index = 0;
      index < values.length;
      index += 1
    ) {
      const value =
        values[index]!;

      if (
        !value.startsWith("--")
      ) {
        args.push(value);
        continue;
      }

      const normalized =
        value.slice(2);

      if (
        normalized.includes("=")
      ) {
        const separator =
          normalized.indexOf("=");

        const key =
          normalized.slice(
            0,
            separator,
          );

        const raw =
          normalized.slice(
            separator + 1,
          );

        options[key] =
          this.parseValue(raw);

        continue;
      }

      const next =
        values[index + 1];

      if (
        next !== undefined &&
        !next.startsWith("--")
      ) {
        options[normalized] =
          this.parseValue(next);

        index += 1;
      } else {
        options[normalized] =
          true;
      }
    }

    return {
      command,
      args,
      options,
    };
  }

  private parseValue(
    value: string,
  ): CodeGenJsonValue {
    const normalized =
      value.trim();

    if (
      normalized === "true"
    ) {
      return true;
    }

    if (
      normalized === "false"
    ) {
      return false;
    }

    if (
      normalized === "null"
    ) {
      return null;
    }

    if (
      normalized &&
      Number.isFinite(
        Number(normalized),
      )
    ) {
      return Number(
        normalized,
      );
    }

    if (
      (
        normalized.startsWith("{") &&
        normalized.endsWith("}")
      ) ||
      (
        normalized.startsWith("[") &&
        normalized.endsWith("]")
      )
    ) {
      try {
        return JSON.parse(
          normalized,
        ) as CodeGenJsonValue;
      } catch {
        return normalized;
      }
    }

    return normalized;
  }
}
