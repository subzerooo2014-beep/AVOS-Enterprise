import { Injectable } from "@nestjs/common";

export interface ValidationGenerationResult {
  fileName: string;
  className: string;
  content: string;
}

@Injectable()
export class CapabilityValidationGeneratorService {
  generate(className: string, slug: string): ValidationGenerationResult {
    const validatorClassName = `${className}PayloadValidator`;

    const content = [
      `export class ${validatorClassName} {`,
      "  validate(payload: Record<string, unknown>): void {",
      "    if (!payload || typeof payload !== \"object\") {",
      '      throw new Error("Capability payload must be an object.");',
      "    }",
      "",
      "    if (Object.keys(payload).length === 0) {",
      '      throw new Error("Capability payload cannot be empty.");',
      "    }",
      "  }",
      "}"
    ].join("\n");

    return {
      fileName: `${slug}.validator.ts`,
      className: validatorClassName,
      content
    };
  }
}
