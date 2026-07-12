import {
  V4BackendArtifact,
  V4BackendDomain,
} from "./contracts";
import { backendKebab, backendPascal } from "./name-utils";

export class V4ModuleGenerator {
  generate(domain: V4BackendDomain): V4BackendArtifact {
    const key = backendKebab(domain.key);
    const entity = backendPascal(domain.entityName);

    return {
      relativePath: `apps/api/src/${key}/${key}.module.ts`,
      kind: "module",
      content: `import { Module } from "@nestjs/common";
import { ${entity}Controller } from "./${key}.controller";
import { ${entity}Service } from "./${key}.service";
import {
  Prisma${entity}Repository,
} from "./repositories/prisma-${key}.repository";

@Module({
  controllers: [${entity}Controller],
  providers: [
    ${entity}Service,
    {
      provide: "${entity}Repository",
      useClass: Prisma${entity}Repository,
    },
  ],
  exports: [${entity}Service],
})
export class ${entity}Module {}
`,
      metadata: { domain: domain.key },
    };
  }
}
