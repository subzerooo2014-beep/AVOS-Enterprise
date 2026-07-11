import {
  CodeGenDuplicateEngineError,
  CodeGenEngineNotFoundError,
  CodeGenValidationError,
} from "../core/codegen.errors";
import {
  CodeGenEngine,
} from "../core/codegen.contracts";

export interface RegisterEngineOptions {
  replace?: boolean;
}

export class CodeGenEngineRegistry {
  private readonly engines =
    new Map<string, CodeGenEngine>();

  register(
    engine: CodeGenEngine,
    options:
      RegisterEngineOptions = {},
  ): CodeGenEngine {
    this.validate(engine);

    const exists =
      this.engines.has(
        engine.descriptor.key,
      );

    if (
      exists &&
      !options.replace
    ) {
      throw new CodeGenDuplicateEngineError(
        engine.descriptor.key,
      );
    }

    this.engines.set(
      engine.descriptor.key,
      engine,
    );

    return engine;
  }

  get(
    key: string,
  ): CodeGenEngine {
    const engine =
      this.engines.get(key);

    if (!engine) {
      throw new CodeGenEngineNotFoundError(
        key,
      );
    }

    return engine;
  }

  find(
    key: string,
  ): CodeGenEngine | undefined {
    return this.engines.get(key);
  }

  has(
    key: string,
  ): boolean {
    return this.engines.has(key);
  }

  remove(
    key: string,
  ): CodeGenEngine {
    const engine =
      this.get(key);

    this.engines.delete(key);

    return engine;
  }

  list():
    readonly CodeGenEngine[] {
    return Array.from(
      this.engines.values(),
    ).sort(
      (left, right) =>
        right.descriptor.priority -
        left.descriptor.priority,
    );
  }

  listEnabled():
    readonly CodeGenEngine[] {
    return this.list().filter(
      (engine) =>
        engine.descriptor.enabled,
    );
  }

  count(): number {
    return this.engines.size;
  }

  clear(): void {
    this.engines.clear();
  }

  private validate(
    engine: CodeGenEngine,
  ): void {
    const descriptor =
      engine.descriptor;

    if (
      !descriptor.key.trim()
    ) {
      throw new CodeGenValidationError(
        "Engine key is required",
      );
    }

    if (
      !descriptor.name.trim()
    ) {
      throw new CodeGenValidationError(
        `Engine name is required for ${descriptor.key}`,
      );
    }

    if (
      !Number.isInteger(
        descriptor.priority,
      )
    ) {
      throw new CodeGenValidationError(
        `Engine priority must be an integer: ${descriptor.key}`,
      );
    }

    if (
      descriptor.dependencies
        .includes(
          descriptor.key,
        )
    ) {
      throw new CodeGenValidationError(
        `Engine cannot depend on itself: ${descriptor.key}`,
      );
    }
  }
}
