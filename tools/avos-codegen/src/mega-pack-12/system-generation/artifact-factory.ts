import {
  createHash,
  randomUUID,
} from "node:crypto";
import {
  SystemComponentType,
  SystemGenerationArtifact,
  SystemGenerationComponentRequest,
} from "./contracts";
import {
  SystemGenerationTemplateRenderer,
} from "./template-renderer";

export interface SystemGenerationTemplateCatalog {
  getTemplate(
    type: SystemComponentType,
  ): string;
}

export class SystemGenerationArtifactFactory {
  constructor(
    readonly templates:
      SystemGenerationTemplateCatalog,
    readonly renderer =
      new SystemGenerationTemplateRenderer(),
  ) {}

  create(
    component:
      SystemGenerationComponentRequest,
    variables:
      Record<string, any>,
  ): SystemGenerationArtifact {
    const template =
      this.templates.getTemplate(
        component.type,
      );

    const content =
      this.renderer.render(
        template,
        {
          component,
          variables,
        },
      );

    const relativePath =
      this.relativePathFor(
        component,
      );

    return {
      id: randomUUID(),
      key:
        `${component.key}:${component.type}`,
      componentKey:
        component.key,
      relativePath,
      content,
      checksum:
        createHash("sha256")
          .update(content)
          .digest("hex"),
      tags: [
        ...component.tags,
      ],
      metadata: {
        componentType:
          component.type,
      },
    };
  }

  private relativePathFor(
    component:
      SystemGenerationComponentRequest,
  ): string {
    const safe =
      component.key
        .replace(
          /[^A-Za-z0-9_-]/g,
          "-",
        )
        .toLowerCase();

    return [
      "generated",
      safe,
      `${safe}.${component.type}.ts`,
    ].join("/");
  }
}
