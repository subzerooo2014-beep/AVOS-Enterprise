import {
  V4BackendArtifact,
  V4BackendDomain,
} from "./contracts";
import {
  backendCamel,
  backendKebab,
  backendPascal,
} from "./name-utils";

export class V4RepositoryGenerator {
  generate(domain: V4BackendDomain): V4BackendArtifact[] {
    const key = backendKebab(domain.key);
    const entity = backendPascal(domain.entityName);
    const camel = backendCamel(domain.entityName);

    const contract = `import {
  Create${entity}Dto,
} from "../dto/create-${key}.dto";
import {
  Update${entity}Dto,
} from "../dto/update-${key}.dto";

export interface ${entity}Record
  extends Create${entity}Dto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ${entity}Repository {
  create(input: Create${entity}Dto): Promise<${entity}Record>;
  findMany(): Promise<${entity}Record[]>;
  findById(id: string): Promise<${entity}Record | null>;
  update(
    id: string,
    input: Update${entity}Dto,
  ): Promise<${entity}Record>;
  softDelete(id: string): Promise<void>;
}
`;

    const prismaRepository = `import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  Create${entity}Dto,
} from "../dto/create-${key}.dto";
import {
  Update${entity}Dto,
} from "../dto/update-${key}.dto";
import {
  ${entity}Record,
  ${entity}Repository,
} from "./${key}.repository";

@Injectable()
export class Prisma${entity}Repository
  implements ${entity}Repository {
  constructor(private readonly prisma: PrismaService) {}

  create(input: Create${entity}Dto) {
    return (this.prisma as any).${camel}.create({
      data: input,
    });
  }

  findMany() {
    return (this.prisma as any).${camel}.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
  }

  findById(id: string) {
    return (this.prisma as any).${camel}.findFirst({
      where: { id, deletedAt: null },
    });
  }

  update(id: string, input: Update${entity}Dto) {
    return (this.prisma as any).${camel}.update({
      where: { id },
      data: input,
    });
  }

  async softDelete(id: string): Promise<void> {
    await (this.prisma as any).${camel}.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
`;

    return [
      {
        relativePath: `apps/api/src/${key}/repositories/${key}.repository.ts`,
        kind: "repository",
        content: contract,
        metadata: { domain: domain.key, repository: "contract" },
      },
      {
        relativePath: `apps/api/src/${key}/repositories/prisma-${key}.repository.ts`,
        kind: "repository",
        content: prismaRepository,
        metadata: { domain: domain.key, repository: "prisma" },
      },
    ];
  }
}
