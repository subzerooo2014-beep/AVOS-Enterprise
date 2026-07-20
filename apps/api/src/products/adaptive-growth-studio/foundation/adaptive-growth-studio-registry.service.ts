import { Injectable } from "@nestjs/common";
import {
  StudioSectionDefinition,
} from "../contracts/adaptive-growth-studio.contracts";

@Injectable()
export class AdaptiveGrowthStudioRegistryService {
  private readonly definitions = new Map<
    string,
    StudioSectionDefinition
  >();

  register(definition: StudioSectionDefinition) {
    this.definitions.set(definition.id, {
      ...definition,
      permissions: [...definition.permissions],
      capabilities: [...definition.capabilities],
    });
    return this.get(definition.id);
  }

  registerMany(definitions: StudioSectionDefinition[]) {
    for (const definition of definitions) {
      this.register(definition);
    }
    return this.list();
  }

  get(id: string) {
    const item = this.definitions.get(id);
    return item
      ? {
          ...item,
          permissions: [...item.permissions],
          capabilities: [...item.capabilities],
        }
      : undefined;
  }

  list() {
    return [...this.definitions.values()].map((item) => ({
      ...item,
      permissions: [...item.permissions],
      capabilities: [...item.capabilities],
    }));
  }

  summary() {
    const all = this.list();
    return {
      total: all.length,
      sections: all.filter((item) => item.category === "section").length,
      shared: all.filter((item) => item.category === "shared").length,
      enabled: all.filter((item) => item.enabled).length,
      humanGoverned: all.filter(
        (item) => item.requiresHumanApproval,
      ).length,
      generatedAt: new Date().toISOString(),
    };
  }
}