import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  CodeGenConfigurationEntry,
  CodeGenConfigurationSnapshot,
  CodeGenConfigurationSource,
  CodeGenJsonValue,
} from "../core/codegen.contracts";
import {
  CodeGenValidationError,
} from "../core/codegen.errors";

export interface SetConfigurationOptions {
  source?: CodeGenConfigurationSource;
  readonly?: boolean;
  description?: string;
  overwrite?: boolean;
}

export class CodeGenConfigurationEngine {
  private readonly entries =
    new Map<
      string,
      CodeGenConfigurationEntry
    >();

  set(
    key: string,
    value: CodeGenJsonValue,
    options: SetConfigurationOptions = {},
  ): CodeGenConfigurationEntry {
    const normalizedKey = key.trim();

    if (!normalizedKey) {
      throw new CodeGenValidationError(
        "Configuration key is required",
      );
    }

    const existing =
      this.entries.get(normalizedKey);

    if (
      existing?.readonly &&
      options.overwrite !== true
    ) {
      throw new CodeGenValidationError(
        `Configuration entry is readonly: ${normalizedKey}`,
      );
    }

    if (
      existing &&
      options.overwrite === false
    ) {
      throw new CodeGenValidationError(
        `Configuration entry already exists: ${normalizedKey}`,
      );
    }

    const entry:
      CodeGenConfigurationEntry = {
      key: normalizedKey,
      value: structuredClone(value),
      source:
        options.source ??
        CodeGenConfigurationSource.RUNTIME,
      readonly: options.readonly ?? false,
      ...(options.description
        ? {
            description:
              options.description,
          }
        : {}),
      updatedAt:
        new Date().toISOString(),
    };

    this.entries.set(
      normalizedKey,
      entry,
    );

    return structuredClone(entry);
  }

  get<T extends CodeGenJsonValue>(
    key: string,
  ): T {
    const entry = this.entries.get(key);

    if (!entry) {
      throw new CodeGenValidationError(
        `Configuration entry was not found: ${key}`,
      );
    }

    return structuredClone(
      entry.value,
    ) as T;
  }

  find<T extends CodeGenJsonValue>(
    key: string,
  ): T | undefined {
    const entry = this.entries.get(key);

    return entry
      ? structuredClone(
          entry.value,
        ) as T
      : undefined;
  }

  has(key: string): boolean {
    return this.entries.has(key);
  }

  remove(
    key: string,
  ): CodeGenConfigurationEntry {
    const entry = this.entries.get(key);

    if (!entry) {
      throw new CodeGenValidationError(
        `Configuration entry was not found: ${key}`,
      );
    }

    if (entry.readonly) {
      throw new CodeGenValidationError(
        `Readonly configuration cannot be removed: ${key}`,
      );
    }

    this.entries.delete(key);

    return structuredClone(entry);
  }

  list(): CodeGenConfigurationEntry[] {
    return Array.from(
      this.entries.values(),
    )
      .map((entry) =>
        structuredClone(entry),
      )
      .sort((left, right) =>
        left.key.localeCompare(
          right.key,
        ),
      );
  }

  snapshot():
    CodeGenConfigurationSnapshot {
    const entries = this.list();

    return {
      entries,
      count: entries.length,
      generatedAt:
        new Date().toISOString(),
    };
  }

  loadDefaults(
    values: Record<
      string,
      CodeGenJsonValue
    >,
  ): void {
    for (
      const [key, value] of
      Object.entries(values)
    ) {
      if (!this.has(key)) {
        this.set(
          key,
          value,
          {
            source:
              CodeGenConfigurationSource.DEFAULT,
            overwrite: false,
          },
        );
      }
    }
  }

  loadEnvironment(
    prefix = "AVOS_CODEGEN_",
  ): void {
    for (
      const [key, value] of
      Object.entries(process.env)
    ) {
      if (
        !key.startsWith(prefix) ||
        value === undefined
      ) {
        continue;
      }

      const normalizedKey =
        key
          .slice(prefix.length)
          .toLowerCase()
          .replaceAll("__", ".")
          .replaceAll("_", "-");

      this.set(
        normalizedKey,
        value,
        {
          source:
            CodeGenConfigurationSource.ENVIRONMENT,
          overwrite: true,
        },
      );
    }
  }

  async loadJsonFile(
    filePath: string,
  ): Promise<void> {
    const absolutePath =
      resolve(filePath);

    const raw =
      await readFile(
        absolutePath,
        "utf8",
      );

    const parsed: unknown =
      JSON.parse(raw);

    if (
      !parsed ||
      typeof parsed !== "object" ||
      Array.isArray(parsed)
    ) {
      throw new CodeGenValidationError(
        `Configuration file must contain a JSON object: ${absolutePath}`,
      );
    }

    for (
      const [key, value] of
      Object.entries(parsed)
    ) {
      this.set(
        key,
        value as CodeGenJsonValue,
        {
          source:
            CodeGenConfigurationSource.FILE,
          overwrite: true,
        },
      );
    }
  }

  clear(): void {
    for (
      const entry of
      this.entries.values()
    ) {
      if (!entry.readonly) {
        this.entries.delete(
          entry.key,
        );
      }
    }
  }
}
