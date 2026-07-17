import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { KnowledgeMeshDomain, KnowledgeMeshNode } from "./knowledge-mesh.types";

@Injectable()
export class KnowledgeMeshRegistryService {
  private readonly domains = new Map<string, KnowledgeMeshDomain>();
  private readonly nodes = new Map<string, KnowledgeMeshNode>();

  registerDomain(input: Omit<KnowledgeMeshDomain, "id" | "state" | "createdAt" | "updatedAt">): KnowledgeMeshDomain {
    const now = new Date().toISOString();
    const domain: KnowledgeMeshDomain = { ...input, id: randomUUID(), state: "ACTIVE", createdAt: now, updatedAt: now };
    this.domains.set(domain.id, domain);
    return domain;
  }

  registerNode(input: Omit<KnowledgeMeshNode, "id" | "state" | "registeredAt" | "updatedAt">): KnowledgeMeshNode {
    this.getDomain(input.domainId);
    const now = new Date().toISOString();
    const node: KnowledgeMeshNode = { ...input, id: randomUUID(), state: "ACTIVE", registeredAt: now, updatedAt: now };
    this.nodes.set(node.id, node);
    return node;
  }

  getDomain(id: string): KnowledgeMeshDomain {
    const domain = this.domains.get(id);
    if (!domain) throw new NotFoundException("Knowledge mesh domain was not found");
    return domain;
  }

  getNode(id: string): KnowledgeMeshNode {
    const node = this.nodes.get(id);
    if (!node) throw new NotFoundException("Knowledge mesh node was not found");
    return node;
  }

  listDomains(): KnowledgeMeshDomain[] { return [...this.domains.values()]; }
  listNodes(): KnowledgeMeshNode[] { return [...this.nodes.values()]; }
  nodesForDomain(domainId: string): KnowledgeMeshNode[] { return this.listNodes().filter((node) => node.domainId === domainId); }

  updateNodeState(id: string, state: KnowledgeMeshNode["state"]): KnowledgeMeshNode {
    const node = this.getNode(id);
    node.state = state;
    node.updatedAt = new Date().toISOString();
    return node;
  }

  updateDomainState(id: string, state: KnowledgeMeshDomain["state"]): KnowledgeMeshDomain {
    const domain = this.getDomain(id);
    domain.state = state;
    domain.updatedAt = new Date().toISOString();
    return domain;
  }

  counts() { return { domains: this.domains.size, nodes: this.nodes.size }; }
}