import { Injectable, NotFoundException } from "@nestjs/common";
import type { ReleaseChannelRecord } from "./enterprise-global-cloud.types";

@Injectable()
export class ReleaseChannelManagerService {
  private readonly channels = new Map<string, ReleaseChannelRecord>();

  register(
    input: Omit<ReleaseChannelRecord, "createdAt" | "updatedAt">,
  ): ReleaseChannelRecord {
    const existing = this.channels.get(input.id);
    const now = new Date().toISOString();

    const channel: ReleaseChannelRecord = {
      ...input,
      regions: [...input.regions],
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.channels.set(channel.id, channel);
    return this.clone(channel);
  }

  activate(id: string): ReleaseChannelRecord {
    const channel = this.requireChannel(id);
    channel.status = "ACTIVE";
    channel.updatedAt = new Date().toISOString();
    return this.clone(channel);
  }

  pause(id: string): ReleaseChannelRecord {
    const channel = this.requireChannel(id);
    channel.status = "PAUSED";
    channel.updatedAt = new Date().toISOString();
    return this.clone(channel);
  }

  list(): ReleaseChannelRecord[] {
    return Array.from(this.channels.values()).map((channel) =>
      this.clone(channel),
    );
  }

  count(): number {
    return this.channels.size;
  }

  activeCount(): number {
    return this.list().filter((channel) => channel.status === "ACTIVE").length;
  }

  private requireChannel(id: string): ReleaseChannelRecord {
    const channel = this.channels.get(id);

    if (!channel) {
      throw new NotFoundException(`Release channel '${id}' was not found.`);
    }

    return channel;
  }

  private clone(channel: ReleaseChannelRecord): ReleaseChannelRecord {
    return {
      ...channel,
      regions: [...channel.regions],
    };
  }
}
