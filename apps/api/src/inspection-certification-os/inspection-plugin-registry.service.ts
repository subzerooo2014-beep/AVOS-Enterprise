import { Injectable } from "@nestjs/common";
import { InspectionPlugin } from "./inspection-plugin.types";

@Injectable()
export class InspectionPluginRegistryService {
  private readonly plugins = new Map<string, InspectionPlugin>();

  register(plugin: InspectionPlugin): InspectionPlugin {
    if (this.plugins.has(plugin.id)) {
      throw new Error(`Inspection plugin already exists: ${plugin.id}`);
    }

    this.plugins.set(plugin.id, plugin);
    return plugin;
  }

  upsert(plugin: InspectionPlugin): InspectionPlugin {
    this.plugins.set(plugin.id, plugin);
    return plugin;
  }

  get(pluginId: string): InspectionPlugin | undefined {
    return this.plugins.get(pluginId);
  }

  list(): InspectionPlugin[] {
    return [...this.plugins.values()].sort(
      (left, right) => left.priority - right.priority,
    );
  }

  enabled(): InspectionPlugin[] {
    return this.list().filter((plugin) => plugin.enabled);
  }
}
