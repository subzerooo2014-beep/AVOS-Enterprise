import {
  V4DatabaseInput,
  V4DatabaseModel,
} from "./contracts";

export class V4PrismaSchemaRenderer {
  render(
    input: V4DatabaseInput,
    models: readonly V4DatabaseModel[],
  ): string {
    const renderedModels = models
      .map(
        (model) => `model ${model.name} {
  ${[
    ...model.fields,
    ...model.relations,
    ...model.indexes,
    ...model.constraints,
  ].join("\n  ")}
}`,
      )
      .join("\n\n");

    return `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${input.provider}"
  url      = env("DATABASE_URL")
}

${renderedModels}
`;
  }
}
