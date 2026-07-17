import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { KnowledgeMeshRequest, KnowledgeMeshSharePolicy } from "./knowledge-mesh.types";

@Injectable()
export class KnowledgeMeshPolicyService {
  private readonly policies: KnowledgeMeshSharePolicy[] = [];

  addPolicy(input: Omit<KnowledgeMeshSharePolicy, "id" | "createdAt">): KnowledgeMeshSharePolicy {
    const policy: KnowledgeMeshSharePolicy = { ...input, id: randomUUID(), createdAt: new Date().toISOString() };
    this.policies.push(policy);
    return policy;
  }

  allows(request: KnowledgeMeshRequest): boolean {
    if (!request.targetDomainId || request.sourceDomainId === request.targetDomainId) return true;
    return this.policies.some((policy) =>
      policy.enabled &&
      policy.sourceDomainId === request.sourceDomainId &&
      policy.targetDomainId === request.targetDomainId &&
      policy.namespaces.includes(request.namespace) &&
      policy.operations.includes(request.operation),
    );
  }

  list(): KnowledgeMeshSharePolicy[] { return [...this.policies]; }
  count(): number { return this.policies.length; }
}