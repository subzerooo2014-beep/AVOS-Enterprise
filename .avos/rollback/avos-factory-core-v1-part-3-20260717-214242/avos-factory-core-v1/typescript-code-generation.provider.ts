import { Injectable } from "@nestjs/common";
import {
  CodeGenerationProvider,
  CodeGenerationProviderContext,
  CodeGenerationProviderResult
} from "./code-generation.contracts";

@Injectable()
export class TypeScriptCodeGenerationProvider
  implements CodeGenerationProvider {
  readonly id =
    "avos.typescript-code-generator";

  readonly name =
    "AVOS TypeScript Code Generator";

  readonly version = "1.0.0";

  readonly supportedTargets = [
    "typescript",
    "nestjs-service",
    "nestjs-controller",
    "nestjs-module"
  ];

  supports(target: string): boolean {
    return this.supportedTargets.includes(
      target
    );
  }

  generate(
    context: CodeGenerationProviderContext
  ): CodeGenerationProviderResult {
    const artifactName =
      this.toFileName(
        this.readString(
          context.input.name,
          context.stepId
        )
      );

    const className =
      this.toClassName(
        this.readString(
          context.input.className,
          context.input.name ??
          context.stepId
        )
      );

    switch (context.target) {
      case "nestjs-service":
        return {
          success: true,
          artifacts: [{
            path:
              `${artifactName}.service.ts`,
            type: "typescript",
            content:
              this.createService(
                className
              )
          }]
        };

      case "nestjs-controller":
        return {
          success: true,
          artifacts: [{
            path:
              `${artifactName}.controller.ts`,
            type: "typescript",
            content:
              this.createController(
                className,
                artifactName
              )
          }]
        };

      case "nestjs-module":
        return {
          success: true,
          artifacts: [{
            path:
              `${artifactName}.module.ts`,
            type: "typescript",
            content:
              this.createModule(
                className
              )
          }]
        };

      case "typescript":
        return {
          success: true,
          artifacts: [{
            path:
              `${artifactName}.ts`,
            type: "typescript",
            content:
              this.createTypeScriptFile(
                className,
                context
              )
          }]
        };

      default:
        return {
          success: false,
          artifacts: [],
          warnings: [
            `Unsupported TypeScript target: ${context.target}`
          ]
        };
    }
  }

  private createService(
    className: string
  ): string {
    return [
      'import { Injectable } from "@nestjs/common";',
      "",
      "@Injectable()",
      `export class ${className}Service {`,
      "  getStatus() {",
      "    return {",
      '      healthy: true,',
      `      service: "${className}Service"`,
      "    };",
      "  }",
      "}",
      ""
    ].join("\n");
  }

  private createController(
    className: string,
    route: string
  ): string {
    return [
      'import { Controller, Get } from "@nestjs/common";',
      "",
      `@Controller("${route}")`,
      `export class ${className}Controller {`,
      '  @Get("status")',
      "  getStatus() {",
      "    return {",
      "      healthy: true",
      "    };",
      "  }",
      "}",
      ""
    ].join("\n");
  }

  private createModule(
    className: string
  ): string {
    return [
      'import { Module } from "@nestjs/common";',
      "",
      "@Module({})",
      `export class ${className}Module {}`,
      ""
    ].join("\n");
  }

  private createTypeScriptFile(
    className: string,
    context: CodeGenerationProviderContext
  ): string {
    return [
      `export interface ${className}Configuration {`,
      "  enabled: boolean;",
      "}",
      "",
      `export class ${className} {`,
      `  readonly blueprintId = "${context.blueprintId}";`,
      `  readonly blueprintVersion = "${context.blueprintVersion}";`,
      `  readonly stepId = "${context.stepId}";`,
      "",
      "  getStatus() {",
      "    return {",
      "      enabled: true,",
      "      blueprintId: this.blueprintId,",
      "      blueprintVersion: this.blueprintVersion,",
      "      stepId: this.stepId",
      "    };",
      "  }",
      "}",
      ""
    ].join("\n");
  }

  private readString(
    value: unknown,
    fallback: unknown
  ): string {
    if (
      typeof value === "string" &&
      value.trim().length > 0
    ) {
      return value;
    }

    if (
      typeof fallback === "string" &&
      fallback.trim().length > 0
    ) {
      return fallback;
    }

    return "generated-artifact";
  }

  private toFileName(
    value: string
  ): string {
    return value
      .trim()
      .replace(
        /([a-z0-9])([A-Z])/g,
        "$1-$2"
      )
      .replace(
        /[^A-Za-z0-9]+/g,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        ""
      )
      .toLowerCase() ||
      "generated-artifact";
  }

  private toClassName(
    value: string
  ): string {
    const words =
      value
        .trim()
        .replace(
          /([a-z0-9])([A-Z])/g,
          "$1 $2"
        )
        .split(
          /[^A-Za-z0-9]+/
        )
        .filter(Boolean);

    const result =
      words
        .map(
          (word) =>
            word.charAt(0).toUpperCase() +
            word.slice(1)
        )
        .join("");

    return result ||
      "GeneratedArtifact";
  }
}
