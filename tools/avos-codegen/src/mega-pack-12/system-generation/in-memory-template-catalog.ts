import {
  SystemComponentType,
} from "./contracts";
import {
  SystemGenerationTemplateCatalog,
} from "./artifact-factory";

export class InMemorySystemGenerationTemplateCatalog
  implements SystemGenerationTemplateCatalog {
  private readonly templates =
    new Map<
      SystemComponentType,
      string
    >();

  constructor() {
    for (
      const type of
      Object.values(
        SystemComponentType,
      )
    ) {
      this.templates.set(
        type,
        this.defaultTemplate(type),
      );
    }
  }

  getTemplate(
    type: SystemComponentType,
  ): string {
    const template =
      this.templates.get(type);

    if (!template) {
      throw new Error(
        `System generation template was not found: ${type}`,
      );
    }

    return template;
  }

  setTemplate(
    type: SystemComponentType,
    template: string,
  ): void {
    this.templates.set(
      type,
      template,
    );
  }

  private defaultTemplate(
    type: SystemComponentType,
  ): string {
    return [
      `// Generated ${type}`,
      `// Component: {{component.name}}`,
      `// Description: {{component.description}}`,
      "",
      `export const {{component.key}}Definition = {`,
      `  key: "{{component.key}}",`,
      `  type: "${type}",`,
      `  tags: {{component.tags}},`,
      `} as const;`,
      "",
    ].join("\n");
  }
}
