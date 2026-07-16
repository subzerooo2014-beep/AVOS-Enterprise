import { Injectable, NotFoundException } from "@nestjs/common";
import type { FoundationPluginManifestV1 } from "./foundation-core-platform-v1.types";

@Injectable()
export class FoundationPluginFrameworkV1Service {
  private readonly plugins = new Map<string, FoundationPluginManifestV1>();

  register(
    input: Omit<FoundationPluginManifestV1, "createdAt" | "updatedAt">,
  ): FoundationPluginManifestV1 {
    const existing = this.plugins.get(input.id);
    const now = new Date().toISOString();

    const plugin: FoundationPluginManifestV1 = {
      ...input,
      capabilities: [...input.capabilities],
      permissions: [...input.permissions],
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.plugins.set(plugin.id, plugin);
    return this.clone(plugin);
  }

  enable(id: string): FoundationPluginManifestV1 {
    const plugin = this.requirePlugin(id);
    plugin.enabled = true;
    plugin.updatedAt = new Date().toISOString();
    return this.clone(plugin);
  }

  disable(id: string): FoundationPluginManifestV1 {
    const plugin = this.requirePlugin(id);
    plugin.enabled = false;
    plugin.updatedAt = new Date().toISOString();
    return this.clone(plugin);
  }

  get(id: string): FoundationPluginManifestV1 {
    return this.clone(this.requirePlugin(id));
  }

  list(): FoundationPluginManifestV1[] {
    return Array.from(this.plugins.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.plugins.size;
  }

  enabledCount(): number {
    return this.list().filter((item) => item.enabled).length;
  }

  private requirePlugin(id: string): FoundationPluginManifestV1 {
    const plugin = this.plugins.get(id);

    if (!plugin) {
      throw new NotFoundException(`Foundation plugin '${id}' was not found.`);
    }

    return plugin;
  }

  private clone(item: FoundationPluginManifestV1): FoundationPluginManifestV1 {
    return {
      ...item,
      capabilities: [...item.capabilities],
      permissions: [...item.permissions],
    };
  }
}
