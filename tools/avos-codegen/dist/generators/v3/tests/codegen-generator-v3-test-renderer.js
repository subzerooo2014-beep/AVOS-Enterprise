"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGeneratorV3TestRenderer = void 0;
const codegen_artifact_contracts_1 = require("../../../artifacts/codegen-artifact.contracts");
const codegen_generator_v3_artifact_factory_1 = require("../runtime/codegen-generator-v3-artifact-factory");
class CodeGenGeneratorV3TestRenderer {
    artifacts;
    constructor(artifacts = new codegen_generator_v3_artifact_factory_1.CodeGenGeneratorV3ArtifactFactory()) {
        this.artifacts = artifacts;
    }
    render(context) {
        if (!context.request.includeTests) {
            return [];
        }
        const { names, request, } = context;
        const basePath = `src/${names.kebabModule}`;
        const results = [];
        if (request.includeService) {
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
            results.push(this.artifacts.create({
                id: `${names.kebabModule}:service-spec`,
                key: `${names.kebabModule}.test.service`,
                type: codegen_artifact_contracts_1.CodeGenArtifactType.TEST,
                relativePath: `${basePath}/${names.kebabModule}.service.spec.ts`,
                content: serviceSpec,
                dependencies: [
                    `${names.kebabModule}.service`,
                ],
                tags: [
                    "test",
                    "jest",
                    "generator-v3",
                ],
            }));
        }
        if (request.includeController) {
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
            results.push(this.artifacts.create({
                id: `${names.kebabModule}:controller-spec`,
                key: `${names.kebabModule}.test.controller`,
                type: codegen_artifact_contracts_1.CodeGenArtifactType.TEST,
                relativePath: `${basePath}/${names.kebabModule}.controller.spec.ts`,
                content: controllerSpec,
                dependencies: [
                    `${names.kebabModule}.controller`,
                ],
                tags: [
                    "test",
                    "jest",
                    "generator-v3",
                ],
            }));
        }
        return results;
    }
}
exports.CodeGenGeneratorV3TestRenderer = CodeGenGeneratorV3TestRenderer;
//# sourceMappingURL=codegen-generator-v3-test-renderer.js.map