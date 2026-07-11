import {
  createHash,
} from "node:crypto";
import {
  AutonomousArtifactKind,
  AutonomousGeneratedArtifact,
  AutonomousGenerationRequest,
} from "./contracts";

export class AutonomousArtifactGenerator {
  generate(
    request: AutonomousGenerationRequest,
  ): AutonomousGeneratedArtifact[] {
    const artifacts:
      AutonomousGeneratedArtifact[] = [];

    for (const requirement of request.requirements) {
      const base =
        this.normalize(
          requirement.key,
        );

      artifacts.push(
        this.createArtifact(
          `${base}.service`,
          AutonomousArtifactKind.SERVICE,
          `src/${base}/${base}.service.ts`,
          this.serviceSource(
            base,
          ),
          requirement.dependencies,
        ),
      );

      artifacts.push(
        this.createArtifact(
          `${base}.controller`,
          AutonomousArtifactKind.CONTROLLER,
          `src/${base}/${base}.controller.ts`,
          this.controllerSource(
            base,
          ),
          [
            `${base}.service`,
          ],
        ),
      );

      artifacts.push(
        this.createArtifact(
          `${base}.module`,
          AutonomousArtifactKind.MODULE,
          `src/${base}/${base}.module.ts`,
          this.moduleSource(
            base,
          ),
          [
            `${base}.service`,
            `${base}.controller`,
          ],
        ),
      );

      artifacts.push(
        this.createArtifact(
          `${base}.spec`,
          AutonomousArtifactKind.TEST,
          `src/${base}/${base}.service.spec.ts`,
          this.testSource(
            base,
          ),
          [
            `${base}.service`,
          ],
        ),
      );
    }

    return artifacts;
  }

  private createArtifact(
    key: string,
    kind: AutonomousArtifactKind,
    relativePath: string,
    content: string,
    dependencies: string[],
  ): AutonomousGeneratedArtifact {
    return {
      key,
      kind,
      relativePath,
      content,
      dependencies: [
        ...dependencies,
      ],
      checksum:
        createHash("sha256")
          .update(content)
          .digest("hex"),
      metadata: {},
    };
  }

  private normalize(
    value: string,
  ): string {
    return value
      .trim()
      .replace(
        /([a-z0-9])([A-Z])/g,
        "$1-$2",
      )
      .replace(
        /[^a-zA-Z0-9]+/g,
        "-",
      )
      .replace(
        /^-+|-+$/g,
        "",
      )
      .toLowerCase();
  }

  private className(
    value: string,
  ): string {
    return value
      .split("-")
      .filter(Boolean)
      .map(
        (part) =>
          part.charAt(0).toUpperCase() +
          part.slice(1),
      )
      .join("");
  }

  private serviceSource(
    base: string,
  ): string {
    const name =
      this.className(base);

    return [
      'import { Injectable } from "@nestjs/common";',
      "",
      "@Injectable()",
      `export class ${name}Service {`,
      "  health() {",
      '    return { healthy: true };',
      "  }",
      "}",
      "",
    ].join("\n");
  }

  private controllerSource(
    base: string,
  ): string {
    const name =
      this.className(base);

    return [
      'import { Controller, Get } from "@nestjs/common";',
      `import { ${name}Service } from "./${base}.service";`,
      "",
      `@Controller("${base}")`,
      `export class ${name}Controller {`,
      `  constructor(private readonly service: ${name}Service) {}`,
      "",
      '  @Get("health")',
      "  health() {",
      "    return this.service.health();",
      "  }",
      "}",
      "",
    ].join("\n");
  }

  private moduleSource(
    base: string,
  ): string {
    const name =
      this.className(base);

    return [
      'import { Module } from "@nestjs/common";',
      `import { ${name}Controller } from "./${base}.controller";`,
      `import { ${name}Service } from "./${base}.service";`,
      "",
      "@Module({",
      `  controllers: [${name}Controller],`,
      `  providers: [${name}Service],`,
      `  exports: [${name}Service],`,
      "})",
      `export class ${name}Module {}`,
      "",
    ].join("\n");
  }

  private testSource(
    base: string,
  ): string {
    const name =
      this.className(base);

    return [
      `import { ${name}Service } from "./${base}.service";`,
      "",
      `describe("${name}Service", () => {`,
      '  it("returns a healthy status", () => {',
      `    const service = new ${name}Service();`,
      "    expect(service.health()).toEqual({ healthy: true });",
      "  });",
      "});",
      "",
    ].join("\n");
  }
}
