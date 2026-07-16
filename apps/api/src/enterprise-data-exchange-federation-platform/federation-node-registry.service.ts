import { Injectable, NotFoundException } from "@nestjs/common";
import type { FederationNodeRecord } from "./enterprise-data-exchange-federation.types";

@Injectable()
export class FederationNodeRegistryService {
  private readonly nodes = new Map<string, FederationNodeRecord>();

  register(
    input: Omit<FederationNodeRecord, "createdAt" | "updatedAt">,
  ): FederationNodeRecord {
    const existing = this.nodes.get(input.id);
    const now = new Date().toISOString();

    const node: FederationNodeRecord = {
      ...input,
      capabilities: [...input.capabilities],
      metadata: { ...input.metadata },
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.nodes.set(node.id, node);
    return this.clone(node);
  }

  get(id: string): FederationNodeRecord {
    const node = this.nodes.get(id);

    if (!node) {
      throw new NotFoundException(`Federation node '${id}' was not found.`);
    }

    return this.clone(node);
  }

  list(): FederationNodeRecord[] {
    return Array.from(this.nodes.values()).map((node) => this.clone(node));
  }

  count(): number {
    return this.nodes.size;
  }

  activeCount(): number {
    return this.list().filter((node) => node.status === "ACTIVE").length;
  }

  private clone(node: FederationNodeRecord): FederationNodeRecord {
    return {
      ...node,
      capabilities: [...node.capabilities],
      metadata: { ...node.metadata },
    };
  }
}
