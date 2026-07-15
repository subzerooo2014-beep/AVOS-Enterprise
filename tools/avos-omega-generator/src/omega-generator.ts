import {
  existsSync,
  mkdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { OmegaBlueprintValidator } from "./omega-blueprint-validator";
import {
  OmegaBundleBlueprint,
  OmegaGeneratedArtifact,
  OmegaGenerationResult,
} from "./omega-generator.types";
import { OmegaModuleComposer } from "./omega-module-composer";
import { OmegaTemplateEngine } from "./omega-template-engine";
import { toKebabCase } from "./omega-name.utilities";

export class OmegaGenerator {
  private readonly templates = new OmegaTemplateEngine();
  private readonly composer = new OmegaModuleComposer();
  private readonly validator = new OmegaBlueprintValidator();

  generate(blueprint: OmegaBundleBlueprint): OmegaGenerationResult {
    this.validator.validate(blueprint);

    const finalRoot = blueprint.targetRoot;
    const stagingRoot = `${finalRoot}.omega-staging`;
    const backupRoot = `${finalRoot}.omega-backup`;

    rmSync(stagingRoot, { recursive: true, force: true });
    rmSync(backupRoot, { recursive: true, force: true });
    mkdirSync(stagingRoot, { recursive: true });

    const artifacts: OmegaGeneratedArtifact[] = [];

    try {
      for (const sourceCapability of blueprint.capabilities) {
        const capability = {
          ...sourceCapability,
          capability: toKebabCase(sourceCapability.capability),
        };

        const capabilityRoot = join(
          stagingRoot,
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
          mkdirSync(dirname(file.path), { recursive: true });
          writeFileSync(file.path, file.content, "utf8");

          artifacts.push({
            type: file.type,
            path: file.path,
            capability: capability.capability,
          });
        }
      }

      const aggregatePath = join(
        stagingRoot,
        `${toKebabCase(blueprint.namespace)}.generated.module.ts`,
      );

      writeFileSync(
        aggregatePath,
        this.composer.compose(
          blueprint.namespace,
          blueprint.capabilities.map((item) => ({
            ...item,
            capability: toKebabCase(item.capability),
          })),
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
        targetRoot: finalRoot,
        capabilities: blueprint.capabilities.length,
        artifacts,
        generatedAt: new Date().toISOString(),
      };

      const manifestPath = join(
        stagingRoot,
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

      if (existsSync(finalRoot)) {
        renameSync(finalRoot, backupRoot);
      }

      renameSync(stagingRoot, finalRoot);
      rmSync(backupRoot, { recursive: true, force: true });

      return result;
    } catch (error) {
      rmSync(stagingRoot, { recursive: true, force: true });

      if (!existsSync(finalRoot) && existsSync(backupRoot)) {
        renameSync(backupRoot, finalRoot);
      }

      throw error;
    }
  }
}