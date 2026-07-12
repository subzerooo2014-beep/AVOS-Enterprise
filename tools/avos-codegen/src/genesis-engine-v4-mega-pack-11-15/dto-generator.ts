import {
  V4BackendArtifact,
  V4BackendDomain,
} from "./contracts";
import { backendKebab, backendPascal } from "./name-utils";

export class V4DtoGenerator {
  generate(domain: V4BackendDomain): V4BackendArtifact[] {
    const key = backendKebab(domain.key);
    const entity = backendPascal(domain.entityName);

    const imports = new Set<string>();
    const createFields = domain.fields
      .map((field) => {
        if (field.required) imports.add("IsNotEmpty");
        if (!field.required) imports.add("IsOptional");

        const validator =
          field.type === "number"
            ? "IsNumber"
            : field.type === "boolean"
              ? "IsBoolean"
              : field.type === "date"
                ? "IsISO8601"
                : "IsString";

        imports.add(validator);

        const lines = [
          field.required ? "@IsNotEmpty()" : "@IsOptional()",
          `@${validator}()`,
          `${field.name}${field.required ? "" : "?"}: ${
            field.type === "number"
              ? "number"
              : field.type === "boolean"
                ? "boolean"
                : "string"
          };`,
        ];

        return `  ${lines.join("\n  ")}`;
      })
      .join("\n\n");

    const createDto = `import { ${Array.from(imports)
      .sort()
      .join(", ")} } from "class-validator";

export class Create${entity}Dto {
${createFields}
}
`;

    const updateDto = `import { PartialType } from "@nestjs/mapped-types";
import { Create${entity}Dto } from "./create-${key}.dto";

export class Update${entity}Dto extends PartialType(
  Create${entity}Dto,
) {}
`;

    return [
      {
        relativePath: `apps/api/src/${key}/dto/create-${key}.dto.ts`,
        kind: "dto",
        content: createDto,
        metadata: { domain: domain.key, dto: "create" },
      },
      {
        relativePath: `apps/api/src/${key}/dto/update-${key}.dto.ts`,
        kind: "dto",
        content: updateDto,
        metadata: { domain: domain.key, dto: "update" },
      },
    ];
  }
}
