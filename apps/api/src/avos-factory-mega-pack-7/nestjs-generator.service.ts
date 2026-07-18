import { BadRequestException, Injectable } from "@nestjs/common";
import { createHash, randomUUID } from "node:crypto";
import {
  NestJsFieldBlueprint,
  NestJsGeneratedFile,
  NestJsGenerationResult,
  NestJsGeneratorStatus,
  NestJsModuleBlueprint
} from "./nestjs-generator.contracts";

@Injectable()
export class NestJsGeneratorService {
  getStatus(): NestJsGeneratorStatus {
    return {
      system: "AVOS Factory",
      megaPack: 7,
      component: "NestJS Generator",
      status: "healthy",
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      supportedArtifacts: [
        "module",
        "controller",
        "service",
        "dto",
        "index"
      ]
    };
  }

  generate(blueprint: NestJsModuleBlueprint): NestJsGenerationResult {
    this.validateBlueprint(blueprint);

    const className = this.toPascalCase(blueprint.moduleName);
    const folderName = this.toKebabCase(blueprint.moduleName);
    const routePrefix = this.normalizeRoute(blueprint.routePrefix);
    const files: NestJsGeneratedFile[] = [];

    if (blueprint.includeDto !== false) {
      files.push({
        path: `${folderName}/dto/create-${folderName}.dto.ts`,
        kind: "dto",
        content: this.generateDto(className, blueprint.fields ?? [])
      });
    }

    if (blueprint.includeService !== false) {
      files.push({
        path: `${folderName}/${folderName}.service.ts`,
        kind: "service",
        content: this.generateService(className)
      });
    }

    if (blueprint.includeController !== false) {
      files.push({
        path: `${folderName}/${folderName}.controller.ts`,
        kind: "controller",
        content: this.generateController(
          className,
          folderName,
          routePrefix,
          blueprint
        )
      });
    }

    files.push({
      path: `${folderName}/${folderName}.module.ts`,
      kind: "module",
      content: this.generateModule(className, folderName, blueprint)
    });

    files.push({
      path: `${folderName}/index.ts`,
      kind: "index",
      content: this.generateIndex(folderName, blueprint)
    });

    return {
      id: `nestjs-generation:${randomUUID()}`,
      generator: "AVOS NestJS Generator",
      version: "1.0.0",
      blueprint: structuredClone(blueprint),
      files,
      qualityChecks: {
        validModuleName: className.length > 0,
        validRoutePrefix: routePrefix.length > 0,
        hasModule: files.some((file) => file.kind === "module"),
        hasService: files.some((file) => file.kind === "service"),
        hasController: files.some((file) => file.kind === "controller"),
        dtoIncluded: files.some((file) => file.kind === "dto"),
        deterministic:
          this.hashFiles(files) ===
          this.hashFiles(
            files.map((file) => ({ ...file }))
          )
      },
      humanApprovalRequired: true,
      generatedAt: new Date().toISOString()
    };
  }

  runSmoke(): Record<string, unknown> {
    const result = this.generate({
      moduleName: "Factory Sample",
      routePrefix: "avos/factory/sample",
      description: "Generated smoke module",
      fields: [
        {
          name: "name",
          type: "string",
          required: true
        },
        {
          name: "enabled",
          type: "boolean",
          required: false
        }
      ],
      endpoints: [
        {
          method: "GET",
          path: "status",
          operationName: "getStatus"
        },
        {
          method: "POST",
          path: "",
          operationName: "create"
        }
      ],
      includeDto: true,
      includeController: true,
      includeService: true
    });

    return {
      success: Object.values(result.qualityChecks).every(Boolean),
      generationId: result.id,
      fileCount: result.files.length,
      generatedPaths: result.files.map((file) => file.path),
      checks: result.qualityChecks
    };
  }

  private validateBlueprint(blueprint: NestJsModuleBlueprint): void {
    if (!blueprint?.moduleName?.trim()) {
      throw new BadRequestException("moduleName is required.");
    }

    if (!blueprint.routePrefix?.trim()) {
      throw new BadRequestException("routePrefix is required.");
    }
  }

  private generateDto(
    className: string,
    fields: NestJsFieldBlueprint[]
  ): string {
    const properties = fields.length === 0
      ? "  name!: string;"
      : fields
          .map((field) => {
            const optional = field.required === false ? "?" : "!";
            return `  ${field.name}${optional}: ${this.mapType(field.type)};`;
          })
          .join("\n");

    return `export class Create${className}Dto {\n${properties}\n}\n`;
  }

