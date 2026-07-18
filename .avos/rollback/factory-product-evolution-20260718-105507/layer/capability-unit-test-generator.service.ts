import { Injectable } from "@nestjs/common";

export interface UnitTestGenerationResult {
  fileName: string;
  content: string;
}

@Injectable()
export class CapabilityUnitTestGeneratorService {
  generate(className: string, slug: string): UnitTestGenerationResult {
    const serviceClassName = `${className}Service`;

    const content = [
      `import { ${serviceClassName} } from "../src/${slug}.service";`,
      "",
      `describe("${serviceClassName}", () => {`,
      `  let service: ${serviceClassName};`,
      "",
      "  beforeEach(() => {",
      `    service = new ${serviceClassName}();`,
      "  });",
      "",
      '  it("returns healthy status", () => {',
      "    expect(service.health()).toEqual(",
      "      expect.objectContaining({",
      '        status: "healthy",',
      "        score: 100",
      "      })",
      "    );",
      "  });",
      "",
      '  it("executes a payload", () => {',
      '    const result = service.execute({ sample: true });',
      "    expect(result.success).toBe(true);",
      "  });",
      "});"
    ].join("\n");

    return {
      fileName: `${slug}.service.spec.ts`,
      content
    };
  }
}
