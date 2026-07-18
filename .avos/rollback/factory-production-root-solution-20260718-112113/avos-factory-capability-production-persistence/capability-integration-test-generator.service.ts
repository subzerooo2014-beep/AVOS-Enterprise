import { Injectable } from "@nestjs/common";

export interface IntegrationTestGenerationResult {
  fileName: string;
  content: string;
}

@Injectable()
export class CapabilityIntegrationTestGeneratorService {
  generate(className: string, slug: string): IntegrationTestGenerationResult {
    const moduleClassName = `${className}Module`;

    const content = [
      'import { Test } from "@nestjs/testing";',
      `import { ${moduleClassName} } from "../src/${slug}.module";`,
      "",
      `describe("${moduleClassName} integration", () => {`,
      '  it("compiles the generated capability module", async () => {',
      "    const moduleRef = await Test.createTestingModule({",
      `      imports: [${moduleClassName}]`,
      "    }).compile();",
      "",
      "    expect(moduleRef).toBeDefined();",
      "    await moduleRef.close();",
      "  });",
      "});"
    ].join("\n");

    return {
      fileName: `${slug}.integration.spec.ts`,
      content
    };
  }
}
