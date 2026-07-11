"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnterpriseModuleV2Generator = void 0;
const codegen_generator_contracts_1 = require("../codegen-generator.contracts");
const codegen_filesystem_contracts_1 = require("../../filesystem/codegen-filesystem.contracts");
function requireString(context, key) {
    const value = context.variables[key];
    if (typeof value !== "string" ||
        !value.trim()) {
        throw new Error(`Generator variable is required: ${key}`);
    }
    return value.trim();
}
function toWords(value) {
    return value
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[^A-Za-z0-9]+/g, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
}
function toPascalCase(value) {
    return toWords(value)
        .map((word) => word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase())
        .join("");
}
function toCamelCase(value) {
    const pascal = toPascalCase(value);
    return pascal
        ? pascal.charAt(0).toLowerCase() +
            pascal.slice(1)
        : "";
}
function toKebabCase(value) {
    return toWords(value)
        .map((word) => word.toLowerCase())
        .join("-");
}
function readBoolean(context, key, defaultValue) {
    const value = context.variables[key];
    return typeof value === "boolean"
        ? value
        : defaultValue;
}
function isJsonObject(value) {
    return Boolean(value &&
        typeof value === "object" &&
        !Array.isArray(value));
}
function readFields(context) {
    const value = context.variables["fields"];
    if (!Array.isArray(value)) {
        return [
            {
                name: "name",
                type: "string",
                required: true,
                maxLength: 300,
            },
        ];
    }
    const fields = [];
    for (const item of value) {
        if (!isJsonObject(item)) {
            continue;
        }
        const rawName = item["name"];
        const rawType = item["type"];
        const rawRequired = item["required"];
        const rawUnique = item["unique"];
        const rawMaxLength = item["maxLength"];
        if (typeof rawName !==
            "string" ||
            !rawName.trim()) {
            continue;
        }
        const allowedTypes = [
            "string",
            "number",
            "boolean",
            "date",
            "json",
        ];
        const fieldType = typeof rawType ===
            "string" &&
            allowedTypes.includes(rawType)
            ? rawType
            : "string";
        fields.push({
            name: rawName.trim(),
            type: fieldType,
            required: typeof rawRequired ===
                "boolean"
                ? rawRequired
                : false,
            ...(typeof rawUnique ===
                "boolean"
                ? {
                    unique: rawUnique,
                }
                : {}),
            ...(typeof rawMaxLength ===
                "number" &&
                Number.isFinite(rawMaxLength)
                ? {
                    maxLength: rawMaxLength,
                }
                : {}),
        });
    }
    return fields;
}
function renderDtoProperty(field) {
    const propertyName = toCamelCase(field.name);
    const optionalDecorator = field.required
        ? ""
        : "  @IsOptional()\n";
    const optionalMark = field.required
        ? "!"
        : "?";
    switch (field.type) {
        case "number":
            return `${optionalDecorator}  @IsNumber()
  ${propertyName}${optionalMark}: number;`;
        case "boolean":
            return `${optionalDecorator}  @IsBoolean()
  ${propertyName}${optionalMark}: boolean;`;
        case "date":
            return `${optionalDecorator}  @IsISO8601()
  ${propertyName}${optionalMark}: string;`;
        case "json":
            return `${optionalDecorator}  @IsObject()
  ${propertyName}${optionalMark}: Record<string, unknown>;`;
        case "string":
        default: {
            const maxLength = field.maxLength
                ? `  @MaxLength(${field.maxLength})\n`
                : "";
            return `${optionalDecorator}  @IsString()
${maxLength}  ${propertyName}${optionalMark}: string;`;
        }
    }
}
class EnterpriseModuleV2Generator {
    descriptor = {
        key: "enterprise-module-v2",
        name: "Enterprise Module Generator V2",
        description: "Generates a production NestJS module with controller, service, DTOs, tests, and manifest",
        version: {
            major: 2,
            minor: 0,
            patch: 0,
            prerelease: "alpha.1",
        },
        status: codegen_generator_contracts_1.CodeGenGeneratorStatus.ACTIVE,
        capabilities: [
            "nestjs-module",
            "controller",
            "service",
            "create-dto",
            "update-dto",
            "tests",
            "manifest",
            "barrel-export",
        ],
        metadata: {
            owner: "AVOS",
            classification: "production-generator",
        },
    };
    generate(context) {
        const moduleName = requireString(context, "moduleName");
        const routeName = typeof context.variables["routeName"] === "string"
            ? String(context.variables["routeName"])
            : toKebabCase(moduleName);
        const entityName = typeof context.variables["entityName"] === "string"
            ? String(context.variables["entityName"])
            : moduleName;
        const pascalName = toPascalCase(moduleName);
        const entityPascal = toPascalCase(entityName);
        const kebabName = toKebabCase(moduleName);
        const basePath = `src/${kebabName}`;
        const fields = readFields(context);
        const includeController = readBoolean(context, "includeController", true);
        const includeService = readBoolean(context, "includeService", true);
        const includeDtos = readBoolean(context, "includeDtos", true);
        const includeTests = readBoolean(context, "includeTests", true);
        const includeManifest = readBoolean(context, "includeManifest", true);
        const files = [];
        files.push({
            relativePath: `${basePath}/${kebabName}.module.ts`,
            mode: codegen_filesystem_contracts_1.CodeGenWriteMode.CREATE,
            content: `import { Module } from "@nestjs/common";
${includeController ? `import { ${pascalName}Controller } from "./${kebabName}.controller";\n` : ""}${includeService ? `import { ${pascalName}Service } from "./${kebabName}.service";\n` : ""}
@Module({
  controllers: [${includeController ? `${pascalName}Controller` : ""}],
  providers: [${includeService ? `${pascalName}Service` : ""}],
  exports: [${includeService ? `${pascalName}Service` : ""}],
})
export class ${pascalName}Module {}
`,
        });
        if (includeService) {
            files.push({
                relativePath: `${basePath}/${kebabName}.service.ts`,
                mode: codegen_filesystem_contracts_1.CodeGenWriteMode.CREATE,
                content: `import { Injectable, NotFoundException } from "@nestjs/common";

export interface ${entityPascal}Record {
  id: string;
  createdAt: string;
  updatedAt: string;
  payload: Record<string, unknown>;
}

@Injectable()
export class ${pascalName}Service {
  private readonly records =
    new Map<string, ${entityPascal}Record>();

  list(): ${entityPascal}Record[] {
    return Array.from(
      this.records.values(),
    ).sort((left, right) =>
      right.createdAt.localeCompare(
        left.createdAt,
      ),
    );
  }

  get(id: string): ${entityPascal}Record {
    const record =
      this.records.get(id);

    if (!record) {
      throw new NotFoundException(
        "${entityPascal} record was not found",
      );
    }

    return record;
  }

  create(
    payload: Record<string, unknown>,
  ): ${entityPascal}Record {
    const now =
      new Date().toISOString();

    const id =
      crypto.randomUUID();

    const record:
      ${entityPascal}Record = {
      id,
      createdAt: now,
      updatedAt: now,
      payload,
    };

    this.records.set(id, record);

    return record;
  }

  remove(id: string):
    ${entityPascal}Record {
    const record =
      this.get(id);

    this.records.delete(id);

    return record;
  }

  status() {
    return {
      success: true,
      module:
        "${kebabName}",
      records:
        this.records.size,
      checkedAt:
        new Date().toISOString(),
    };
  }
}
`,
            });
        }
        if (includeController) {
            files.push({
                relativePath: `${basePath}/${kebabName}.controller.ts`,
                mode: codegen_filesystem_contracts_1.CodeGenWriteMode.CREATE,
                content: `import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ${pascalName}Service } from "./${kebabName}.service";
${includeDtos ? `import { Create${entityPascal}Dto } from "./dto/create-${kebabName}.dto";\n` : ""}
@Controller("${routeName}")
export class ${pascalName}Controller {
  constructor(
    private readonly service:
      ${pascalName}Service,
  ) {}

  @Get()
  list() {
    return this.service.list();
  }

  @Get("status")
  status() {
    return this.service.status();
  }

  @Get(":id")
  get(
    @Param("id") id: string,
  ) {
    return this.service.get(id);
  }

  @Post()
  create(
    @Body() body: ${includeDtos ? `Create${entityPascal}Dto` : "Record<string, unknown>"},
  ) {
    return this.service.create(
      body as unknown as
        Record<string, unknown>,
    );
  }

  @Delete(":id")
  remove(
    @Param("id") id: string,
  ) {
    return this.service.remove(id);
  }
}
`,
            });
        }
        if (includeDtos) {
            const dtoProperties = fields
                .map((field) => renderDtoProperty(field))
                .join("\n\n");
            files.push({
                relativePath: `${basePath}/dto/create-${kebabName}.dto.ts`,
                mode: codegen_filesystem_contracts_1.CodeGenWriteMode.CREATE,
                content: `import {
  IsBoolean,
  IsISO8601,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class Create${entityPascal}Dto {
${dtoProperties}
}
`,
            });
            files.push({
                relativePath: `${basePath}/dto/update-${kebabName}.dto.ts`,
                mode: codegen_filesystem_contracts_1.CodeGenWriteMode.CREATE,
                content: `import { PartialType } from "@nestjs/mapped-types";
import { Create${entityPascal}Dto } from "./create-${kebabName}.dto";

export class Update${entityPascal}Dto
  extends PartialType(
    Create${entityPascal}Dto,
  ) {}
`,
            });
        }
        if (includeManifest) {
            files.push({
                relativePath: `${basePath}/${kebabName}.manifest.ts`,
                mode: codegen_filesystem_contracts_1.CodeGenWriteMode.CREATE,
                content: `export const ${toWords(moduleName)
                    .map((word) => word.toUpperCase())
                    .join("_")}_MANIFEST = {
  key:
    "${kebabName}",
  name:
    "${pascalName}",
  version:
    "2.0.0-alpha.1",
  route:
    "${routeName}",
  generatedBy:
    "AVOS CodeGen OS",
  capabilities: [
    "controller",
    "service",
    "dto",
    "tests",
  ],
} as const;
`,
            });
        }
        if (includeTests) {
            files.push({
                relativePath: `${basePath}/${kebabName}.service.spec.ts`,
                mode: codegen_filesystem_contracts_1.CodeGenWriteMode.CREATE,
                content: `import { ${pascalName}Service } from "./${kebabName}.service";

describe("${pascalName}Service", () => {
  it("returns healthy status", () => {
    const service =
      new ${pascalName}Service();

    const status =
      service.status();

    expect(status.success)
      .toBe(true);

    expect(status.module)
      .toBe("${kebabName}");
  });
});
`,
            });
        }
        const exportLines = [
            `export * from "./${kebabName}.module";`,
            ...(includeController
                ? [
                    `export * from "./${kebabName}.controller";`,
                ]
                : []),
            ...(includeService
                ? [
                    `export * from "./${kebabName}.service";`,
                ]
                : []),
            ...(includeManifest
                ? [
                    `export * from "./${kebabName}.manifest";`,
                ]
                : []),
            ...(includeDtos
                ? [
                    `export * from "./dto/create-${kebabName}.dto";`,
                    `export * from "./dto/update-${kebabName}.dto";`,
                ]
                : []),
        ];
        files.push({
            relativePath: `${basePath}/index.ts`,
            mode: codegen_filesystem_contracts_1.CodeGenWriteMode.CREATE,
            content: `${exportLines.join("\n")}\n`,
        });
        return {
            generatorKey: this.descriptor.key,
            success: true,
            files,
            warnings: fields.length === 0
                ? [
                    "No DTO fields were configured",
                ]
                : [],
            generatedAt: new Date().toISOString(),
        };
    }
}
exports.EnterpriseModuleV2Generator = EnterpriseModuleV2Generator;
//# sourceMappingURL=enterprise-module-v2.generator.js.map