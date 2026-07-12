import {
  V4BackendArtifact,
  V4BackendDomain,
} from "./contracts";
import { backendKebab, backendPascal } from "./name-utils";

export class V4BackendTestGenerator {
  generate(domain: V4BackendDomain): V4BackendArtifact[] {
    const key = backendKebab(domain.key);
    const entity = backendPascal(domain.entityName);

    return [
      {
        relativePath: `apps/api/src/${key}/${key}.service.spec.ts`,
        kind: "test",
        content: `import { NotFoundException } from "@nestjs/common";
import { ${entity}Service } from "./${key}.service";

describe("${entity}Service", () => {
  const repository = {
    create: jest.fn(),
    findMany: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  const service = new ${entity}Service(
    repository as never,
  );

  it("throws when item does not exist", async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      service.findOne("missing"),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
`,
        metadata: { domain: domain.key, test: "unit" },
      },
      {
        relativePath: `apps/api/test/${key}.e2e-spec.ts`,
        kind: "test",
        content: `describe("${entity} API", () => {
  it("exposes production CRUD routes", () => {
    expect([
      "POST /${key}",
      "GET /${key}",
      "GET /${key}/:id",
      "PATCH /${key}/:id",
      "DELETE /${key}/:id",
    ]).toHaveLength(5);
  });
});
`,
        metadata: { domain: domain.key, test: "integration" },
      },
    ];
  }
}
