import { Injectable } from "@nestjs/common";
import { GeneratorPlugin } from "./generator-sdk.contracts";

@Injectable()
export class GeneratorPluginRegistryService {
  private readonly plugins = new Map<string, GeneratorPlugin>();

  register(plugin: GeneratorPlugin): GeneratorPlugin {
    const existing = this.plugins.get(plugin.id);

    if (
      existing &&
      existing.version === plugin.version
    ) {
      return existing;
    }

    this.plugins.set(plugin.id, plugin);
    return plugin;
  }

  get(id: string): GeneratorPlugin | undefined {
    return this.plugins.get(id);
  }

  has(id: string): boolean {
    return this.plugins.has(id);
  }

  list(): GeneratorPlugin[] {
    return [...this.plugins.values()];
  }

  count(): number {
    return this.plugins.size;
  }
}