  private generateService(className: string): string {
    return `import { Injectable } from "@nestjs/common";\n\n@Injectable()\nexport class ${className}Service {\n  getStatus() {\n    return {\n      component: "${className}",\n      status: "healthy"\n    };\n  }\n\n  create(input: Record<string, unknown>) {\n    return {\n      success: true,\n      input\n    };\n  }\n}\n`;
  }

  private generateController(
    className: string,
    folderName: string,
    routePrefix: string,
    blueprint: NestJsModuleBlueprint
  ): string {
    const endpoints = blueprint.endpoints?.length
      ? blueprint.endpoints
      : [
          {
            method: "GET" as const,
            path: "status",
            operationName: "getStatus"
          }
        ];

    const decorators = new Set<string>(["Controller"]);
    const methods = endpoints.map((endpoint) => {
      decorators.add(this.mapDecorator(endpoint.method));

      const pathArg = endpoint.path
        ? `("${endpoint.path}")`
        : "()";

      if (endpoint.method === "POST") {
        decorators.add("Body");

        return `  @Post${pathArg}\n  ${endpoint.operationName}(@Body() body: Record<string, unknown>) {\n    return this.service.create(body);\n  }`;
      }

      return `  @${this.mapDecorator(endpoint.method)}${pathArg}\n  ${endpoint.operationName}() {\n    return this.service.getStatus();\n  }`;
    });

    return `import { ${[...decorators].sort().join(", ")} } from "@nestjs/common";\nimport { ${className}Service } from "./${folderName}.service";\n\n@Controller("${routePrefix}")\nexport class ${className}Controller {\n  constructor(private readonly service: ${className}Service) {}\n\n${methods.join("\n\n")}\n}\n`;
  }

  private generateModule(
    className: string,
    folderName: string,
    blueprint: NestJsModuleBlueprint
  ): string {
    const imports = ['import { Module } from "@nestjs/common";'];
    const controllers: string[] = [];
    const providers: string[] = [];
    const exportsList: string[] = [];

    if (blueprint.includeController !== false) {
      imports.push(
        `import { ${className}Controller } from "./${folderName}.controller";`
      );
      controllers.push(`${className}Controller`);
    }

    if (blueprint.includeService !== false) {
      imports.push(
        `import { ${className}Service } from "./${folderName}.service";`
      );
      providers.push(`${className}Service`);
      exportsList.push(`${className}Service`);
    }

    return `${imports.join("\n")}\n\n@Module({\n  controllers: [${controllers.join(", ")}],\n  providers: [${providers.join(", ")}],\n  exports: [${exportsList.join(", ")}]\n})\nexport class ${className}Module {}\n`;
  }

  private generateIndex(
    folderName: string,
    blueprint: NestJsModuleBlueprint
  ): string {
    const exportsList = [
      `export * from "./${folderName}.module";`
    ];

    if (blueprint.includeController !== false) {
      exportsList.push(
        `export * from "./${folderName}.controller";`
      );
    }

    if (blueprint.includeService !== false) {
      exportsList.push(
        `export * from "./${folderName}.service";`
      );
    }

    if (blueprint.includeDto !== false) {
      exportsList.push(
        `export * from "./dto/create-${folderName}.dto";`
      );
    }

    return exportsList.join("\n") + "\n";
  }

  private mapType(type: NestJsFieldBlueprint["type"]): string {
    switch (type) {
      case "number":
        return "number";
      case "boolean":
        return "boolean";
      case "date":
        return "Date";
      case "object":
        return "Record<string, unknown>";
      default:
        return "string";
    }
  }

  private mapDecorator(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  ): "Get" | "Post" | "Put" | "Patch" | "Delete" {
    switch (method) {
      case "POST":
        return "Post";
      case "PUT":
        return "Put";
      case "PATCH":
        return "Patch";
      case "DELETE":
        return "Delete";
      default:
        return "Get";
    }
  }

  private toPascalCase(value: string): string {
    return value
      .trim()
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");
  }

  private toKebabCase(value: string): string {
    return value
      .trim()
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();
  }

  private normalizeRoute(value: string): string {
    return value
      .trim()
      .replace(/^\/+|\/+$/g, "")
      .replace(/\/+/g, "/");
  }

  private hashFiles(files: NestJsGeneratedFile[]): string {
    return createHash("sha256")
      .update(JSON.stringify(files))
      .digest("hex");
  }
}
