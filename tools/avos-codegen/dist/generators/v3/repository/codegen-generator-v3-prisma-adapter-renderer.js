"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGeneratorV3PrismaAdapterRenderer = void 0;
const codegen_artifact_contracts_1 = require("../../../artifacts/codegen-artifact.contracts");
const codegen_generator_v3_artifact_factory_1 = require("../runtime/codegen-generator-v3-artifact-factory");
class CodeGenGeneratorV3PrismaAdapterRenderer {
    artifacts;
    constructor(artifacts = new codegen_generator_v3_artifact_factory_1.CodeGenGeneratorV3ArtifactFactory()) {
        this.artifacts = artifacts;
    }
    render(context) {
        const { names, } = context;
        const basePath = `src/${names.kebabModule}`;
        const content = `import {
  ${names.pascalEntity}Repository,
  ${names.pascalEntity}RepositoryRecord,
} from "./${names.kebabEntity}.repository";

export interface ${names.pascalEntity}PrismaDelegate {
  findMany(args?: unknown): Promise<unknown[]>;
  count(args?: unknown): Promise<number>;
  findUnique(args: unknown): Promise<unknown | null>;
  create(args: unknown): Promise<unknown>;
  update(args: unknown): Promise<unknown>;
  delete(args: unknown): Promise<unknown>;
}

export class Prisma${names.pascalEntity}Repository
  implements ${names.pascalEntity}Repository {
  constructor(
    private readonly delegate:
      ${names.pascalEntity}PrismaDelegate,
  ) {}

  async list(
    input: {
      page?: number;
      pageSize?: number;
      search?: string;
      sortBy?: string;
      sortDirection?: "asc" | "desc";
    } = {},
  ) {
    const page =
      Math.max(
        1,
        input.page ?? 1,
      );

    const pageSize =
      Math.max(
        1,
        Math.min(
          100,
          input.pageSize ?? 20,
        ),
      );

    const where =
      input.search
        ? {
            OR: [
              {
                name: {
                  contains:
                    input.search,
                  mode:
                    "insensitive",
                },
              },
            ],
          }
        : undefined;

    const [items, total] =
      await Promise.all([
        this.delegate.findMany({
          where,
          skip:
            (page - 1) *
            pageSize,
          take:
            pageSize,
          orderBy: {
            [input.sortBy ?? "updatedAt"]:
              input.sortDirection ??
              "desc",
          },
        }),
        this.delegate.count({
          where,
        }),
      ]);

    return {
      items:
        items as
          ${names.pascalEntity}RepositoryRecord[],
      total,
      page,
      pageSize,
    };
  }

  async get(
    id: string,
  ) {
    return await this.delegate.findUnique({
      where: {
        id,
      },
    }) as
      ${names.pascalEntity}RepositoryRecord |
      null;
  }

  async create(
    payload:
      Record<string, unknown>,
  ) {
    return await this.delegate.create({
      data:
        payload,
    }) as
      ${names.pascalEntity}RepositoryRecord;
  }

  async update(
    id: string,
    payload:
      Record<string, unknown>,
  ) {
    return await this.delegate.update({
      where: {
        id,
      },
      data:
        payload,
    }) as
      ${names.pascalEntity}RepositoryRecord;
  }

  async remove(
    id: string,
  ) {
    return await this.delegate.delete({
      where: {
        id,
      },
    }) as
      ${names.pascalEntity}RepositoryRecord;
  }
}
`;
        return [
            this.artifacts.create({
                id: `${names.kebabModule}:prisma-repository`,
                key: `${names.kebabModule}.repository.prisma`,
                type: codegen_artifact_contracts_1.CodeGenArtifactType.SOURCE,
                relativePath: `${basePath}/${names.kebabEntity}.repository.prisma.ts`,
                content,
                dependencies: [
                    `${names.kebabModule}.repository.contract`,
                    `${names.kebabModule}.prisma`,
                ],
                tags: [
                    "repository",
                    "prisma",
                    "adapter",
                    "generator-v3",
                ],
            }),
        ];
    }
}
exports.CodeGenGeneratorV3PrismaAdapterRenderer = CodeGenGeneratorV3PrismaAdapterRenderer;
//# sourceMappingURL=codegen-generator-v3-prisma-adapter-renderer.js.map