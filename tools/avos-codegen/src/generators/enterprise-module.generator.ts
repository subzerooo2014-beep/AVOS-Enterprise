import {
  CodeGenGenerator,
  CodeGenGeneratorContext,
  CodeGenGeneratorDescriptor,
  CodeGenGeneratorResult,
  CodeGenGeneratorStatus,
} from "./codegen-generator.contracts";
import {
  CodeGenWriteMode,
} from "../filesystem/codegen-filesystem.contracts";

function requireString(
  context: CodeGenGeneratorContext,
  key: string,
): string {
  const value = context.variables[key];

  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    throw new Error(
      `Generator variable is required: ${key}`,
    );
  }

  return value.trim();
}

function toKebabCase(
  value: string,
): string {
  return value
    .replace(
      /([a-z0-9])([A-Z])/g,
      "$1-$2",
    )
    .replace(
      /[^A-Za-z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    )
    .toLowerCase();
}

function toPascalCase(
  value: string,
): string {
  return value
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1).toLowerCase(),
    )
    .join("");
}

export class EnterpriseModuleGenerator
  implements CodeGenGenerator {
  readonly descriptor:
    CodeGenGeneratorDescriptor = {
    key: "enterprise-module",
    name: "Enterprise Module Generator",
    description:
      "Generates a production-ready AVOS NestJS module foundation",
    version: {
      major: 1,
      minor: 0,
      patch: 0,
      prerelease: "alpha.1",
    },
    status:
      CodeGenGeneratorStatus.ACTIVE,
    capabilities: [
      "nestjs-module",
      "controller",
      "service",
      "dto",
      "manifest",
    ],
    metadata: {
      owner: "AVOS",
    },
  };

  generate(
    context: CodeGenGeneratorContext,
  ): CodeGenGeneratorResult {
    const rawName =
      requireString(
        context,
        "moduleName",
      );

    const kebabName =
      toKebabCase(rawName);

    const pascalName =
      toPascalCase(rawName);

    const basePath =
      `src/${kebabName}`;

    const files = [
      {
        relativePath:
          `${basePath}/${kebabName}.module.ts`,
        mode: CodeGenWriteMode.CREATE,
        content: `import { Module } from "@nestjs/common";
import { ${pascalName}Controller } from "./${kebabName}.controller";
import { ${pascalName}Service } from "./${kebabName}.service";

@Module({
  controllers: [${pascalName}Controller],
  providers: [${pascalName}Service],
  exports: [${pascalName}Service],
})
export class ${pascalName}Module {}
`,
      },
      {
        relativePath:
          `${basePath}/${kebabName}.controller.ts`,
        mode: CodeGenWriteMode.CREATE,
        content: `import { Controller, Get } from "@nestjs/common";
import { ${pascalName}Service } from "./${kebabName}.service";

@Controller("${kebabName}")
export class ${pascalName}Controller {
  constructor(
    private readonly service: ${pascalName}Service,
  ) {}

  @Get("status")
  status() {
    return this.service.status();
  }
}
`,
      },
      {
        relativePath:
          `${basePath}/${kebabName}.service.ts`,
        mode: CodeGenWriteMode.CREATE,
        content: `import { Injectable } from "@nestjs/common";

@Injectable()
export class ${pascalName}Service {
  status() {
    return {
      success: true,
      module: "${pascalName}",
      status: "ready",
      checkedAt: new Date().toISOString(),
    };
  }
}
`,
      },
      {
        relativePath:
          `${basePath}/dto/create-${kebabName}.dto.ts`,
        mode: CodeGenWriteMode.CREATE,
        content: `import { IsObject, IsOptional, IsString, MaxLength } from "class-validator";

export class Create${pascalName}Dto {
  @IsString()
  @MaxLength(300)
  name!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
`,
      },
      {
        relativePath:
          `${basePath}/${kebabName}.manifest.ts`,
        mode: CodeGenWriteMode.CREATE,
        content: `export const ${pascalName.toUpperCase()}_MANIFEST = {
  key: "${kebabName}",
  name: "${pascalName}",
  version: "1.0.0",
  generatedBy: "AVOS CodeGen OS",
} as const;
`,
      },
      {
        relativePath:
          `${basePath}/index.ts`,
        mode: CodeGenWriteMode.CREATE,
        content: `export * from "./${kebabName}.module";
export * from "./${kebabName}.controller";
export * from "./${kebabName}.service";
export * from "./${kebabName}.manifest";
export * from "./dto/create-${kebabName}.dto";
`,
      },
    ];

    return {
      generatorKey:
        this.descriptor.key,
      success: true,
      files,
      warnings: [],
      generatedAt:
        new Date().toISOString(),
    };
  }
}

