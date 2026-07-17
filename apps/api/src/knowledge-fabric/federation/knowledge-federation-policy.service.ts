import { Injectable } from "@nestjs/common";
import { FederationNode, FederationPolicyDecision, FederationTrustLevel } from "./knowledge-federation.types";
import { KnowledgeFederationTrustService } from "./knowledge-federation-trust.service";
@Injectable()
export class KnowledgeFederationPolicyService {
  constructor(private readonly trust:KnowledgeFederationTrustService){}
  evaluate(node:FederationNode,namespace:string,minimum:FederationTrustLevel):FederationPolicyDecision { const result=this.trust.evaluate(node,minimum); const namespaceAllowed=node.namespace===namespace||node.capabilities.includes("cross-namespace"); return {allowed:result.allowed&&namespaceAllowed,reason:!result.allowed?"Trust or node state requirement failed":namespaceAllowed?"Federation policy allowed":"Namespace access denied",nodeId:node.id,namespace,evaluatedAt:new Date().toISOString()}; }
}