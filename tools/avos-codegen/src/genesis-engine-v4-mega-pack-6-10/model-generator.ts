import {
  V4DatabaseDomain,
  V4DatabaseInput,
  V4DatabaseModel,
} from "./contracts";
import { v4Camel, v4Pascal } from "./name-utils";

export class V4PrismaModelGenerator {
  generate(input: V4DatabaseInput): V4DatabaseModel[] {
    return input.domains.map((domain) =>
      this.generateModel(domain, input),
    );
  }

  private generateModel(
    domain: V4DatabaseDomain,
    input: V4DatabaseInput,
  ): V4DatabaseModel {
    const fields = [
      "id String @id @default(cuid())",
      ...domain.fields.map((field) => {
        const prismaType =
          field.type === "number"
            ? "Decimal"
            : field.type === "boolean"
              ? "Boolean"
              : field.type === "date"
                ? "DateTime"
                : "String";

        const optional = field.required ? "" : "?";
        const unique = field.unique ? " @unique" : "";

        return `${field.name} ${prismaType}${optional}${unique}`;
      }),
    ];

    if (input.enableAuditFields !== false) {
      fields.push(
        "createdAt DateTime @default(now())",
        "updatedAt DateTime @updatedAt",
        "createdBy String?",
        "updatedBy String?",
      );
    }

    if (input.enableSoftDelete !== false) {
      fields.push(
        "deletedAt DateTime?",
        "deletedBy String?",
      );
    }

    const relations = input.relationships
      .filter((relationship) => relationship.sourceDomain === domain.key)
      .map((relationship) => {
        const target = input.domains.find(
          (item) => item.key === relationship.targetDomain,
        );

        if (!target) return "";

        const relationField = v4Camel(target.entityName);
        const relationType = v4Pascal(target.entityName);
        const foreignKey = relationship.inferredBy;

        return `${relationField} ${relationType} @relation(fields: [${foreignKey}], references: [id])`;
      })
      .filter(Boolean);

    const indexes = domain.fields
      .filter(
        (field) =>
          field.unique ||
          field.name.toLowerCase().endsWith("id") ||
          ["status", "createdat", "updatedat"].includes(
            field.name.toLowerCase(),
          ),
      )
      .map((field) => `@@index([${field.name}])`);

    const constraints = domain.fields
      .filter((field) => field.unique)
      .map((field) => `@@unique([${field.name}])`);

    return {
      name: v4Pascal(domain.entityName),
      domainKey: domain.key,
      fields,
      indexes,
      constraints,
      relations,
    };
  }
}
