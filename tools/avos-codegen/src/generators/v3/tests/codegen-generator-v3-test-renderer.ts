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

export class CodeGenGeneratorV3TestRenderer {
  constructor(
    readonly artifacts =
      new CodeGenGeneratorV3ArtifactFactory(),
  ) {}

  render(
    context:
      CodeGenGeneratorV3RendererContext,
  ): CodeGenArtifactDescriptor[] {
    if (
      !context.request.includeTests
    ) {
      return [];
    }

    const {
      names,
      request,
    } = context;

    const basePath =
      `src/${names.kebabModule}`;

    const results:
      CodeGenArtifactDescriptor[] =
      [];

    if (
      request.includeService
    ) {
      const serviceSpec = `import { ${names.pascalModule}Service } from "./${names.kebabModule}.service";

describe("${names.pascalModule}Service", () => {
  it("returns a healthy status", () => {
    const service =
      new ${names.pascalModule}Service();

    const status =
      service.status();

    expect(status.success)
      .toBe(true);

    expect(status.module)
      .toBe("${names.kebabModule}");
  });

  it("creates and retrieves records", () => {
    const service =
      new ${names.pascalModule}Service();

    const created =
      service.create({
        name:
          "Generated Record",
      });

    expect(
      service.get(created.id).id,
    ).toBe(created.id);
  });
});
`;

      results.push(
        this.artifacts.create({
          id:
            `${names.kebabModule}:service-spec`,
          key:
            `${names.kebabModule}.test.service`,
          type:
            CodeGenArtifactType.TEST,
          relativePath:
            `${basePath}/${names.kebabModule}.service.spec.ts`,
          content:
            serviceSpec,
          dependencies: [
            `${names.kebabModule}.service`,
          ],
          tags: [
            "test",
            "jest",
            "generator-v3",
          ],
        }),
      );
    }

    if (
      request.includeController
    ) {
      const controllerSpec = `import { ${names.pascalModule}Controller } from "./${names.kebabModule}.controller";
import { ${names.pascalModule}Service } from "./${names.kebabModule}.service";

describe("${names.pascalModule}Controller", () => {
  it("is created", () => {
    const service =
      new ${names.pascalModule}Service();

    const controller =
      new ${names.pascalModule}Controller(
        service,
      );

    expect(controller)
      .toBeDefined();
  });
});
`;

      results.push(
        this.artifacts.create({
          id:
            `${names.kebabModule}:controller-spec`,
          key:
            `${names.kebabModule}.test.controller`,
          type:
            CodeGenArtifactType.TEST,
          relativePath:
            `${basePath}/${names.kebabModule}.controller.spec.ts`,
          content:
            controllerSpec,
          dependencies: [
            `${names.kebabModule}.controller`,
          ],
          tags: [
            "test",
            "jest",
            "generator-v3",
          ],
        }),
      );
    }

    return results;
  }
}
