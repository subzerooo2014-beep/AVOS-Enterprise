"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGeneratorV3IntegrationTestRenderer = void 0;
const codegen_artifact_contracts_1 = require("../../../artifacts/codegen-artifact.contracts");
const codegen_generator_v3_artifact_factory_1 = require("../runtime/codegen-generator-v3-artifact-factory");
class CodeGenGeneratorV3IntegrationTestRenderer {
    artifacts;
    constructor(artifacts = new codegen_generator_v3_artifact_factory_1.CodeGenGeneratorV3ArtifactFactory()) {
        this.artifacts = artifacts;
    }
    render(context) {
        const { names, } = context;
        const basePath = `src/${names.kebabModule}`;
        const content = `import {
  InMemory${names.pascalEntity}Repository,
} from "./${names.kebabEntity}.repository.memory";

describe("${names.pascalEntity} repository integration", () => {
  it("creates, lists, updates, and removes records", async () => {
    const repository =
      new InMemory${names.pascalEntity}Repository();

    const created =
      await repository.create({
        name:
          "Integration Record",
      });

    const listed =
      await repository.list({
        page:
          1,
        pageSize:
          20,
      });

    expect(listed.total)
      .toBe(1);

    const updated =
      await repository.update(
        created.id,
        {
          active:
            true,
        },
      );

    expect(
      updated.payload["active"],
    ).toBe(true);

    const removed =
      await repository.remove(
        created.id,
      );

    expect(removed.id)
      .toBe(created.id);
  });
});
`;
        return [
            this.artifacts.create({
                id: `${names.kebabModule}:integration-spec`,
                key: `${names.kebabModule}.test.integration`,
                type: codegen_artifact_contracts_1.CodeGenArtifactType.TEST,
                relativePath: `${basePath}/${names.kebabModule}.integration.spec.ts`,
                content,
                dependencies: [
                    `${names.kebabModule}.repository.memory`,
                ],
                tags: [
                    "integration-test",
                    "repository",
                    "generator-v3",
                ],
            }),
        ];
    }
}
exports.CodeGenGeneratorV3IntegrationTestRenderer = CodeGenGeneratorV3IntegrationTestRenderer;
//# sourceMappingURL=codegen-generator-v3-integration-test-renderer.js.map