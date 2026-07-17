import { Injectable } from "@nestjs/common";
import { KnowledgeMeshConsistency, KnowledgeMeshDomain } from "./knowledge-mesh.types";

@Injectable()
export class KnowledgeMeshConsistencyService {
  evaluate(domain: KnowledgeMeshDomain, operation: "READ" | "WRITE" | "SYNC") {
    const writable = domain.state === "ACTIVE";
    const allowed = operation === "READ" ? domain.state !== "SUSPENDED" : writable;
    return {
      allowed,
      consistency: domain.consistency as KnowledgeMeshConsistency,
      domainState: domain.state,
      evaluatedAt: new Date().toISOString(),
    };
  }
}