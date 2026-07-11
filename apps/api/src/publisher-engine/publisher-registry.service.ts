import {
  Injectable,
  Logger,
  OnApplicationShutdown,
} from "@nestjs/common";

import {
  PublisherAdapter,
  PublisherStatus,
} from "./contracts/publisher.types";

export {
  PublisherAdapter,
  PublisherContext,
  PublisherResult,
  PublisherStatus,
} from "./contracts/publisher.types";

export interface RegisteredPublisherMetadata {
  channel: string;
  aliases: string[];
  displayName: string;
  registeredAt: Date;
}

@Injectable()
export class PublisherRegistryService implements OnApplicationShutdown {
  private readonly logger = new Logger(PublisherRegistryService.name);

  private readonly adapters = new Map<string, PublisherAdapter>();
  private readonly aliases = new Map<string, string>();
  private readonly metadata = new Map<
    string,
    RegisteredPublisherMetadata
  >();

  register(
    adapter: PublisherAdapter,
    options?: {
      aliases?: string[];
      displayName?: string;
      replace?: boolean;
    },
  ): PublisherAdapter {
    this.validateAdapter(adapter);

    const channel = this.normalizeChannel(adapter.channel);
    const replace = options?.replace === true;

    if (this.adapters.has(channel) && !replace) {
      throw new Error(
        `Publisher channel "${channel}" is already registered`,
      );
    }

    if (replace && this.adapters.has(channel)) {
      this.unregister(channel);
    }

    const normalizedAliases = Array.from(
      new Set(
        (options?.aliases ?? [])
          .map((alias) => this.normalizeChannel(alias))
          .filter((alias) => alias !== channel),
      ),
    );

    for (const alias of normalizedAliases) {
      if (this.adapters.has(alias)) {
        throw new Error(
          `Publisher alias "${alias}" conflicts with an existing channel`,
        );
      }

      const aliasOwner = this.aliases.get(alias);

      if (aliasOwner && aliasOwner !== channel) {
        throw new Error(
          `Publisher alias "${alias}" is already owned by "${aliasOwner}"`,
        );
      }
    }

    this.adapters.set(channel, adapter);

    for (const alias of normalizedAliases) {
      this.aliases.set(alias, channel);
    }

    this.metadata.set(channel, {
      channel,
      aliases: normalizedAliases,
      displayName: options?.displayName?.trim() || channel,
      registeredAt: new Date(),
    });

    this.logger.log(
      `Publisher registered: ${channel}${
        normalizedAliases.length
          ? ` [aliases: ${normalizedAliases.join(", ")}]`
          : ""
      }`,
    );

    return adapter;
  }

  registerMany(
    adapters: readonly PublisherAdapter[],
  ): PublisherAdapter[] {
    const registered: PublisherAdapter[] = [];

    try {
      for (const adapter of adapters) {
        registered.push(this.register(adapter));
      }

      return registered;
    } catch (error) {
      for (const adapter of registered.reverse()) {
        this.unregister(adapter.channel);
      }

      throw error;
    }
  }

  unregister(channelOrAlias: string): boolean {
    const channel = this.resolveChannel(channelOrAlias);
    const adapter = this.adapters.get(channel);

    if (!adapter) {
      return false;
    }

    const registration = this.metadata.get(channel);

    if (registration) {
      for (const alias of registration.aliases) {
        this.aliases.delete(alias);
      }
    }

    this.adapters.delete(channel);
    this.metadata.delete(channel);

    this.logger.log(`Publisher unregistered: ${channel}`);

    return true;
  }

  get(channelOrAlias: string): PublisherAdapter {
    const channel = this.resolveChannel(channelOrAlias);
    const adapter = this.adapters.get(channel);

    if (!adapter) {
      const channels = this.list();

      throw new Error(
        channels.length > 0
          ? `Publisher "${channelOrAlias}" is not registered. Available channels: ${channels.join(
              ", ",
            )}`
          : `Publisher "${channelOrAlias}" is not registered. Publisher registry is empty.`,
      );
    }

    return adapter;
  }

  find(channelOrAlias: string): PublisherAdapter | undefined {
    const channel = this.resolveChannel(channelOrAlias);
    return this.adapters.get(channel);
  }

  exists(channelOrAlias: string): boolean {
    const channel = this.resolveChannel(channelOrAlias);
    return this.adapters.has(channel);
  }

  has(channelOrAlias: string): boolean {
    return this.exists(channelOrAlias);
  }

  list(): string[] {
    return Array.from(this.adapters.keys()).sort((left, right) =>
      left.localeCompare(right),
    );
  }

  listMetadata(): RegisteredPublisherMetadata[] {
    return Array.from(this.metadata.values())
      .sort((left, right) =>
        left.channel.localeCompare(right.channel),
      )
      .map((item) => ({
        ...item,
        aliases: [...item.aliases],
      }));
  }

  count(): number {
    return this.adapters.size;
  }

  async health(): Promise<
    Array<{
      channel: string;
      status: PublisherStatus;
      error?: string;
    }>
  > {
    const output: Array<{
      channel: string;
      status: PublisherStatus;
      error?: string;
    }> = [];

    for (const channel of this.list()) {
      const adapter = this.get(channel);

      try {
        output.push({
          channel,
          status: await adapter.health(),
        });
      } catch (error) {
        output.push({
          channel,
          status: "offline",
          error: this.errorMessage(error),
        });
      }
    }

    return output;
  }

  async onApplicationShutdown(): Promise<void> {
    this.adapters.clear();
    this.aliases.clear();
    this.metadata.clear();
  }

  private resolveChannel(channelOrAlias: string): string {
    const normalized = this.normalizeChannel(channelOrAlias);
    return this.aliases.get(normalized) ?? normalized;
  }

  private normalizeChannel(value: string): string {
    if (typeof value !== "string" || !value.trim()) {
      throw new Error("Publisher channel must be a non-empty string");
    }

    const normalized = value.trim().toLowerCase();

    if (!/^[a-z0-9][a-z0-9._:-]*$/.test(normalized)) {
      throw new Error(
        `Invalid publisher channel "${value}". Use letters, numbers, dots, underscores, colons or hyphens.`,
      );
    }

    return normalized;
  }

  private validateAdapter(adapter: PublisherAdapter): void {
    if (!adapter || typeof adapter !== "object") {
      throw new Error("Publisher adapter must be an object");
    }

    if (
      typeof adapter.channel !== "string" ||
      !adapter.channel.trim()
    ) {
      throw new Error(
        "Publisher adapter must expose a non-empty channel",
      );
    }

    if (typeof adapter.health !== "function") {
      throw new Error(
        `Publisher adapter "${adapter.channel}" must implement health()`,
      );
    }

    if (typeof adapter.publish !== "function") {
      throw new Error(
        `Publisher adapter "${adapter.channel}" must implement publish()`,
      );
    }
  }

  private errorMessage(error: unknown): string {
    return error instanceof Error
      ? error.message
      : String(error ?? "Unknown publisher error");
  }
}
