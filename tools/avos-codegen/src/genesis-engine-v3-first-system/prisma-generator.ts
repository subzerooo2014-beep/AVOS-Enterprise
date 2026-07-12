import {
  GenesisV3Artifact,
  GenesisV3ArtifactKind,
  GenesisV3Domain,
} from "./contracts";
import { GenesisV3ArtifactFactory } from "./artifact-factory";
import { pascal } from "./name-utils";

export class GenesisV3PrismaGenerator {
  constructor(readonly factory = new GenesisV3ArtifactFactory()) {}

  generate(
    domains: readonly GenesisV3Domain[],
    provider: "postgresql" | "mysql" | "sqlite",
  ): GenesisV3Artifact {
    const models = domains
      .map((domain) => {
        const fields = domain.fields
          .map((field) => {
            const prismaType =
              field.type === "number"
                ? "Float"
                : field.type === "boolean"
                  ? "Boolean"
                  : field.type === "date"
                    ? "DateTime"
                    : "String";

            const optional = field.required ? "" : "?";
            const unique = field.unique ? " @unique" : "";

            return `  ${field.name} ${prismaType}${optional}${unique}`;
          })
          .join("\n");

        return `model ${pascal(domain.entityName)} {
  id        String   @id @default(cuid())
${fields}
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`;
      })
      .join("\n\n");

    return this.factory.create(
      "apps/api/prisma/schema.prisma",
      GenesisV3ArtifactKind.PRISMA,
      `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${provider}"
  url      = env("DATABASE_URL")
}

${models}`,
      { models: domains.length, provider },
    );
  }
}
