"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGeneratorV3RepositoryRenderer = void 0;
const codegen_artifact_contracts_1 = require("../../../artifacts/codegen-artifact.contracts");
const codegen_generator_v3_artifact_factory_1 = require("../runtime/codegen-generator-v3-artifact-factory");
class CodeGenGeneratorV3RepositoryRenderer {
    artifacts;
    constructor(artifacts = new codegen_generator_v3_artifact_factory_1.CodeGenGeneratorV3ArtifactFactory()) {
        this.artifacts = artifacts;
    }
    render(context) {
        const { names, } = context;
        const basePath = `src/${names.kebabModule}`;
        const contractContent = `export interface ${names.pascalEntity}RepositoryRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  payload: Record<string, unknown>;
}

export interface ${names.pascalEntity}Repository {
  list(
    input?: {
      page?: number;
      pageSize?: number;
      search?: string;
      sortBy?: string;
      sortDirection?: "asc" | "desc";
    },
  ): Promise<{
    items: ${names.pascalEntity}RepositoryRecord[];
    total: number;
    page: number;
    pageSize: number;
  }>;

  get(
    id: string,
  ): Promise<${names.pascalEntity}RepositoryRecord | null>;

  create(
    payload: Record<string, unknown>,
  ): Promise<${names.pascalEntity}RepositoryRecord>;

  update(
    id: string,
    payload: Record<string, unknown>,
  ): Promise<${names.pascalEntity}RepositoryRecord>;

  remove(
    id: string,
  ): Promise<${names.pascalEntity}RepositoryRecord>;
}
`;
        const memoryContent = `import {
  randomUUID,
} from "node:crypto";
import {
  ${names.pascalEntity}Repository,
  ${names.pascalEntity}RepositoryRecord,
} from "./${names.kebabEntity}.repository";

export class InMemory${names.pascalEntity}Repository
  implements ${names.pascalEntity}Repository {
  private readonly records =
    new Map<
      string,
      ${names.pascalEntity}RepositoryRecord
    >();

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

    const search =
      input.search?.toLowerCase();

    const all =
      Array.from(
        this.records.values(),
      )
        .filter(
          (record) =>
            !search ||
            JSON.stringify(
              record.payload,
            )
              .toLowerCase()
              .includes(search),
        )
        .sort(
          (left, right) =>
            (
              input.sortDirection ===
              "asc"
                ? 1
                : -1
            ) *
            right.updatedAt.localeCompare(
              left.updatedAt,
            ),
        );

    const offset =
      (page - 1) *
      pageSize;

    return {
      items:
        all.slice(
          offset,
          offset + pageSize,
        ),
      total:
        all.length,
      page,
      pageSize,
    };
  }

  async get(
    id: string,
  ) {
    return this.records.get(id) ??
      null;
  }

  async create(
    payload:
      Record<string, unknown>,
  ) {
    const now =
      new Date().toISOString();

    const record:
      ${names.pascalEntity}RepositoryRecord = {
      id:
        randomUUID(),
      payload,
      createdAt:
        now,
      updatedAt:
        now,
    };

    this.records.set(
      record.id,
      record,
    );

    return record;
  }

  async update(
    id: string,
    payload:
      Record<string, unknown>,
  ) {
    const current =
      this.records.get(id);

    if (!current) {
      throw new Error(
        "${names.pascalEntity} record was not found",
      );
    }

    const updated = {
      ...current,
      payload: {
        ...current.payload,
        ...payload,
      },
      updatedAt:
        new Date().toISOString(),
    };

    this.records.set(
      id,
      updated,
    );

    return updated;
  }

  async remove(
    id: string,
  ) {
    const current =
      this.records.get(id);

    if (!current) {
      throw new Error(
        "${names.pascalEntity} record was not found",
      );
    }

    this.records.delete(id);

    return current;
  }
}
`;
        return [
            this.artifacts.create({
                id: `${names.kebabModule}:repository-contract`,
                key: `${names.kebabModule}.repository.contract`,
                type: codegen_artifact_contracts_1.CodeGenArtifactType.SOURCE,
                relativePath: `${basePath}/${names.kebabEntity}.repository.ts`,
                content: contractContent,
                tags: [
                    "repository",
                    "contract",
                    "generator-v3",
                ],
            }),
            this.artifacts.create({
                id: `${names.kebabModule}:repository-memory`,
                key: `${names.kebabModule}.repository.memory`,
                type: codegen_artifact_contracts_1.CodeGenArtifactType.SOURCE,
                relativePath: `${basePath}/${names.kebabEntity}.repository.memory.ts`,
                content: memoryContent,
                dependencies: [
                    `${names.kebabModule}.repository.contract`,
                ],
                tags: [
                    "repository",
                    "memory",
                    "generator-v3",
                ],
            }),
        ];
    }
}
exports.CodeGenGeneratorV3RepositoryRenderer = CodeGenGeneratorV3RepositoryRenderer;
//# sourceMappingURL=codegen-generator-v3-repository-renderer.js.map