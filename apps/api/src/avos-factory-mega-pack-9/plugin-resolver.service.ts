import { Injectable } from "@nestjs/common";
import { GeneratorPlugin } from "../avos-factory-mega-pack-8/generator-sdk.contracts";
import { GeneratorPluginRegistryService } from "../avos-factory-mega-pack-8/generator-plugin-registry.service";
import { PluginNotFoundError } from "./runtime-errors";

@Injectable()
export class PluginResolverService {
  constructor(
    private readonly registry: GeneratorPluginRegistryService
  ) {}

  resolve(pluginId: string): GeneratorPlugin {
    const plugin = this.registry.get(pluginId);

    if (!plugin) {
      throw new PluginNotFoundError(pluginId);
    }

    return plugin;
  }

  resolveForTarget(
    pluginId: string,
    target: string
  ): GeneratorPlugin {
    const plugin = this.resolve(pluginId);

    if (!plugin.supportedTargets.includes(target)) {
      throw new Error(
        `Generator plugin "${pluginId}" does not support target "${target}".`
      );
    }

    return plugin;
  }
}
