import {
  CodeGenArtifactDescriptor,
  CodeGenArtifactType,
} from "../../../artifacts/codegen-artifact.contracts";
import {
  CodeGenGeneratorV3RendererContext,
} from "../contracts/codegen-generator-v3.contracts";
import {
  CodeGenGeneratorV3ArtifactFactory,
} from "../runtime/codegen-generator-v3-artifact-factory";

export class CodeGenGeneratorV3PrismaAdapterRenderer {
  constructor(
    readonly artifacts =
      new CodeGenGeneratorV3ArtifactFactory(),
  ) {}

  render(
    context:
      CodeGenGeneratorV3RendererContext,
  ): CodeGenArtifactDescriptor[] {
    const {
      names,
    } = context;

    const basePath =
      `src/${names.kebabModule}`;

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
        id:
          `${names.kebabModule}:prisma-repository`,
        key:
          `${names.kebabModule}.repository.prisma`,
        type:
          CodeGenArtifactType.SOURCE,
        relativePath:
          `${basePath}/${names.kebabEntity}.repository.prisma.ts`,
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
