import { randomUUID } from "node:crypto";
import {
  CodeGenBlueprintDefinition,
  CodeGenBlueprintExecutionInput,
  CodeGenBlueprintExecutionPlan,
  CodeGenBlueprintStatus,
  CodeGenBlueprintTemplateBinding,
} from "./codegen-blueprint.contracts";
import {
  CodeGenMetadata,
  CodeGenVersion,
} from "../core/codegen.contracts";
import {
  CodeGenValidationError,
} from "../core/codegen.errors";

export interface CreateBlueprintInput {
  key: string;
  name: string;
  description?: string;
  version: CodeGenVersion;
  category: string;
  templateBindings: CodeGenBlueprintTemplateBinding[];
  dependencies?: string[];
  capabilities?: string[];
  tags?: string[];
  metadata?: CodeGenMetadata;
}

export class CodeGenBlueprintRegistry {
  private readonly blueprints =
    new Map<string, CodeGenBlueprintDefinition>();

  create(
    input: CreateBlueprintInput,
  ): CodeGenBlueprintDefinition {
    const key = input.key.trim();

    if (!key) {
      throw new CodeGenValidationError(
        "Blueprint key is required",
      );
    }

    if (this.blueprints.has(key)) {
      throw new CodeGenValidationError(
        `Blueprint already exists: ${key}`,
      );
    }

    if (
      input.dependencies?.includes(key)
    ) {
      throw new CodeGenValidationError(
        `Blueprint cannot depend on itself: ${key}`,
      );
    }

    const now = new Date().toISOString();

    const blueprint: CodeGenBlueprintDefinition = {
      id: randomUUID(),
      key,
      name: input.name.trim(),
      ...(input.description
        ? { description: input.description }
        : {}),
      version: input.version,
      status: CodeGenBlueprintStatus.ACTIVE,
      category: input.category.trim(),
      templateBindings: [...input.templateBindings]
        .sort((a, b) => a.order - b.order),
      dependencies: Array.from(
        new Set(input.dependencies ?? []),
      ),
      capabilities: Array.from(
        new Set(input.capabilities ?? []),
      ),
      tags: Array.from(new Set(input.tags ?? [])),
      metadata: input.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    };

    this.blueprints.set(key, blueprint);

    return structuredClone(blueprint);
  }

  register(
    blueprint: CodeGenBlueprintDefinition,
    replace = false,
  ): CodeGenBlueprintDefinition {
    if (
      this.blueprints.has(blueprint.key) &&
      !replace
    ) {
      throw new CodeGenValidationError(
        `Blueprint already exists: ${blueprint.key}`,
      );
    }

    this.blueprints.set(
      blueprint.key,
      structuredClone(blueprint),
    );

    return structuredClone(blueprint);
  }

  get(key: string): CodeGenBlueprintDefinition {
    const blueprint = this.blueprints.get(key);

    if (!blueprint) {
      throw new CodeGenValidationError(
        `Blueprint was not found: ${key}`,
      );
    }

    return structuredClone(blueprint);
  }

  list(): CodeGenBlueprintDefinition[] {
    return Array.from(this.blueprints.values())
      .map((item) => structuredClone(item))
      .sort((a, b) => a.key.localeCompare(b.key));
  }

  createExecutionPlan(
    input: CodeGenBlueprintExecutionInput,
  ): CodeGenBlueprintExecutionPlan {
    const blueprint = this.get(input.blueprintKey);

    if (
      blueprint.status !==
      CodeGenBlueprintStatus.ACTIVE
    ) {
      throw new CodeGenValidationError(
        `Blueprint is not active: ${blueprint.key}`,
      );
    }

    return {
      blueprintKey: blueprint.key,
      templates: blueprint.templateBindings
        .filter((binding) => binding.enabled)
        .sort((a, b) => a.order - b.order),
      variables: structuredClone(input.variables),
      dryRun: input.dryRun,
      createdAt: new Date().toISOString(),
    };
  }

  verifyDependencies(key: string): {
    valid: boolean;
    missingDependencies: string[];
  } {
    const blueprint = this.get(key);

    const missingDependencies =
      blueprint.dependencies.filter(
        (dependencyKey) =>
          !this.blueprints.has(dependencyKey),
      );

    return {
      valid: missingDependencies.length === 0,
      missingDependencies,
    };
  }

  remove(key: string): CodeGenBlueprintDefinition {
    const blueprint = this.get(key);
    this.blueprints.delete(key);
    return blueprint;
  }

  clear(): void {
    this.blueprints.clear();
  }
}
