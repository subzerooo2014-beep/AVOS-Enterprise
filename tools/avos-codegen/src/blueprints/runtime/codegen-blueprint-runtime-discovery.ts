import {
  readdir,
  readFile,
} from "node:fs/promises";
import {
  join,
  resolve,
} from "node:path";
import {
  CodeGenValidationError,
} from "../../core/codegen.errors";
import {
  CodeGenBlueprintDefinition,
} from "../codegen-blueprint.contracts";
import {
  CodeGenBlueprintRuntimeDiscoveryRecord,
  CodeGenBlueprintRuntimeSource,
} from "./codegen-blueprint-runtime-metadata.contracts";
import {
  CodeGenBlueprintRuntimeRegistry,
} from "./codegen-blueprint-runtime-registry";

export interface DiscoverBlueprintDirectoryResult {
  rootPath: string;
  discovered:
    CodeGenBlueprintRuntimeDiscoveryRecord[];
  registered:
    CodeGenBlueprintDefinition[];
  warnings: string[];
  errors: string[];
  completedAt: string;
}

export class CodeGenBlueprintRuntimeDiscovery {
  constructor(
    readonly registry =
      new CodeGenBlueprintRuntimeRegistry(),
  ) {}

  async discoverDirectory(
    rootPath: string,
    replace = false,
  ): Promise<
    DiscoverBlueprintDirectoryResult
  > {
    const absoluteRoot =
      resolve(rootPath);

    const files =
      await this.walk(
        absoluteRoot,
      );

    const blueprintFiles =
      files
        .filter(
          (file) =>
            file.endsWith(
              ".blueprint.json",
            ),
        )
        .sort();

    const discovered:
      CodeGenBlueprintRuntimeDiscoveryRecord[] =
      [];

    const registered:
      CodeGenBlueprintDefinition[] =
      [];

    const warnings: string[] = [];
    const errors: string[] = [];

    for (
      const blueprintFile of
      blueprintFiles
    ) {
      try {
        const raw =
          await readFile(
            blueprintFile,
            "utf8",
          );

        const parsed: unknown =
          JSON.parse(raw);

        const definition =
          this.validateDefinition(
            parsed,
            blueprintFile,
          );

        registered.push(
          this.registry.register(
            definition,
            {
              source:
                CodeGenBlueprintRuntimeSource.FILESYSTEM,
              sourcePath:
                blueprintFile,
              replace,
            },
          ),
        );

        discovered.push({
          key:
            definition.key,
          source:
            CodeGenBlueprintRuntimeSource.FILESYSTEM,
          sourcePath:
            blueprintFile,
          valid: true,
          warnings: [],
          errors: [],
          metadata: {
            name:
              definition.name,
            category:
              definition.category,
            templates:
              definition
                .templateBindings
                .length,
          },
          discoveredAt:
            new Date().toISOString(),
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : String(error);

        errors.push(
          `${blueprintFile}: ${message}`,
        );

        discovered.push({
          key:
            blueprintFile,
          source:
            CodeGenBlueprintRuntimeSource.FILESYSTEM,
          sourcePath:
            blueprintFile,
          valid: false,
          warnings: [],
          errors: [
            message,
          ],
          discoveredAt:
            new Date().toISOString(),
        });
      }
    }

    if (
      blueprintFiles.length === 0
    ) {
      warnings.push(
        `No blueprint manifests were found in ${absoluteRoot}`,
      );
    }

    return {
      rootPath:
        absoluteRoot,
      discovered,
      registered,
      warnings,
      errors,
      completedAt:
        new Date().toISOString(),
    };
  }

  private validateDefinition(
    value: unknown,
    sourcePath: string,
  ): CodeGenBlueprintDefinition {
    if (
      !value ||
      typeof value !== "object" ||
      Array.isArray(value)
    ) {
      throw new CodeGenValidationError(
        `Blueprint file must contain a JSON object: ${sourcePath}`,
      );
    }

    const record =
      value as Record<
        string,
        unknown
      >;

    const requiredStrings = [
      "id",
      "key",
      "name",
      "category",
      "status",
      "createdAt",
      "updatedAt",
    ];

    for (
      const property of
      requiredStrings
    ) {
      if (
        typeof record[property] !==
          "string" ||
        !(record[property] as string)
          .trim()
      ) {
        throw new CodeGenValidationError(
          `Blueprint property is required: ${property} in ${sourcePath}`,
        );
      }
    }

    if (
      !record["version"] ||
      typeof record["version"] !==
        "object" ||
      Array.isArray(
        record["version"],
      )
    ) {
      throw new CodeGenValidationError(
        `Blueprint version is required: ${sourcePath}`,
      );
    }

    if (
      !Array.isArray(
        record[
          "templateBindings"
        ],
      )
    ) {
      throw new CodeGenValidationError(
        `Blueprint templateBindings must be an array: ${sourcePath}`,
      );
    }

    return value as
      CodeGenBlueprintDefinition;
  }

  private async walk(
    directory: string,
  ): Promise<string[]> {
    const entries =
      await readdir(
        directory,
        {
          withFileTypes: true,
        },
      );

    const files: string[] = [];

    for (const entry of entries) {
      const absolutePath =
        join(
          directory,
          entry.name,
        );

      if (entry.isDirectory()) {
        files.push(
          ...await this.walk(
            absolutePath,
          ),
        );
      } else if (
        entry.isFile()
      ) {
        files.push(
          absolutePath,
        );
      }
    }

    return files;
  }
}
