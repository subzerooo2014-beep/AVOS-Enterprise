import {
  KnowledgeMeshDomain,
  KnowledgeMeshNode,
  KnowledgeMeshRequest,
  KnowledgeMeshResponse,
  KnowledgeMeshRoute,
  KnowledgeMeshSharePolicy,
} from "./knowledge-mesh.types";

export interface KnowledgeMeshRegistryContract {
  registerDomain(input: Omit<KnowledgeMeshDomain, "id" | "state" | "createdAt" | "updatedAt">): KnowledgeMeshDomain;
  registerNode(input: Omit<KnowledgeMeshNode, "id" | "state" | "registeredAt" | "updatedAt">): KnowledgeMeshNode;
}

export interface KnowledgeMeshRoutingContract {
  addRoute(input: Omit<KnowledgeMeshRoute, "id" | "createdAt">): KnowledgeMeshRoute;
  resolve(namespace: string): KnowledgeMeshRoute[];
}

export interface KnowledgeMeshPolicyContract {
  addPolicy(input: Omit<KnowledgeMeshSharePolicy, "id" | "createdAt">): KnowledgeMeshSharePolicy;
  allows(request: KnowledgeMeshRequest): boolean;
}

export interface KnowledgeMeshRuntimeContract {
  execute(input: Omit<KnowledgeMeshRequest, "id" | "requestedAt">): KnowledgeMeshResponse;
}