import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  OmegaBundleBlueprint,
  OmegaGeneratedArtifact,
  OmegaGenerationResult,
} from "./omega-generator.types";
import { OmegaModuleComposer } from "./omega-module-composer";
import { OmegaTemplateEngine } from "./omega-template-engine";

export class OmegaGenerator {
  private readonly templates = new OmegaTemplateEngine();
  private readonly composer = new OmegaModuleComposer();

  generate(blueprint: OmegaBundleBlueprint): OmegaGenerationResult {
    const artifacts: OmegaGeneratedArtifact[] = [];

    mkdirSync(blueprint.targetRoot, { recursive: true });

    for (const capability of blueprint.capabilities) {
      const capabilityRoot = join(
        blueprint.targetRoot,
        capability.capability,
      );

      mkdirSync(capabilityRoot, { recursive: true });

      const files = [
        {
          type: "service" as const,
          path: join(
            capabilityRoot,
            `${capability.capability}.service.ts`,
          ),
          content: this.templates.service(capability),
        },
        {
          type: "controller" as const,
          path: join(
            capabilityRoot,
            `${capability.capability}.controller.ts`,
          ),
          content: this.templates.controller(capability),
        },
        {
          type: "module" as const,
          path: join(
            capabilityRoot,
            `${capability.capability}.module.ts`,
          ),
          content: this.templates.module(capability),
        },
        {
          type: "test" as const,
          path: join(
            capabilityRoot,
            `${capability.capability}.service.spec.ts`,
          ),
          content: this.templates.test(capability),
        },
      ];

      for (const file of files) {
        writeFileSync(file.path, file.content, "utf8");
        artifacts.push({
          type: file.type,
          path: file.path,
          capability: capability.capability,
        });
      }
    }

    const aggregatePath = join(
      blueprint.targetRoot,
      `${blueprint.namespace}.generated.module.ts`,
    );

    writeFileSync(
      aggregatePath,
      this.composer.compose(
        blueprint.namespace,
        blueprint.capabilities,
      ),
      "utf8",
    );

    artifacts.push({
      type: "module",
      path: aggregatePath,
    });

    const result: OmegaGenerationResult = {
      bundle: blueprint.bundle,
      namespace: blueprint.namespace,
      targetRoot: blueprint.targetRoot,
      capabilities: blueprint.capabilities.length,
      artifacts,
      generatedAt: new Date().toISOString(),
    };

    const manifestPath = join(
      blueprint.targetRoot,
      "omega-generation.manifest.json",
    );

    writeFileSync(
      manifestPath,
      JSON.stringify(result, null, 2),
      "utf8",
    );

    artifacts.push({
      type: "manifest",
      path: manifestPath,
    });

    return result;
  }
}