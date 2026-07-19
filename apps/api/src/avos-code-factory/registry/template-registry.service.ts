import { Injectable } from "@nestjs/common";
import { FactoryTemplate } from "../contracts/workspace.contracts";

@Injectable()
export class FactoryTemplateRegistryService {
  private readonly templates = new Map<string, FactoryTemplate>();

  register(template: FactoryTemplate): FactoryTemplate {
    const normalized = {
      ...template,
      variables: [...new Set(template.variables)],
      metadata: template.metadata ?? {},
    };

    this.templates.set(normalized.id, normalized);
    return normalized;
  }

  get(id: string) {
    return this.templates.get(id);
  }

  list() {
    return [...this.templates.values()].sort((a, b) => a.id.localeCompare(b.id));
  }

  unregister(id: string) {
    return this.templates.delete(id);
  }
}
