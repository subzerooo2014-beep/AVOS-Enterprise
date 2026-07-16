import { Injectable, NotFoundException } from "@nestjs/common";
import type { CommandSourceV2 } from "./unified-command-v2.types";

@Injectable()
export class CommandSourceRegistryV2Service {
  private readonly sources = new Map<string, CommandSourceV2>();

  register(
    input: Omit<CommandSourceV2, "createdAt" | "updatedAt">,
  ): CommandSourceV2 {
    const existing = this.sources.get(input.id);
    const now = new Date().toISOString();

    const source: CommandSourceV2 = {
      ...input,
      capabilities: [...input.capabilities],
      metadata: { ...input.metadata },
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.sources.set(source.id, source);
    return this.clone(source);
  }

  get(id: string): CommandSourceV2 {
    const source = this.sources.get(id);

    if (!source) {
      throw new NotFoundException(`Command source '${id}' was not found.`);
    }

    return this.clone(source);
  }

  list(): CommandSourceV2[] {
    return Array.from(this.sources.values()).map((source) => this.clone(source));
  }

  count(): number {
    return this.sources.size;
  }

  onlineCount(): number {
    return this.list().filter((source) => source.status === "ONLINE").length;
  }

  private clone(source: CommandSourceV2): CommandSourceV2 {
    return {
      ...source,
      capabilities: [...source.capabilities],
      metadata: { ...source.metadata },
    };
  }
}
