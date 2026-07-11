import {
  CodeGenGenerator,
  CodeGenGeneratorStatus,
} from "./codegen-generator.contracts";
import {
  CodeGenValidationError,
} from "../core/codegen.errors";

export class CodeGenGeneratorRegistry {
  private readonly generators =
    new Map<string, CodeGenGenerator>();

  register(
    generator: CodeGenGenerator,
    replace = false,
  ): CodeGenGenerator {
    const key =
      generator.descriptor.key.trim();

    if (!key) {
      throw new CodeGenValidationError(
        "Generator key is required",
      );
    }

    if (
      this.generators.has(key) &&
      !replace
    ) {
      throw new CodeGenValidationError(
        `Generator already exists: ${key}`,
      );
    }

    this.generators.set(
      key,
      generator,
    );

    return generator;
  }

  get(key: string): CodeGenGenerator {
    const generator =
      this.generators.get(key);

    if (!generator) {
      throw new CodeGenValidationError(
        `Generator was not found: ${key}`,
      );
    }

    return generator;
  }

  list(): readonly CodeGenGenerator[] {
    return Array.from(
      this.generators.values(),
    )
      .filter(
        (generator) =>
          generator.descriptor.status ===
          CodeGenGeneratorStatus.ACTIVE,
      )
      .sort(
        (a, b) =>
          a.descriptor.key.localeCompare(
            b.descriptor.key,
          ),
      );
  }

  remove(key: string): CodeGenGenerator {
    const generator = this.get(key);
    this.generators.delete(key);
    return generator;
  }

  clear(): void {
    this.generators.clear();
  }
}
