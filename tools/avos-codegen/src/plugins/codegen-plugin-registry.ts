import {
  CodeGenPlugin,
  CodeGenPluginDescriptor,
  CodeGenPluginStatus,
  CodeGenRuntimeContext,
} from "../core/codegen.contracts";
import {
  CodeGenValidationError,
} from "../core/codegen.errors";

export class CodeGenPluginRegistry {
  private readonly plugins =
    new Map<string, CodeGenPlugin>();

  register(
    plugin: CodeGenPlugin,
    replace = false,
  ): CodeGenPlugin {
    const key =
      plugin.descriptor.key.trim();

    if (!key) {
      throw new CodeGenValidationError(
        "Plugin key is required",
      );
    }

    if (
      this.plugins.has(key) &&
      !replace
    ) {
      throw new CodeGenValidationError(
        `Plugin is already registered: ${key}`,
      );
    }

    const descriptor:
      CodeGenPluginDescriptor = {
      ...structuredClone(
        plugin.descriptor,
      ),
      status:
        CodeGenPluginStatus.REGISTERED,
      registeredAt:
        new Date().toISOString(),
    };

    const registered:
      CodeGenPlugin = {
      ...plugin,
      descriptor,
    };

    this.plugins.set(
      key,
      registered,
    );

    return registered;
  }

  get(key: string): CodeGenPlugin {
    const plugin = this.plugins.get(key);

    if (!plugin) {
      throw new CodeGenValidationError(
        `Plugin was not found: ${key}`,
      );
    }

    return plugin;
  }

  find(
    key: string,
  ): CodeGenPlugin | undefined {
    return this.plugins.get(key);
  }

  list(): readonly CodeGenPlugin[] {
    return Array.from(
      this.plugins.values(),
    ).sort((left, right) =>
      left.descriptor.key.localeCompare(
        right.descriptor.key,
      ),
    );
  }

  listEnabled():
    readonly CodeGenPlugin[] {
    return this.list().filter(
      (plugin) =>
        plugin.descriptor.enabled &&
        plugin.descriptor.status !==
          CodeGenPluginStatus.DISABLED,
    );
  }

  async initializeAll(
    context: CodeGenRuntimeContext,
  ): Promise<void> {
    for (
      const plugin of
      this.resolveOrder()
    ) {
      plugin.descriptor.status =
        CodeGenPluginStatus.INITIALIZING;

      try {
        await plugin.initialize?.(
          context,
        );

        await plugin.activate?.(
          context,
        );

        plugin.descriptor.status =
          CodeGenPluginStatus.READY;

        plugin.descriptor.initializedAt =
          new Date().toISOString();

        delete plugin.descriptor.error;
      } catch (error) {
        plugin.descriptor.status =
          CodeGenPluginStatus.FAILED;

        plugin.descriptor.failedAt =
          new Date().toISOString();

        plugin.descriptor.error =
          error instanceof Error
            ? error.message
            : "Unknown plugin initialization failure";

        throw error;
      }
    }
  }

  async deactivateAll(
    context: CodeGenRuntimeContext,
  ): Promise<void> {
    const plugins =
      [...this.resolveOrder()]
        .reverse();

    for (const plugin of plugins) {
      await plugin.deactivate?.(
        context,
      );

      plugin.descriptor.status =
        CodeGenPluginStatus.REGISTERED;
    }
  }

  remove(key: string): CodeGenPlugin {
    const plugin = this.get(key);

    plugin.descriptor.status =
      CodeGenPluginStatus.REMOVED;

    this.plugins.delete(key);

    return plugin;
  }

  clear(): void {
    this.plugins.clear();
  }

  private resolveOrder():
    CodeGenPlugin[] {
    const ordered:
      CodeGenPlugin[] = [];

    const visiting =
      new Set<string>();

    const visited =
      new Set<string>();

    const visit = (
      plugin: CodeGenPlugin,
    ): void => {
      const key =
        plugin.descriptor.key;

      if (visited.has(key)) {
        return;
      }

      if (visiting.has(key)) {
        throw new CodeGenValidationError(
          `Circular plugin dependency detected at ${key}`,
        );
      }

      visiting.add(key);

      for (
        const dependencyKey of
        plugin.descriptor.dependencies
      ) {
        const dependency =
          this.plugins.get(
            dependencyKey,
          );

        if (!dependency) {
          throw new CodeGenValidationError(
            `Plugin dependency was not found: ${dependencyKey}`,
          );
        }

        visit(dependency);
      }

      visiting.delete(key);
      visited.add(key);

      if (
        plugin.descriptor.enabled
      ) {
        ordered.push(plugin);
      }
    };

    for (
      const plugin of
      this.listEnabled()
    ) {
      visit(plugin);
    }

    return ordered;
  }
}

