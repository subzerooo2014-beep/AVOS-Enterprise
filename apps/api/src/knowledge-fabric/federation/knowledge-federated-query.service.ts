import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { KnowledgeFederationRegistryService } from "./knowledge-federation-registry.service";
import { KnowledgeFederationRouteService } from "./knowledge-federation-route.service";
import { KnowledgeFederationPolicyService } from "./knowledge-federation-policy.service";
import { KnowledgeFederationAdapterService } from "./knowledge-federation-adapter.service";
import { KnowledgeFederationQuorumService } from "./knowledge-federation-quorum.service";
import { KnowledgeFederationEventService } from "./knowledge-federation-event.service";
import { FederationQuery, FederationQueryResult } from "./knowledge-federation.types";
@Injectable()
export class KnowledgeFederatedQueryService {
  private executed=0; private failures=0;
  constructor(private readonly registry:KnowledgeFederationRegistryService,private readonly routes:KnowledgeFederationRouteService,private readonly policy:KnowledgeFederationPolicyService,private readonly adapter:KnowledgeFederationAdapterService,private readonly quorum:KnowledgeFederationQuorumService,private readonly events:KnowledgeFederationEventService){}
  execute(input:Omit<FederationQuery,"id"|"requestedAt">):FederationQueryResult { const query:FederationQuery={...input,id:randomUUID(),requestedAt:new Date().toISOString()}; const namespace=input.namespace??"default"; const routeNodes=this.routes.resolve(namespace).map(r=>r.nodeId); const candidates=this.registry.list().filter(n=>routeNodes.length===0||routeNodes.includes(n.id)); const items=[]; let succeeded=0; for(const node of candidates){ const decision=this.policy.evaluate(node,namespace,input.minimumTrust); if(!decision.allowed)continue; try{items.push(...this.adapter.query(node,input.query));succeeded++;}catch{this.failures++;} } items.sort((a,b)=>b.score-a.score); const q=this.quorum.evaluate(candidates.length,succeeded,input.mode); this.executed++; this.events.publish("knowledge.federation.query.completed",{queryId:query.id,nodesContacted:candidates.length,nodesSucceeded:succeeded,quorumMet:q.met}); return {queryId:query.id,nodesContacted:candidates.length,nodesSucceeded:succeeded,items,quorumMet:q.met,completedAt:new Date().toISOString()}; }
  metrics(){ return {queries:this.executed,failures:this.failures}; }
}