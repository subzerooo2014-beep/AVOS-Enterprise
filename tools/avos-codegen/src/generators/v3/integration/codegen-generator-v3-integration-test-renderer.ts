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

export class CodeGenGeneratorV3IntegrationTestRenderer {
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
        id:
          `${names.kebabModule}:integration-spec`,
        key:
          `${names.kebabModule}.test.integration`,
        type:
          CodeGenArtifactType.TEST,
        relativePath:
          `${basePath}/${names.kebabModule}.integration.spec.ts`,
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
