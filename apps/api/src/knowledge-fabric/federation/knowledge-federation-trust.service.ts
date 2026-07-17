import { Injectable } from "@nestjs/common";
import { FederationNode, FederationTrustLevel } from "./knowledge-federation.types";
@Injectable()
export class KnowledgeFederationTrustService {
  private readonly order:FederationTrustLevel[]=["UNTRUSTED","RESTRICTED","TRUSTED","SOVEREIGN"];
  allows(node:FederationNode,minimum:FederationTrustLevel){ return this.order.indexOf(node.trustLevel)>=this.order.indexOf(minimum); }
  score(level:FederationTrustLevel){ return this.order.indexOf(level)*33+1; }
  evaluate(node:FederationNode,minimum:FederationTrustLevel){ const allowed=this.allows(node,minimum)&&node.state==="ACTIVE"; return {allowed,trustScore:this.score(node.trustLevel),minimum,nodeState:node.state,evaluatedAt:new Date().toISOString()}; }
}