import { Injectable } from "@nestjs/common";
import {
  FactoryFilePlan,
  FactoryGeneratedFile,
} from "../contracts/generation.contracts";
import { FactoryTemplateRegistryService } from "../registry/template-registry.service";
import { createFactoryChecksum } from "../utils/factory-checksum.util";
import { FactoryTemplateRendererService } from "./template-renderer.service";

@Injectable()
export class FactorySourceGeneratorService {
  constructor(
    private readonly templates: FactoryTemplateRegistryService,
    private readonly renderer: FactoryTemplateRendererService,
  ) {}

  generate(plan: FactoryFilePlan): FactoryGeneratedFile[] {
    return [...plan.items]
      .sort((a, b) => a.order - b.order)
      .map((item) => {
        let content = item.inlineContent;

        if (!content && item.templateId) {
          const template = this.templates.get(item.templateId);
          if (!template) {
            throw new Error(`Template '${item.templateId}' was not found.`);
          }
          if (!template.enabled) {
            throw new Error(`Template '${item.templateId}' is disabled.`);
          }
          content = this.renderer.render(template.content, item.variables);
        }

        if (content === undefined) {
          throw new Error(
            `Plan item '${item.relativePath}' has neither content nor templateId.`,
          );
        }

        return {
          planItemId: item.id,
          relativePath: item.relativePath,
          artifactType: item.artifactType,
          content,
          checksum: createFactoryChecksum(content),
        };
      });
  }
}
