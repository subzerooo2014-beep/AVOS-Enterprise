import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { KnowledgeExchangeRequest, KnowledgeExchangeAccessContract } from "./knowledge-exchange.types";

@Injectable()
export class KnowledgeExchangePolicyService {
  private readonly contracts: KnowledgeExchangeAccessContract[] = [];

  createContract(input: Omit<KnowledgeExchangeAccessContract, "id" | "createdAt">): KnowledgeExchangeAccessContract {
    const contract: KnowledgeExchangeAccessContract = { ...input, id: randomUUID(), createdAt: new Date().toISOString() };
    this.contracts.push(contract);
    return contract;
  }

  allows(request: KnowledgeExchangeRequest): boolean {
    if (!request.targetDomainId || request.sourceDomainId === request.targetDomainId) return true;
    return this.contracts.some((contract) =>
      contract.enabled &&
      contract.sourceDomainId === request.sourceDomainId &&
      contract.targetDomainId === request.targetDomainId &&
      contract.namespaces.includes(request.namespace) &&
      contract.operations.includes(request.operation),
    );
  }

  list(): KnowledgeExchangeAccessContract[] { return [...this.contracts]; }
  count(): number { return this.contracts.length; }
}