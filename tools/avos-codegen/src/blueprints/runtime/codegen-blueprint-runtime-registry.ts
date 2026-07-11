import {
  CodeGenValidationError,
} from "../../core/codegen.errors";
import {
  CodeGenBlueprintDefinition,
  CodeGenBlueprintStatus,
} from "../codegen-blueprint.contracts";
import {
  CodeGenBlueprintRuntimeMetadata,
  CodeGenBlueprintRuntimeRegistrySnapshot,
  CodeGenBlueprintRuntimeSource,
} from "./codegen-blueprint-runtime-metadata.contracts";

export class CodeGenBlueprintRuntimeRegistry {
  private readonly definitions =
    new Map<
      string,
      CodeGenBlueprintDefinition
    >();

  private readonly metadata =
    new Map<
      string,
      CodeGenBlueprintRuntimeMetadata
    >();

  register(
    definition:
      CodeGenBlueprintDefinition,
    options: {
      source?:
        CodeGenBlueprintRuntimeSource;
      sourcePath?: string;
      replace?: boolean;
    } = {},
  ): CodeGenBlueprintDefinition {
    const key =
      definition.key.trim();

    if (!key) {
      throw new CodeGenValidationError(
        "Blueprint runtime registry key is required",
      );
    }

    if (
      this.definitions.has(key) &&
      options.replace !== true
    ) {
      throw new CodeGenValidationError(
        `Blueprint runtime definition already exists: ${key}`,
      );
    }

    const normalized:
      CodeGenBlueprintDefinition = {
      ...structuredClone(
        definition,
      ),
      key,
      dependencies:
        Array.from(
          new Set(
            definition.dependencies,
          ),
        ),
      capabilities:
        Array.from(
          new Set(
            definition.capabilities,
          ),
        ),
      tags:
        Array.from(
          new Set(
            definition.tags,
          ),
        ),
      templateBindings:
        [...definition.templateBindings]
          .sort(
            (left, right) =>
              left.order -
              right.order,
          ),
      updatedAt:
        new Date().toISOString(),
    };

    this.definitions.set(
      key,
      normalized,
    );

    const runtimeMetadata:
      CodeGenBlueprintRuntimeMetadata = {
      key,
      name:
        normalized.name,
      ...(normalized.description
        ? {
            description:
              normalized.description,
          }
        : {}),
      version:
        structuredClone(
          normalized.version,
        ),
      source:
        options.source ??
        CodeGenBlueprintRuntimeSource.MEMORY,
      ...(options.sourcePath
        ? {
            sourcePath:
              options.sourcePath,
          }
        : {}),
      enabled:
        normalized.status ===
        CodeGenBlueprintStatus.ACTIVE,
      category:
        normalized.category,
      capabilities:
        [...normalized.capabilities],
      dependencies:
        [...normalized.dependencies],
      tags:
        [...normalized.tags],
      templateKeys:
        normalized.templateBindings
          .filter(
            (binding) =>
              binding.enabled,
          )
          .sort(
            (left, right) =>
              left.order -
              right.order,
          )
          .map(
            (binding) =>
              binding.templateKey,
          ),
      metadata:
        structuredClone(
          normalized.metadata,
        ),
      discoveredAt:
        options.replace &&
        this.metadata.get(key)
          ?.discoveredAt
          ? this.metadata.get(key)!
              .discoveredAt
          : new Date().toISOString(),
      registeredAt:
        new Date().toISOString(),
    };

    this.metadata.set(
      key,
      runtimeMetadata,
    );

    return structuredClone(
      normalized,
    );
  }

  get(
    key: string,
  ): CodeGenBlueprintDefinition {
    const definition =
      this.definitions.get(key);

    if (!definition) {
      throw new CodeGenValidationError(
        `Blueprint runtime definition was not found: ${key}`,
      );
    }

    return structuredClone(
      definition,
    );
  }

  find(
    key: string,
  ):
    CodeGenBlueprintDefinition |
    undefined {
    const definition =
      this.definitions.get(key);

    return definition
      ? structuredClone(
          definition,
        )
      : undefined;
  }

  getMetadata(
    key: string,
  ): CodeGenBlueprintRuntimeMetadata {
    const value =
      this.metadata.get(key);

    if (!value) {
      throw new CodeGenValidationError(
        `Blueprint runtime metadata was not found: ${key}`,
      );
    }

    return structuredClone(
      value,
    );
  }

  list(
    enabledOnly = false,
  ): CodeGenBlueprintDefinition[] {
    return Array.from(
      this.definitions.values(),
    )
      .filter(
        (definition) =>
          !enabledOnly ||
          definition.status ===
            CodeGenBlueprintStatus.ACTIVE,
      )
      .map((definition) =>
        structuredClone(
          definition,
        ),
      )
      .sort(
        (left, right) =>
          left.key.localeCompare(
            right.key,
          ),
      );
  }

  listMetadata():
    CodeGenBlueprintRuntimeMetadata[] {
    return Array.from(
      this.metadata.values(),
    )
      .map((value) =>
        structuredClone(value),
      )
      .sort(
        (left, right) =>
          left.key.localeCompare(
            right.key,
          ),
      );
  }

  verifyDependencies(
    key: string,
  ): {
    valid: boolean;
    missingDependencies: string[];
  } {
    const definition =
      this.get(key);

    const missingDependencies =
      definition.dependencies
        .filter(
          (dependencyKey) =>
            !this.definitions.has(
              dependencyKey,
            ),
        );

    return {
      valid:
        missingDependencies.length ===
        0,
      missingDependencies,
    };
  }

  snapshot():
    CodeGenBlueprintRuntimeRegistrySnapshot {
    const metadata =
      this.listMetadata();

    return {
      registered:
        metadata.length,
      enabled:
        metadata.filter(
          (item) =>
            item.enabled,
        ).length,
      disabled:
        metadata.filter(
          (item) =>
            !item.enabled,
        ).length,
      categories:
        Array.from(
          new Set(
            metadata.map(
              (item) =>
                item.category,
            ),
          ),
        ).sort(),
      capabilities:
        Array.from(
          new Set(
            metadata.flatMap(
              (item) =>
                item.capabilities,
            ),
          ),
        ).sort(),
      dependencies:
        metadata.reduce(
          (total, item) =>
            total +
            item.dependencies.length,
          0,
        ),
      generatedAt:
        new Date().toISOString(),
    };
  }

  remove(
    key: string,
  ): CodeGenBlueprintDefinition {
    const definition =
      this.get(key);

    this.definitions.delete(key);
    this.metadata.delete(key);

    return definition;
  }

  clear(): void {
    this.definitions.clear();
    this.metadata.clear();
  }
}
