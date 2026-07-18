import { Injectable } from "@nestjs/common";

export interface NestjsModuleComposition {
  moduleFile: string;
  serviceFile: string;
  moduleClassName: string;
  serviceClassName: string;
}

@Injectable()
export class NestjsModuleComposerService {
  compose(
    className: string,
    slug: string
  ): NestjsModuleComposition {
    const serviceClassName = `${className}Service`;
    const moduleClassName = `${className}Module`;

    const serviceFile = [
      'import { Injectable } from "@nestjs/common";',
      "",
      "@Injectable()",
      `export class ${serviceClassName} {`,
      "  execute(payload: Record<string, unknown>) {",
      "    return {",
      "      success: true,",
      "      payload,",
      "      generatedAt: new Date().toISOString()",
      "    };",
      "  }",
      "",
      "  health() {",
      "    return {",
      '      status: "healthy",',
      "      score: 100,",
      "      generatedCapability: true",
      "    };",
      "  }",
      "}"
    ].join("\n");

    const moduleFile = [
      'import { Module } from "@nestjs/common";',
      `import { ${serviceClassName} } from "./${slug}.service";`,
      "",
      "@Module({",
      `  providers: [${serviceClassName}],`,
      `  exports: [${serviceClassName}]`,
      "})",
      `export class ${moduleClassName} {}`
    ].join("\n");

    return {
      moduleFile,
      serviceFile,
      moduleClassName,
      serviceClassName
    };
  }
}
