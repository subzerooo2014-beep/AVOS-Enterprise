import {
  readFile,
} from "node:fs/promises";
import {
  resolve,
} from "node:path";
import {
  CodeGenValidationError,
} from "../../core/codegen.errors";
import {
  CodeGenBlueprintDefinition,
} from "../codegen-blueprint.contracts";
import {
  CodeGenBlueprintRuntimeSource,
} from "./codegen-blueprint-runtime-metadata.contracts";
import {
  CodeGenBlueprintRuntimeRegistry,
} from "./codegen-blueprint-runtime-registry";

export interface CodeGenLoadedBlueprint {
  definition:
    CodeGenBlueprintDefinition;
  sourcePath: string;
  source:
    CodeGenBlueprintRuntimeSource;
  loadedAt: string;
}

export class CodeGenBlueprintRuntimeLoader {
  constructor(
    readonly registry =
      new CodeGenBlueprintRuntimeRegistry(),
  ) {}

  async loadFile(
    filePath: string,
    replace = false,
  ): Promise<
    CodeGenLoadedBlueprint
  > {
    const absolutePath =
      resolve(filePath);

    let parsed: unknown;

    try {
      parsed =
        JSON.parse(
          await readFile(
            absolutePath,
            "utf8",
          ),
        );
    } catch (error) {
      throw new CodeGenValidationError(
        `Unable to load blueprint file: ${absolutePath}`,
        error,
      );
    }

    const definition =
      this.validateDefinition(
        parsed,
        absolutePath,
      );

    const registered =
      this.registry.register(
        definition,
        {
          source:
            CodeGenBlueprintRuntimeSource.FILESYSTEM,
          sourcePath:
            absolutePath,
          replace,
        },
      );

    return {
      definition:
        registered,
      sourcePath:
        absolutePath,
      source:
        CodeGenBlueprintRuntimeSource.FILESYSTEM,
      loadedAt:
        new Date().toISOString(),
    };
  }

  loadDefinition(
    definition:
      CodeGenBlueprintDefinition,
    replace = false,
  ): CodeGenLoadedBlueprint {
    const registered =
      this.registry.register(
        definition,
        {
          source:
            CodeGenBlueprintRuntimeSource.MEMORY,
          replace,
        },
      );

    return {
      definition:
        registered,
      sourcePath:
        "memory",
      source:
        CodeGenBlueprintRuntimeSource.MEMORY,
      loadedAt:
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
        `Blueprint definition must be a JSON object: ${sourcePath}`,
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

    if (
      !Array.isArray(
        record["dependencies"],
      )
    ) {
      throw new CodeGenValidationError(
        `Blueprint dependencies must be an array: ${sourcePath}`,
      );
    }

    if (
      !Array.isArray(
        record["capabilities"],
      )
    ) {
      throw new CodeGenValidationError(
        `Blueprint capabilities must be an array: ${sourcePath}`,
      );
    }

    if (
      !Array.isArray(
        record["tags"],
      )
    ) {
      throw new CodeGenValidationError(
        `Blueprint tags must be an array: ${sourcePath}`,
      );
    }

    return value as
      CodeGenBlueprintDefinition;
  }
}
